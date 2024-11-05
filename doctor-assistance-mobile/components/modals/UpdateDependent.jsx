import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Pressable, Dimensions } from 'react-native';
import { CheckCircle, Circle, Pencil, TriangleAlert, X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/AuthContext';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';

export default function UpdateDependent({ selectedDependent }) {

    const { fetchWithUserAuth } = useAuth();
    const queryClient = useQueryClient();
    const screenWidth = Dimensions.get('window').width;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [inputErrors, setInputErrors] = useState({});
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [dependent, setDependent] = useState(selectedDependent);

    const updateDependentMutation = useCreateUpdateMutation({
        url: `dependents/${dependent.id}/`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithUserAuth,
        onSuccessMessage: 'Dependent Successfully Updated',
        onErrorMessage: 'Dependent Update Failed',
        onSuccess: () => {
            queryClient.invalidateQueries(['patientProfile']);
        }
    });

    const resetForm = () => {
        setDependent(selectedDependent);
        setInputErrors({});
    }

    useEffect(() => {
        resetForm();
    }, [selectedDependent]);

    const handleChange = (id, value) => {
        setDependent(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleBlur = (id, value) => {
        const errors = validateField(id, value, inputErrors);
        setInputErrors(errors);
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (event.type === 'set' && selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setDependent(prev => ({ ...prev, date_of_birth: formattedDate }));
            handleBlur("birthDate", formattedDate);
        }
    };

    const handleSubmit = () => {
        if (!hasNoFieldErrors(inputErrors)) {
            return;
        }
        const { name, date_of_birth, gender } = dependent;
        updateDependentMutation.mutate(JSON.stringify({ name, date_of_birth, gender }));
    };

    return (
        <View>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <Pencil color='grey' size={15} />
            </TouchableOpacity>

            <Modal animationType="slide" transparent={true} visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(false);
                    resetForm();
                }}
            >
                <View className='flex-1 relative items-center justify-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                    <View className="bg-white rounded-md p-5" style={{ width: screenWidth * 0.91 }} >

                        <View className='flex flex-row justify-between'>
                            <Text className="text-xl font-bold text-primary mb-1">Update Dependent</Text>
                            <Pressable onPress={() => {
                                setIsModalVisible(false);
                                resetForm();
                            }}>
                                <X size={24} color="grey" />
                            </Pressable>
                        </View>

                        <Text className="text-md text-gray-500 mb-3">Update Details for your dependent. Click Update when done.</Text>

                        <View className="gap-4 mt-4">
                            <View className="gap-2">
                                <Text className="text-gray-700">Name</Text>
                                <TextInput
                                    className={`w-full py-2 px-4 rounded-md border ${inputErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter dependent's name"
                                    value={dependent.name}
                                    onChangeText={(value) => handleChange("name", value)}
                                    onBlur={() => handleBlur("name", dependent.name)}
                                />
                                {inputErrors.name && (
                                    <View className="flex flex-row items-center text-red-500 text-sm gap-2">
                                        <TriangleAlert size={13} color="red" />
                                        <Text className='text-sm text-red-500'>{inputErrors.name} </Text>
                                    </View>
                                )}
                            </View>

                            <View className="gap-2">
                                <Text className="text-gray-700">Date of Birth</Text>
                                <Pressable onPress={() => setShowDatePicker(true)}>
                                    <View className={`w-full py-3 px-4 rounded-md border ${inputErrors.birthDate ? 'border-red-500' : 'border-gray-300'}`}>
                                        <Text className={dependent.date_of_birth ? "text-black" : "text-gray-400"}>{dependent.date_of_birth || `Select dependent's Date of Birth`} </Text>
                                    </View>
                                </Pressable>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={dependent.date_of_birth ? new Date(dependent.date_of_birth) : new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={onDateChange}
                                    />
                                )}
                                {inputErrors.dependentbirthDate && (
                                    <View className="flex flex-row items-center text-red-500 text-sm gap-2">
                                        <TriangleAlert size={13} color="red" />
                                        <Text className='text-sm text-red-500'>{inputErrors.dependentbirthDate} </Text>
                                    </View>
                                )}
                            </View>

                            <View className="gap-3">
                                <Text className="text-gray-700">Gender</Text>
                                <View className="flex flex-row -mt-3">
                                    <Pressable onPress={() => handleChange('gender', 'M')}>
                                        <View className="flex-row items-center p-2 mr-3">
                                            {dependent.gender === "M" ? (
                                                <CheckCircle size={18} color="hsl(203, 87%, 30%)" />
                                            ) : (
                                                <Circle size={18} color="hsl(203, 87%, 30%)" />
                                            )}
                                            <Text className="ml-2 text-gray-700">Male</Text>
                                        </View>
                                    </Pressable>
                                    <Pressable onPress={() => handleChange('gender', 'F')}>
                                        <View className="flex-row items-center p-2 mr-3">
                                            {dependent.gender === "F" ? (
                                                <CheckCircle size={18} color="hsl(203, 87%, 30%)" />
                                            ) : (
                                                <Circle size={18} color="hsl(203, 87%, 30%)" />
                                            )}
                                            <Text className="ml-2 text-gray-700">Female</Text>
                                        </View>
                                    </Pressable>
                                </View>
                            </View>
                        </View>

                        <View className="flex-row justify-end mt-4">
                            <TouchableOpacity
                                onPress={() => {
                                    setIsModalVisible(false);
                                    resetForm();
                                }}
                                className="mr-4 bg-gray-200 px-4 py-2 rounded-md"
                            >
                                <Text className="text-gray-700">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSubmit} className="bg-primary px-4 py-2 rounded-md">
                                <Text className="text-white font-bold">Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
