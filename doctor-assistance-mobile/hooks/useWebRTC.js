import { useEffect, useState, useRef } from "react";
import { RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, mediaDevices } from 'react-native-webrtc';

import { getCallSocket } from "@/utils/getCallSocket";
import { useAuth } from '@/contexts/AuthContext';

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
    const { user } = useAuth();
    const [isCallActive, setIsCallActive] = useState(false);
    const [isIncomingCall, setIsIncomingCall] = useState(false);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [senderName, setSenderName] = useState(null);
    const consultationId = useRef(null);
    const incomingOffer = useRef(null);
    const peerConnection = useRef(null);
    const storedCandidates = useRef([]);
    const socket = useRef(null);

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
        socket.current = getCallSocket(user.access_token);
        socket.current.onmessage = handleSocketMessage;
    }, []);

    const handleSocketMessage = async (event) => {
        const data = JSON.parse(event.data);
        const { type, offer, candidate, consultationId: incomingConsultationId, sender } = data.message || {};

        switch (type) {
            case 'call_received':
                console.log('sender_details', sender);
                console.log('sender_Offferrrrrrrrr', offer);
                consultationId.current = incomingConsultationId;
                incomingOffer.current = offer;
                console.log('incoming -ffrrr', incomingOffer.current);
                setSenderName(sender.name);
                setIsIncomingCall(true);
                break;
            case 'icecandidate':
                if (candidate) {
                    await handleIceCandidate(candidate);
                }
                break;
            case 'call_ended':
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

        // stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));
        try {
            const stream = await mediaDevices.getUserMedia({
                video: { 
                    facingMode: 'user'
                },
                audio: true,
            });
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
                console.log('No peer connection when receiving ICE candidate');
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
        senderName,
        isIncomingCall,
        setIsIncomingCall,
        answerCall,
        rejectCall,
        endCall,
    };
};

export default useWebRTC;
