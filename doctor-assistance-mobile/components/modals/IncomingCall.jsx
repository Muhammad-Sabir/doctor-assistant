import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Modal, TouchableOpacity, Animated } from 'react-native';
import { Phone, PhoneCall, PhoneOff } from 'lucide-react-native';

import { useWebRTCContext } from '@/contexts/WebRTCContext';

const IncomingCallModal = ({visible, onClose}) => {

    const { senderName, rejectCall} = useWebRTCContext();
    const bounceValue = new Animated.Value(1);
    const router = useRouter();

    useEffect(() => {
        
        const loopAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(bounceValue, {
                    toValue: 1.1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceValue, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
    
        loopAnimation.start();
    
        return () => loopAnimation.stop();
    }, [bounceValue]);

    const handleAccept = () => {
        onClose();
        console.log("Call accepted");
        // answerCall();
        router.push('(patient)/video-call')
    };

    const handleCancel = () => {
        onClose();
        rejectCall();
        console.log("Call canceled");
        router.push('(patient)/');
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
            <View className='flex-1' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View className='flex-1' />
                <View className="bg-white rounded-md z-10 p-11 justify-center items-center">
                    <Text className="text-primary text-2xl font-bold">{ senderName }</Text>
                    <Text className="text-gray-400 text-lg mb-10 mt-2">Incoming video call...</Text>

                    <Animated.View style={{ transform: [{ scale: bounceValue }] }} className='bg-accent p-5 rounded-full'>
                        <PhoneCall color='hsl(203, 87%, 30%)' size={50} />
                    </Animated.View>

                    <View className="flex-row justify-between items-center mt-10">
                        <View className='mr-16 flex justify-center items-center'>
                            <TouchableOpacity onPress={handleAccept} className="items-center bg-green-800 p-4 rounded-full">
                                <Phone color="white" size={28} />
                            </TouchableOpacity>
                            <Text className='mt-2 text-gray-700'>Accept</Text>
                        </View>

                        <View className='flex justify-center items-center'>
                            <TouchableOpacity onPress={handleCancel} className="items-center bg-red-600 p-4 rounded-full">
                                <PhoneOff color="white" size={28} />
                            </TouchableOpacity>
                            <Text className='mt-2 text-gray-700'>Decline</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default IncomingCallModal;