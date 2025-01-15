import { useEffect, useRef, useState } from "react";

export const useVideoCallTranscription = (consultationId) => {
  const websocketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [transcription, setTranscription] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState('');

  const changeLoadingMessage = (message) => {
    setLoadingMessage(message);
  };

  const startTranscription = (localStream) => {
    console.log("Not recieved");
    if (localStream) {
      console.log('Starting transcription------------------');
      // Create audio context and destination
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const destination = audioContext.createMediaStreamDestination();

      // Add only local audio tracks
      localStream.getAudioTracks().forEach(track => {
        const source = audioContext.createMediaStreamSource(new MediaStream([track]));
        source.connect(destination);
      });

      // Initialize WebSocket connection
      const websocket = new WebSocket(`ws://localhost:8000/ws/consultation/${consultationId}/`);

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.transcription) {
          setTranscription(data.transcription);
          websocket.close();
        } else if (data.message) {
          console.log(data.message);
        } else if (data.error) {
          console.error("Error from server:", data.error);
        } else if (data.loading_message) {
          changeLoadingMessage(data.loading_message);
        }
      };

      websocket.onerror = (error) => console.error("WebSocket error:", error);
      websocket.onclose = () => console.log("WebSocket for transcription closed.");

      // Create MediaRecorder for the combined audio stream
      const mediaRecorder = new MediaRecorder(destination.stream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (websocket.readyState === WebSocket.OPEN) {
          websocket.send(event.data);
          console.log("data sent");
        }
        console.log("data not sent");
      };

      mediaRecorder.start(5000); // Send data every second
      websocketRef.current = websocket;
      mediaRecorderRef.current = mediaRecorder;
    }
  };

  const stopTranscription = () => {
    mediaRecorderRef?.current?.stop();
    const websocket = websocketRef.current;
    if (websocket?.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({ action: "stop_recording" }));
    }
  };

  return {
    transcription,
    loadingMessage,
    startTranscription,
    stopTranscription
  };
};
