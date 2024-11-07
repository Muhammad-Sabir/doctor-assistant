import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Pressable, Dimensions } from 'react-native';
import { CheckCircle, Circle, TriangleAlert, X, Plus } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useQueryClient } from '@tanstack/react-query';
import { Picker } from '@react-native-picker/picker';

import { relationshipOptions } from '@/assets/data/relationshipOptions';

import { useAuth } from '@/contexts/AuthContext';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';

export default function AddDependent() {

    const { fetchWithUserAuth } = useAuth();
    const queryClient = useQueryClient();
    const screenWidth = Dimensions.get('window').width;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [inputErrors, setInputErrors] = useState({});
    const [userDetails, setUserDetails] = useState({ name: "", dob: "", gender: "M", relationship: "" });

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
            handleBlur("dependentbirthDate", formattedDate);
        }
    };

    const handleSubmit = () => {
        if (!hasNoFieldErrors(inputErrors)) {
            return;
        }
        const { name, dob, gender, relationship } = userDetails;
        addDependentMutation.mutate(JSON.stringify({ name, date_of_birth: dob, gender, relationship }));
        setIsModalVisible(false);
        resetForm();
    };

    const resetForm = () => {
        setUserDetails({ name: "", dob: "", gender: "M", relationship: "" });
        setInputErrors({});
    };

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
                <View className='flex-1 relative items-center justify-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }} >
                    <View className="bg-white rounded-md p-5" style={{ width: screenWidth * 0.91, }} >

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
                            <View className="gap-2">
                                <Text className="text-gray-700">Name</Text>
                                <TextInput
                                    className={`w-full py-2 px-4 rounded-md border ${inputErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter dependent's name"
                                    value={userDetails.name}
                                    onChangeText={(value) => handleChange("name", value)}
                                    onBlur={() => handleBlur("name", userDetails.name)}
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
                                    <View className={`w-full py-3 px-4 rounded-md border ${inputErrors.dependentbirthDate ? 'border-red-500' : 'border-gray-300'}`}>
                                        <Text className={userDetails.dob ? "text-black" : "text-gray-400"}>{userDetails.dob || `Select dependent's Date of Birth`} </Text>
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
                                            {userDetails.gender === "M" ? (
                                                <CheckCircle size={18} color="hsl(203, 87%, 30%)" />
                                            ) : (
                                                <Circle size={18} color="hsl(203, 87%, 30%)" />
                                            )}
                                            <Text className="ml-2 text-gray-700">Male</Text>
                                        </View>
                                    </Pressable>
                                    <Pressable onPress={() => handleChange('gender', 'F')}>
                                        <View className="flex-row items-center p-2 mr-3">
                                            {userDetails.gender === "F" ? (
                                                <CheckCircle size={18} color="hsl(203, 87%, 30%)" />
                                            ) : (
                                                <Circle size={18} color="hsl(203, 87%, 30%)" />
                                            )}
                                            <Text className="ml-2 text-gray-700">Female</Text>
                                        </View>
                                    </Pressable>
                                </View>
                            </View>

                            <View className="gap-2 mb-4">
                                <Text className="text-gray-700">Relationship</Text>
                                <View className='border border-gray-200 rounded-md'>
                                    <Picker
                                        selectedValue={userDetails.relationship}
                                        style={{ height: 45, width: '100%', borderWidth: 1, borderColor: inputErrors.relationship ? 'red' : '#ccc' }}
                                        onValueChange={(itemValue) => handleChange('relationship', itemValue)}
                                    >
                                        <Picker.Item style={{fontSize: 14, color: 'grey'}} label="Select dependent relation (dependent is the)" value="" />
                                        {relationshipOptions.map((option) => (
                                            <Picker.Item style={{fontSize: 14, color: 'grey'}} key={option.value} label={option.label} value={option.value} />
                                        ))}
                                    </Picker>
                                </View>
                                {inputErrors.relationship && (
                                    <View className="flex flex-row items-center text-red-500 text-sm gap-2">
                                        <TriangleAlert size={13} color="red" />
                                        <Text className='text-sm text-red-500'>{inputErrors.relationship} </Text>
                                    </View>
                                )}
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
                                <Text className="text-white font-bold">Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
