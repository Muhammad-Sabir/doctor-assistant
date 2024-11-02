import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useAuth } from '@/contexts/AuthContext';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export default function AddDependent() {

    const { fetchWithUserAuth } = useAuth();
    const queryClient = useQueryClient();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [inputErrors, setInputErrors] = useState({});
    const [userDetails, setUserDetails] = useState({ name: "", dob: "", gender: "M" });

    const [showDatePicker, setShowDatePicker] = useState(false);

    const addDependentMutation = useCreateUpdateMutation({
        url: `dependents/`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithUserAuth,
        onSuccessMessage: 'Dependent Successfully Added',
        onErrorMessage: 'Failed to Add Dependent',
        onSuccess: () => {
            queryClient.invalidateQueries(['patientProfile']);
        }
    });

    const handleChange = (id, value) => {
        setUserDetails(prev => ({
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
            setUserDetails(prev => ({ ...prev, dob: formattedDate }));
            handleBlur("birthDate", formattedDate);
        }
    };

    const handleSubmit = () => {
        if (!hasNoFieldErrors(inputErrors)) {
            return;
        }
        const { name, dob, gender } = userDetails;
        addDependentMutation.mutate(JSON.stringify({ name, date_of_birth: dob, gender }));
        setIsModalVisible(false);
        resetForm();
    };

    const resetForm = () => {
        setUserDetails({ name: "", dob: "", gender: "M" });
    }

    return (
        <View>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <Plus size={24} color="hsl(203, 87%, 30%)" />
            </TouchableOpacity>

            <Modal animationType="slide" transparent={true} visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(false);
                    resetForm();
                }}
            >
                <View className='flex-1 relative items-center justify-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                    <View className="bg-white rounded-md p-5" style={{ width: 390 }} >

                        <View className='flex flex-row justify-between'>
                            <Text className="text-xl font-bold text-primary mb-1">Add Dependent</Text>
                            <Pressable onPress={() => {
                                setIsModalVisible(false);
                                resetForm();
                            }}>
                                <X size={24} color="grey" />
                            </Pressable>
                        </View>

                        <Text className="text-md text-gray-500 mb-4">Add Details for your dependent. Click Add when done.</Text>

                        <View className="gap-4 mt-4">
                            <View className="gap-3">
                                <Text className="text-black">Name</Text>
                                <TextInput
                                    className={`w-full py-2 px-4 rounded-md border ${inputErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter your name"
                                    value={userDetails.name}
                                    onChangeText={(value) => handleChange("name", value)}
                                    onBlur={() => handleBlur("name", userDetails.name)}
                                />
                                {inputErrors.name && (
                                    <View className="flex flex-row items-center text-red-500 text-sm -mt-2">
                                        <MaterialIcons name="error-outline" size={13} color="red" className='mr-2' />
                                        <Text className='text-sm text-red-500'>{inputErrors.name}</Text>
                                    </View>
                                )}
                            </View>

                            <View className="gap-3">
                                <Text className="text-black">Date of Birth</Text>
                                <Pressable onPress={() => setShowDatePicker(true)}>
                                    <View className={`w-full py-3 px-4 rounded-md border ${inputErrors.birthDate ? 'border-red-500' : 'border-gray-300'}`}>
                                        <Text className={userDetails.dob ? "text-black" : "text-gray-400"}>{userDetails.dob || 'Select your Date of Birth'} </Text>
                                    </View>
                                </Pressable>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={userDetails.dob ? new Date(userDetails.dob) : new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={onDateChange}
                                    />
                                )}
                                {inputErrors.birthDate && (
                                    <View className="flex flex-row items-center text-red-500 text-sm -mt-2">
                                        <MaterialIcons name="error-outline" size={13} color="red" className='mr-2' />
                                        <Text className='text-sm text-red-500'>{inputErrors.birthDate}</Text>
                                    </View>
                                )}
                            </View>

                            <View className="gap-3">
                                <Text className="text-black">Gender</Text>
                                <View className="flex flex-row -mt-3">
                                    <Pressable onPress={() => handleChange("gender", "M")}>
                                        <View className={`flex-row items-center p-2  mr-3`}>
                                            <MaterialIcons name={userDetails.gender === "M" ? "radio-button-checked" : "radio-button-unchecked"} size={20} color="hsl(203, 87%, 30%)" />
                                            <Text className="ml-2">Male</Text>
                                        </View>
                                    </Pressable>
                                    <Pressable onPress={() => handleChange("gender", "F")}>
                                        <View className={`flex-row items-center p-2 `}>
                                            <MaterialIcons name={userDetails.gender === "F" ? "radio-button-checked" : "radio-button-unchecked"} size={20} color="hsl(203, 87%, 30%)" />
                                            <Text className="ml-2">Female</Text>
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
                                <Text className="text-white font-bold">Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
