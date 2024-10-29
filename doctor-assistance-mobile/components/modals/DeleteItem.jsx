import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Trash, X } from 'lucide-react-native';
import { useQueryClient } from '@tanstack/react-query';

import { useDeleteMutation } from '@/hooks/useDeleteMutation';
import { useAuth } from '@/contexts/AuthContext';

export default function DeleteItem({ deleteUrl, itemName, iconSize, queryKey }) {

    const queryClient = useQueryClient();
    const { fetchWithUserAuth } = useAuth();

    const deleteMutation = useDeleteMutation({
        url: `${deleteUrl}`,
        fetchFunction: fetchWithUserAuth,
        onSuccessMessage: `${itemName} Successfully Deleted`,
        onErrorMessage: `Failed to Delete ${itemName}`,
        onSuccess: () => {
            queryClient.invalidateQueries([`${queryKey}`]);
        },
    });

    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleSubmit = () => {
        deleteMutation.mutate();
        setIsModalVisible(false);
    };

    return (
        <View>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <Trash color='red' size={iconSize} />
            </TouchableOpacity>

            <Modal animationType="slide" transparent={true} visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(false);
                }}
            >
                <View className='flex-1 relative items-center justify-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                    <View className="bg-white rounded-md p-5 shadow-lg" style={{ width: 390 }} >

                        <View className='flex flex-row justify-between'>
                            <Text className="text-xl font-bold text-primary mb-1">Delete {itemName}</Text>
                            <Pressable onPress={() => {
                                setIsModalVisible(false);
                            }}>
                                <X size={24} color="grey" />
                            </Pressable>
                        </View>

                        <Text className="text-md text-gray-500 mb-4">Are you sure you want to delete the {itemName}</Text>

                        <View className="flex-row justify-end mt-4">
                            <TouchableOpacity
                                onPress={() => {
                                    setIsModalVisible(false);
                                }}
                                className="mr-4 bg-gray-200 px-4 py-2 rounded-md"
                            >
                                <Text className="text-gray-700">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSubmit} className="bg-primary px-4 py-2 rounded-md">
                                <Text className="text-white font-bold">Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
