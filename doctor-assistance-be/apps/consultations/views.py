import os
import re
import json
import logging

import torch
from transformers import BartTokenizer, BartForConditionalGeneration
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import SAFE_METHODS, IsAuthenticated
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from collections import OrderedDict

from apps.profiles.permissions import IsDoctor, IsDoctorOrOwner
from apps.consultations.models import (
    Consultation, SOAPNotes, Prescription, Transcription
)
from apps.consultations.serializers import (
    ConsultationSerializer, SOAPNotesSerializer,
    PrescriptionSerializer, TranscriptionSerializer
)
from apps.consultations.filters import ConsultationFilter, PrescriptionFilter

logging.basicConfig(level=logging.INFO)

# Define the path to the `bart-soap` folder
MODEL_PATH = os.path.join(settings.BASE_DIR, "mlmodel", "bart-soap")

print("Model path:", MODEL_PATH)


tokenizer = BartTokenizer.from_pretrained('facebook/bart-large')
model = BartForConditionalGeneration.from_pretrained(MODEL_PATH)
model.eval()

logging.info("SOAP Notes model loaded successfully.")


all_subsections = {
    **{
        "cc": ["cc :", "chief complaint :", "reason for visit :", "CHIEF COMPLAINT"],
        "hpi": ["history :", "history of present illness :", "history of present illness", "hpi :", "hpi", "hpi notes :", 
                "interval history :", "interval hx :", "subjective :", "HISTORY OF PRESENT ILLNESS"],
        "ros": ["ros :", "review of system :", "review of systems :", "REVIEW OF SYSTEMS"],
        "other_histories": ["SOCIAL HISTORY", "PAST HISTORY"]
    },
    **{
        "pe": ["physical exam :", "physical examination :", "pe :", "physical findings :", "examination :", "exam :",
               "PHYSICAL EXAMINATION", "PHYSICAL EXAM"],
        "vitals": ["VITALS REVIEWED"]
    },
    **{
        "findings": ["results :", "findings :", "RESULTS", "FINDINGS"]
    },
    **{
        "assessment": ["assessment :", "a:", "ASSESSMENT"],
        "plan": ["plan :", "plan of care :", "p:", "medical decision-making plan :", "summary plan", "PLAN"],
        "ap": ["ap :", "a / p :", "assessment and plan :", "assessment & plan :", "disposition / plan :", "ASSESSMENT AND PLAN"]
    },
    **{
        "instructions": ["instructions :", "INSTRUCTIONS"]
    }
}

keyword_pattern = r"(?:" + "|".join([re.escape(keyword) for keywords in all_subsections.values() for keyword in keywords]) + ")"

def generate_soap_notes(conversation):
    inputs = tokenizer(
        [conversation],
        max_length=1024,
        truncation=True,
        return_tensors="pt"
    )

    with torch.no_grad():
        generated_ids = model.generate(
            input_ids=inputs['input_ids'],
            attention_mask=inputs['attention_mask'],
            max_length=1024,
            num_beams=4,
            early_stopping=True
        )

    soap_notes = tokenizer.decode(
        generated_ids[0],
        skip_special_tokens=True,
        clean_up_tokenization_spaces=False
    ).replace("\n", " ")

    matches = re.split(f"({keyword_pattern})", soap_notes, flags=re.IGNORECASE)

    soap_notes_json = OrderedDict()
    current_key = None
    buffer = ""

    for part in matches:
        is_header = False
        for key, keywords in all_subsections.items():
            if part.strip().lower() in [k.lower() for k in keywords]:
                if current_key: 
                    soap_notes_json[current_key] = buffer.strip()
                current_key = key
                buffer = ""
                is_header = True
                break

        if not is_header:
            buffer += part

    if current_key:
        soap_notes_json[current_key] = buffer.strip()

    return json.dumps(dict(soap_notes_json))

class ConsultationsViewSet(ModelViewSet):
    serializer_class = ConsultationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ConsultationFilter

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [IsAuthenticated()]
        return [IsDoctorOrOwner()]

    def get_queryset(self):
        return self.get_consultations(self.request.user)

    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user.doctor)

    def get_consultations(self, user):
        if user.role == 'patient':
            return Consultation.objects.select_related(
                'doctor__user',
                'patient__user',
                'patient__primary_patient__user'
            ).filter(
                Q(patient__user=user) | Q(patient__primary_patient__user=user)
            )
        return Consultation.objects.select_related(
            'doctor__user',
            'patient__user',
            'patient__primary_patient__user'
        ).filter(doctor__user=user)

class SOAPNotesViewSet(ModelViewSet):
    serializer_class = SOAPNotesSerializer
    permission_classes = [IsDoctor]

    def get_queryset(self):
        user = self.request.user
        return SOAPNotes.objects.select_related('consultation') \
            .only('consultation', 'subject', 'description', 'created_at', 'updated_at') \
            .filter(consultation__doctor=user.doctor)

class TranscriptionViewSet(ModelViewSet):
    serializer_class = TranscriptionSerializer
    permission_classes = [IsDoctor]

    def get_queryset(self):
        user = self.request.user
        return Transcription.objects.select_related('consultation') \
            .only('consultation', 'transcription_text', 'created_at', 'updated_at') \
            .filter(consultation__doctor=user.doctor)

    def create(self, request, *args, **kwargs):
        # Serialize and validate the input data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save the transcription instance
        transcription = serializer.save()

        # Generate SOAP notes using the transcription text
        transcription_text = transcription.transcription_text
        soap_notes_text = generate_soap_notes(transcription_text)

        # Save the generated SOAP notes
        soap_notes = SOAPNotes.objects.create(
            consultation=transcription.consultation,
            subject='Generated SOAP Notes',
            description=soap_notes_text
        )

        # Optionally, you can serialize the SOAP notes if you want to include them in the response
        soap_notes_serializer = SOAPNotesSerializer(soap_notes)

        # Return the transcription data along with the generated SOAP notes
        response_data = {
            'soap_notes': soap_notes_serializer.data
        }

        return Response(response_data, status=status.HTTP_201_CREATED)

class PrescriptionViewSet(ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PrescriptionFilter

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [IsAuthenticated()]
        return [IsDoctor()]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            filters = Q(consultation__patient__user=user) | Q(consultation__patient__primary_patient__user=user)
        else:
            filters = Q(consultation__doctor__user=user)
        return Prescription.objects.select_related(
            'consultation__patient__user',
            'consultation__patient__primary_patient__user',
            'consultation__doctor__user'
        ).filter(filters)
