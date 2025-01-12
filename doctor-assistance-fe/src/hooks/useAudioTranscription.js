import { useState, useRef } from 'react';

const RECORDING_TIMEOUT = 500; // milliseconds

export const useAudioTranscription = (consultationId) => {
  const [transcription, setTranscription] = useState([]);
  const mediaRecorderRef = useRef(null);
  const websocketRef = useRef(null);

  const appendTranscription = (message) => {
    setTranscription((prev) => `${prev}${message}\n`);
  };

  const initializeWebSocket = () => {
    const websocket = new WebSocket(`ws://localhost:8000/ws/consultation/${consultationId}/`);
    websocket.onopen = () => console.log('WebSocket connected.');
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.transcription) {
        setTranscription(data.transcription);
        websocket.close();
      } else if (data.message) {
        appendTranscription(data.message);
      } else if (data.error) {
        console.error('Error from server:', data.error);
      }
    };
    websocket.onclose = () => {
      console.log('WebSocket connection closed.');
    };
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
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

    const websocket = websocketRef.current;
    if (websocket?.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({ action: 'stop_recording' }));
    }
    // Do not close the WebSocket here
  };

  const isRecording = () => {
    return mediaRecorderRef.current?.state === 'recording';
  };

  const isPaused = () => {
    return mediaRecorderRef.current?.state === 'paused';
  };

  return {
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    transcription,
  };
};
