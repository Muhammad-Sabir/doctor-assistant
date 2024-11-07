import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, Dimensions } from 'react-native';
import { Trash, TriangleAlertIcon, X } from 'lucide-react-native';

export default function AppointmentRejectReason({ reason }) {

    const screenWidth = Dimensions.get('window').width;
    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <View>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <TriangleAlertIcon color='red' size={15} />
            </TouchableOpacity>

            <Modal animationType="slide" transparent={true} visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(false);
                }}
            >
                <View className='flex-1 relative items-center justify-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                    <View className="bg-white rounded-md p-5" style={{ width: screenWidth * 0.91 }} >

                        <View className='flex flex-row justify-between'>
                            <Text className="text-xl font-bold text-primary mb-1">Appointment Rejected</Text>
                            <Pressable onPress={() => {
                                setIsModalVisible(false);
                            }}>
                                <X size={24} color="grey" />
                            </Pressable>
                        </View>

                        <Text className="text-md text-gray-500 mb-4">This appointment has been rejected by the Doctor</Text>
                        <Text className='text-md text-gray-600'>Reason of Rejection: {reason}</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
