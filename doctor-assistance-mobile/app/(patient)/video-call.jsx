import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import { Mic, Video, VideoOff, PhoneOff, MicOff, SwitchCamera, Phone, MonitorSmartphone } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { useWebRTCContext } from '@/contexts/WebRTCContext';

const VideoCallScreen = () => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    // const [localStream, setlocalStream] = useState(null);
    const router = useRouter();
    const { localStream, remoteStream, endCall, answerCall, isCallActive } = useWebRTCContext();

    const toggleMute = () => {
        setIsMuted((prev) => !prev);
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = isMuted;
            }
        }
    };

    const toggleVideo = () => {
        setIsVideoOn((prev) => !prev);
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !isVideoOn;
            }
        }
    };

    function switchCamera() {
        localStream.getVideoTracks().forEach((track) => {
            track._switchCamera();
        });
    }

    const handleCall = () => {
        if (isCallActive) {
            endCall();
            router.push('(patient)/');
        } else {
            answerCall();
        }
    };

    return (
        <View className="flex-1 bg-gray-300 items-center justify-center">

            <View className="items-center justify-center">
                <View className="h-full flex-1 flex-col items-center gap-3 justify-center text-gray-500">
                    <MonitorSmartphone color="gray" size={140} />
                    <Text className="mt-4 text-gray-600 text-center text-lg">Press Join button to join the video call</Text>
                </View>
            </View>

            {localStream && (
                <RTCView
                    streamURL={localStream.toURL()}
                    style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0, }}
                    objectFit="cover"
                />
            )}

            <View className="absolute top-20 right-5 w-40 h-52 rounded-md overflow-hidden">
                {remoteStream && (
                    <RTCView
                        streamURL={remoteStream.toURL()}
                        style={{ width: '100%', height: '100%' }}
                        objectFit="cover"
                    />
                )}
            </View>

            <View className="absolute bottom-14 flex-row justify-around w-3/4" style={{ zIndex: 10 }}>
                <TouchableOpacity onPress={toggleVideo} className="bg-gray-700 p-4 rounded-full">
                    {isVideoOn ? <Video color="white" size={28} /> : <VideoOff color="white" size={28} />}
                </TouchableOpacity>

                <TouchableOpacity onPress={handleCall} className={`${isCallActive ? 'bg-red-500' : 'bg-green-500'} p-4 rounded-full`}>
                    {isCallActive ? <PhoneOff color="white" size={28} /> : <Phone color="white" size={28} />}
                </TouchableOpacity>

                <TouchableOpacity onPress={toggleMute} className="bg-gray-700 p-4 rounded-full">
                    {isMuted ? <MicOff color="white" size={28} /> : <Mic color="white" size={28} />}
                </TouchableOpacity>

                {isVideoOn && isCallActive && (
                    <TouchableOpacity onPress={switchCamera} className="bg-gray-700 p-4 rounded-full">
                        <SwitchCamera color="white" size={28} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default VideoCallScreen;
