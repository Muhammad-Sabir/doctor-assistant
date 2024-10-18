import { useState, useRef } from 'react';

const RECORDING_TIMEOUT = 5000; // milliseconds


export const useAudioTranscription = (consultationId) => {
	const [transcription, setTranscription] = useState('');
	const mediaRecorderRef = useRef(null);
	const websocketRef = useRef(null);

	const appendTranscription = (message) => {
		setTranscription((prev) => `${prev}${message}\n`);
	};

	const initializeWebSocket = () => {
		const websocket = new WebSocket(`ws://localhost:8000/ws/consultation/${consultationId}/`);
		websocket.onopen = () => console.log('WebSocket connected.');
		websocket.onmessage = (event) => {
			const { message } = JSON.parse(event.data);
			appendTranscription(message);
		};
		return websocket;
	};

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			const websocket = initializeWebSocket();

			mediaRecorder.ondataavailable = (event) => {
				if (websocket.readyState === WebSocket.OPEN) {
					websocket.send(event.data);
					console.log('Audio chunk sent');
				}
			};

			mediaRecorder.start(RECORDING_TIMEOUT);
			mediaRecorderRef.current = mediaRecorder;
			websocketRef.current = websocket;
		} catch (error) {
			console.error('Error accessing microphone:', error);
		}
	};

	const pauseRecording = () => {
		if (isRecording()) {
			mediaRecorderRef.current.pause();
		}
	};

	const resumeRecording = () => {
		if (isPaused()) {
			mediaRecorderRef.current.resume();
		}
	};

	const stopRecording = () => {
		if (!isRecording() && !isPaused()) return;

		mediaRecorderRef.current.stop();
		closeWebSocketAfterDelay(RECORDING_TIMEOUT);
	};

	const isRecording = () => {
		return mediaRecorderRef.current?.state === 'recording';
	};

	const isPaused = () => {
		return mediaRecorderRef.current?.state === 'paused';
	};

	const closeWebSocketAfterDelay = (delay) => {
		setTimeout(() => {
			const websocket = websocketRef.current;
			if (websocket?.readyState === WebSocket.OPEN) {
				websocket.close();
			}
		}, delay);
	};

	return {
		startRecording,
		pauseRecording,
		resumeRecording,
		stopRecording,
	};
};
