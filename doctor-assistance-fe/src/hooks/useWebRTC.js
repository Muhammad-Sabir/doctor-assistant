import { useEffect, useState, useRef } from "react";

import { getCallSocket } from "@/utils/callSocket";
import useChatStore from "@/store/ChatStore";

const pcConfig = {
    iceServers: [
        {
            urls: "stun:stun.relay.metered.ca:80",
        },
        {
            urls: "turn:global.relay.metered.ca:80",
            username: "b0dce60ee52a903d395e071c",
            credential: "2eVOQ/n9jYlOKpoy",
        },
        {
            urls: "turn:global.relay.metered.ca:80?transport=tcp",
            username: "b0dce60ee52a903d395e071c",
            credential: "2eVOQ/n9jYlOKpoy",
        },
        {
            urls: "turn:global.relay.metered.ca:443",
            username: "b0dce60ee52a903d395e071c",
            credential: "2eVOQ/n9jYlOKpoy",
        }
    ],
    iceCandidatePoolSize: 10
};

const useWebRTC = () => {
    const [isCallActive, setIsCallActive] = useState(false);
    const [isIncomingCall, setIsIncomingCall] = useState(false);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const consultationId = useRef(null);
    const incomingOffer = useRef(null);
    const peerConnection = useRef(null);
    const storedCandidates = useRef([]);
    const socket = useRef(null);
    const { setRecipient } = useChatStore();

    const cleanup = () => {
        setLocalStream(null);
        setRemoteStream(null);
        
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }

        if (isIncomingCall) {
            setIsIncomingCall(false);
        }
    };

    useEffect(() => {
        socket.current = getCallSocket();
        socket.current.onmessage = handleSocketMessage;
    }, []);

    const handleSocketMessage = async (event) => {
        const data = JSON.parse(event.data);
        const { type, offer, answer, candidate, consultationId: incomingConsultationId, sender } = data.message || {};

        console.log('Received message:', type);

        switch (type) {
            case 'call_received':
                setRecipient(sender?.id, sender?.name);
                console.log('sender_details', sender);
                consultationId.current = incomingConsultationId;
                incomingOffer.current = offer;
                setIsIncomingCall(true);
                break;
            case 'call_answered':
                await setRemoteDescription(answer);
                break;
            case 'icecandidate':
                if (candidate) {
                    await handleIceCandidate(candidate);
                }
                break;
            case 'call_ended':
            case 'call_rejected':
                cleanup();
                setIsCallActive(false);
                break;
            default:
                console.log('Unexpected event:', type);
                break;
        }
    };

    const setupPeerConnection = async() => {        
        peerConnection.current = new RTCPeerConnection(pcConfig);

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('ICE candidate generated:', event.candidate);
                sendMessage('icecandidate', { candidate: event.candidate });
            }
        };

        peerConnection.current.ontrack = (event) => {
            console.log('Remote track received:', event.streams[0]);
            setRemoteStream(event.streams[0]);
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));
        } catch (err) {
            console.error('Error accessing media devices:', err);
            throw new Error('Could not access media devices');
        }
    };

    const sendMessage = (type, content) => {
        if (socket.current?.readyState === WebSocket.OPEN) {
            const message = {
                message: {
                    type,
                    ...content,
                    consultationId: consultationId.current
                }
            };
            console.log('Sending message:', message);
            socket.current.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not open');
        }
    };

    const handleIceCandidate = async (candidate) => {
        try {
            if (!peerConnection.current) {
                console.warn('No peer connection when receiving ICE candidate');
                return;
            }

            const iceCandidate = new RTCIceCandidate(candidate);
            
            if (peerConnection.current.remoteDescription) {
                await peerConnection.current.addIceCandidate(iceCandidate);
                console.log('ICE candidate added successfully');
            } else {
                storedCandidates.current.push(iceCandidate);
                console.log('ICE candidate stored for later');
            }
        } catch (err) {
            console.error('Error handling ICE candidate:', err);
        }
    };

    const setRemoteDescription = async (answer) => {
        try {
            if (!peerConnection.current) {
                throw new Error('No peer connection available');
            }

            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
            console.log('Remote description set successfully');
        } catch (err) {
            console.error('Error setting remote description:', err);
            throw err;
        }
    };

    const startCall = async (newConsultationId) => {
        try {
            consultationId.current = newConsultationId;
            await setupPeerConnection();

            const offer = await peerConnection.current.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });
            
            await peerConnection.current.setLocalDescription(offer);

            sendMessage('call_received', { offer });
            setIsCallActive(true);
        } catch (err) {
            console.error('Error starting call:', err);
            cleanup();
            throw err;
        }
    };

    const answerCall = async () => {
        try {
            if (!incomingOffer.current) {
                throw new Error('No incoming offer available');
            }

            await setupPeerConnection();
            
            await peerConnection.current.setRemoteDescription(
                new RTCSessionDescription(incomingOffer.current)
            );

            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            
            sendMessage('call_answered', { answer });
            setIsCallActive(true);
            incomingOffer.current = null;

            while (storedCandidates.current.length > 0) {
                const candidate = storedCandidates.current.shift();
                await peerConnection.current.addIceCandidate(candidate);
            }
        } catch (err) {
            console.error('Error answering call:', err);
            cleanup();
            throw err;
        }
    };

    const rejectCall = () => {
        sendMessage('call_rejected');
        cleanup();
        incomingOffer.current = null;
        consultationId.current = null;
    };

    const endCall = () => {
        sendMessage('call_ended');
        cleanup();
        setIsCallActive(false);
        incomingOffer.current = null;
        consultationId.current = null;
    };

    return {
        localStream,
        remoteStream,
        isCallActive,
        isIncomingCall,
        startCall,
        answerCall,
        rejectCall,
        endCall,
    };
};

export default useWebRTC;
