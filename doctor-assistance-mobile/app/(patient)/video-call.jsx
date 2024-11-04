import React, { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Mic, Video, VideoOff, PhoneOff, MicOff, SwitchCamera } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import doctorImage from '@/assets/images/doctor-call.jpeg';
import patientImage from '@/assets/images/patient-call.jpg';
import videoOffImage from '@/assets/images/dummy-user.jpg';

const VideoCallScreen = () => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isFrontCamera, setIsFrontCamera] = useState(true);
    const router = useRouter();

    const toggleMute = () => setIsMuted((prev) => !prev);
    const toggleVideo = () => setIsVideoOn((prev) => !prev);

    const toggleCamera = () => setIsFrontCamera((prev) => !prev);

    const endCall = () => {
        router.push('(patient)/');
    };

    return (
        <View className="flex-1 bg-gray-400 items-center justify-center">

            <Image source={doctorImage} className="absolute w-full h-full" />

            <View className="absolute top-20 right-5 w-40 h-52 rounded-md overflow-hidden">
                <Image source={isVideoOn ? patientImage : videoOffImage} className="w-full h-full" />

                {isVideoOn &&
                    <TouchableOpacity onPress={toggleCamera} className="absolute bottom-2 right-2 bg-gray-700 p-2 rounded-full">
                        <SwitchCamera color="white" size={20} />
                    </TouchableOpacity>
                }
            </View>

            <View className="absolute bottom-14 flex-row justify-around w-3/4">
                <TouchableOpacity onPress={toggleVideo} className="bg-gray-700 p-4 rounded-full">
                    {isVideoOn ? <Video color="white" size={28} /> : <VideoOff color="white" size={28} />}
                </TouchableOpacity>

                <TouchableOpacity onPress={endCall} className="bg-red-600 p-4 rounded-full">
                    <PhoneOff color="white" size={28} />
                </TouchableOpacity>

                <TouchableOpacity onPress={toggleMute} className="bg-gray-700 p-4 rounded-full">
                    {isMuted ? <MicOff color="white" size={28} /> : <Mic color="white" size={28} />}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default VideoCallScreen;
