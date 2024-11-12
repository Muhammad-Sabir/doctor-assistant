import React, { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { RTCView} from 'react-native-webrtc';
import { Mic, Video, VideoOff, PhoneOff, MicOff, SwitchCamera, Phone } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { useWebRTCContext } from '@/contexts/WebRTCContext';
import doctorImage from '@/assets/images/doctor-call.jpeg';
import patientImage from '@/assets/images/patient-call.jpg';
import videoOffImage from '@/assets/images/dummy-user.jpg';

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
        <View className="flex-1 bg-gray-400 items-center justify-center">

            <Image source={doctorImage} className="absolute w-full h-full" />
            
            {localStream && (
                    <RTCView
                        streamURL={localStream.toURL()}
                        style={{ width: '100%', height: '100%', position: 'absolute'}}
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
                
                {isVideoOn &&
                    <TouchableOpacity onPress={switchCamera} className="absolute bottom-2 right-2 bg-gray-700 p-2 rounded-full">
                        <SwitchCamera color="white" size={20} />
                    </TouchableOpacity>
                }
            </View>

            <View className="absolute bottom-14 flex-row justify-around w-3/4">
                <TouchableOpacity onPress={toggleVideo} className="bg-gray-700 p-4 rounded-full">
                    {isVideoOn ? <Video color="white" size={28} /> : <VideoOff color="white" size={28} />}
                </TouchableOpacity>

                <TouchableOpacity onPress={handleCall} className={`${isCallActive ? 'bg-red-500' : 'bg-green-500'} p-4 rounded-full`}>
                    {isCallActive ? <PhoneOff color="white" size={28} /> : <Phone color="white" size={28} />}
                </TouchableOpacity>

                <TouchableOpacity onPress={toggleMute} className="bg-gray-700 p-4 rounded-full">
                    {isMuted ? <MicOff color="white" size={28} /> : <Mic color="white" size={28} />}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default VideoCallScreen;
