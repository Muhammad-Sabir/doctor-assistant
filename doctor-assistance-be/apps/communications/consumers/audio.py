import json
import tempfile
import asyncio
import boto3
import uuid

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from decouple import config

from apps.consultations.models import Transcription
from apps.consultations.models import Consultation

AWS_ACCESS_KEY_ID = config('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_ACCESS_KEY')
AWS_DEFAULT_REGION = config('AWS_DEFAULT_REGION')


class ConsultationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.consultation_id = self.scope['url_route']['kwargs']['consultation_id']
        self.group_name = f"consultation_{self.consultation_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # Temporary file to hold audio data
        self.audio_file = tempfile.NamedTemporaryFile(
            delete=False, suffix=".webm")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        if bytes_data:
            try:
                self.audio_file.write(bytes_data)
            except Exception as e:
                print("ERRRRRRRRRRRRRRRRORRRRRRRRRRRR ", e)
        elif text_data:
            data = json.loads(text_data)
            if data.get('action') == 'stop_recording':
                await self.handle_transcription()

    async def audio_transcription(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message']
        }))

    async def handle_transcription(self):
        try:
            await asyncio.sleep(1)
            self.audio_file.close()

            # AWS S3 upload
            s3_client = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY_ID,
                                     aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                                     region_name=AWS_DEFAULT_REGION)
            bucket_name = 'doctor-assistance-transcription'
            s3_audio_path = f"input/consultation_{self.consultation_id}.webm"

            # Upload audio file to S3
            with open(self.audio_file.name, 'rb') as audio_data:
                await asyncio.wait_for(
                    asyncio.to_thread(s3_client.upload_fileobj,
                                      audio_data, bucket_name, s3_audio_path),
                    timeout=120
                )
            print("HERRE")
            # Trigger AWS Transcribe transcription
            await self.trigger_transcribe(bucket_name, s3_audio_path)
        except asyncio.TimeoutError:
            await self.send(text_data=json.dumps({'error': 'File upload timed out'}))
        except Exception as e:
            await self.send(text_data=json.dumps({'error': f'Error during transcription: {str(e)}'}))

    async def trigger_transcribe(self, bucket_name, audio_file_path):
        """Start AWS Transcribe transcription job with speaker diarization."""
        transcribe_client = boto3.client('transcribe', aws_access_key_id=AWS_ACCESS_KEY_ID,
                                         aws_secret_access_key=AWS_SECRET_ACCESS_KEY, region_name=AWS_DEFAULT_REGION)

        # Generate a unique identifier
        self.unique_id = str(uuid.uuid4())
        self.transcription_job_name = f"consultation_{
            self.consultation_id}_{self.unique_id}"
        self.output_key = f"output/consultation_{
            self.consultation_id}_{self.unique_id}.json"

        # Start transcription job with diarization
        response = transcribe_client.start_transcription_job(
            TranscriptionJobName=self.transcription_job_name,
            Media={'MediaFileUri': f"s3://{bucket_name}/{audio_file_path}"},
            MediaFormat='webm',
            LanguageCode='en-US',  # Set your language preference
            Settings={
                'ShowSpeakerLabels': True,
                'MaxSpeakerLabels': 2  # Doctor and patient
            },
            OutputBucketName=bucket_name,
            OutputKey=self.output_key
        )

        # Check transcription status using the unique job name
        await self.check_transcription_status(self.transcription_job_name, bucket_name)

    async def check_transcription_status(self, job_name, bucket_name):
        """Poll AWS Transcribe until transcription is complete."""
        transcribe_client = boto3.client('transcribe', aws_access_key_id=AWS_ACCESS_KEY_ID,
                                         aws_secret_access_key=AWS_SECRET_ACCESS_KEY, region_name=AWS_DEFAULT_REGION)

        while True:
            print("Checking aws Transcribe")
            job_status = transcribe_client.get_transcription_job(
                TranscriptionJobName=job_name
            )['TranscriptionJob']

            status = job_status['TranscriptionJobStatus']

            if status == 'COMPLETED':
                await self.retrieve_and_send_transcription(bucket_name)
                break
            elif status == 'FAILED':
                await self.send(text_data=json.dumps({'error': 'Transcription failed'}))
                break

            await asyncio.sleep(5)

    async def retrieve_and_send_transcription(self, bucket_name):
        """Retrieve transcription data from the transcript file in the output folder."""
        s3_client = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                                 region_name=AWS_DEFAULT_REGION)
        key = self.output_key  # Use the unique output key

        transcript_data = s3_client.get_object(Bucket=bucket_name, Key=key)
        transcript_json = json.loads(transcript_data['Body'].read())

        # Extract the detailed transcript
        audio_segments = transcript_json.get(
            "results", {}).get("audio_segments", [])

        await self.create_transcription(audio_segments)
        
        # Send transcription to the client
        await self.send(text_data=json.dumps({
            'message': 'Transcription completed',
            'transcription': audio_segments
        }))
        
    @database_sync_to_async
    def create_transcription(self, audio_segments):
        print("audio_segments:", audio_segments)
        consultation = Consultation.objects.filter(id=self.consultation_id).first()

        Transcription.objects.create(
            consultation=consultation, 
            transcription_text=audio_segments
        )
        