import { create } from 'zustand';

export const useTranscriptionStore = create((set, get) => ({
  transcription: [],
  loadingMessage: '',
  websocket: null,
  mediaRecorder: null,

  setTranscription: (transcription) => set({ transcription }),
  setLoadingMessage: (message) => set({ loadingMessage: message }),
  
  startTranscription: async (localStream, remoteStream, consultationId) => {
    if (localStream && remoteStream) {
      console.log('Starting transcription------------------');
      
      // Create audio context and destination
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const destination = audioContext.createMediaStreamDestination();

      // Add local audio tracks
      localStream.getAudioTracks().forEach(track => {
        const source = audioContext.createMediaStreamSource(new MediaStream([track]));
        source.connect(destination);
      });

      // Add remote audio tracks
      remoteStream.getAudioTracks().forEach(track => {
        const source = audioContext.createMediaStreamSource(new MediaStream([track]));
        source.connect(destination);
      });

      // Initialize WebSocket connection
      const websocket = new WebSocket(`ws://localhost:8000/ws/consultation/${consultationId}/`);

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.transcription) {
          set({ transcription: data.transcription });
          websocket.close();
        } else if (data.message) {
          console.log(data.message);
        } else if (data.error) {
          console.error("Error from server:", data.error);
        } else if (data.loading_message) {
          set({ loadingMessage: data.loading_message });
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

      mediaRecorder.start(1000);
      set({ websocket, mediaRecorder });
    }
  },

  stopTranscription: () => {
    const { mediaRecorder, websocket } = get();
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    if (websocket?.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({ action: "stop_recording" }));
    }
    set({ websocket: null, mediaRecorder: null });
  },
})); 