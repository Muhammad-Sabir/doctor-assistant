import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Pressable } from 'react-native';
import { X, TriangleAlert, Pencil } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/AuthContext';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';

const UpdateAppointment = ({ appointment }) => {

    const { fetchWithUserAuth } = useAuth();
    const queryClient = useQueryClient();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [inputErrors, setInputErrors] = useState({});
    const [formData, setFormData] = useState({ message: '', date_of_appointment: '' });

    const updateAppointmentMutation = useCreateUpdateMutation({
        url: `appointments/${appointment.id}/`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithUserAuth,
        onSuccessMessage: 'Appointment Successfully Updated',
        onErrorMessage: 'Failed to Update Appointment',
        onSuccess: () => {
            queryClient.invalidateQueries(['patientAppointments', appointment]);
        },
    });

    const setAppointment = () => {
        setFormData({ message: appointment.message, date_of_appointment: appointment.date_of_appointment });
    }

    useEffect(() => {
        setAppointment();
    }, [appointment]);

    const handleBlur = (id, value) => {
        const errors = validateField(id, value, inputErrors);
        setInputErrors(errors);
    };

    const handleChange = (id, value) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (event.type === 'set' && selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setFormData(prev => ({ ...prev, date_of_appointment: formattedDate }));
            handleBlur("date_of_appointment", formattedDate);
        }
    };

    const handleSubmit = () => {
        if (!hasNoFieldErrors(inputErrors)) {
            return;
        }

        const { date_of_appointment, message } = formData;
        updateAppointmentMutation.mutate(JSON.stringify({ date_of_appointment, message }));
        setIsModalVisible(false);
    };

    return (
        <View>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <Pencil color='grey' size={15} />
            </TouchableOpacity>

            <Modal animationType="slide" transparent={true} visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(false);
                }}
            >
                <View className='flex-1 relative items-center justify-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                    <View className="bg-white rounded-md p-5 shadow-lg" style={{ width: 390 }} >

                        <View className='flex flex-row justify-between'>
                            <Text className="text-xl font-bold text-primary mb-1">Update Appointment</Text>
                            <Pressable onPress={() => {
                                setIsModalVisible(false);
                                setAppointment();
                                setInputErrors({});
                            }}>
                                <X size={24} color="grey" />
                            </Pressable>
                        </View>

                        <Text className="text-md text-gray-500 mb-4"> Update appointment with {appointment.doctor_name}</Text>

                        <View className='mb-3'>
                            <Text className="text-gray-700 text-base mb-2">Message</Text>
                            <TextInput
                                value={formData.message}
                                onChangeText={(value) => handleChange("message", value)}
                                onBlur={() => handleBlur("message", formData.message)}
                                placeholder="Write your message..."
                                className={`border p-3 rounded-md mb-2 ${inputErrors.message ? 'border-red-500' : 'border-gray-300'}`}
                                multiline numberOfLines={4} textAlignVertical="top"
                            />
                            {inputErrors.message && (
                                <View className="flex flex-row items-center text-red-500 text-sm gap-2">
                                    <TriangleAlert size={13} color="red" />
                                    <Text className='text-sm text-red-500'>{inputErrors.message} </Text>
                                </View>
                            )}
                        </View>

                        <View className='mb-3'>
                            <Text className="text-gray-700 mb-2">Date of Appointment</Text>
                            <Pressable onPress={() => setShowDatePicker(true)}>
                                <View className={`w-full p-3 rounded-md border ${inputErrors.date_of_appointment ? 'border-red-500' : 'border-gray-300'}`}>
                                    <Text className={formData.date_of_appointment ? "text-black" : "text-gray-400"}>{formData.date_of_appointment || 'Select Date of Appointment'} </Text>
                                </View>
                            </Pressable>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={formData.date_of_appointment ? new Date(formData.date_of_appointment) : new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={onDateChange}
                                />
                            )}
                            {inputErrors.date_of_appointment && (
                                <View className="flex flex-row items-center text-red-500 text-sm gap-2 mt-2">
                                    <TriangleAlert size={13} color="red" />
                                    <Text className='text-sm text-red-500'>{inputErrors.date_of_appointment}</Text>
                                </View>
                            )}
                        </View>

                        <View className="flex-row justify-end mt-4">
                            <TouchableOpacity
                                onPress={() => {
                                    setIsModalVisible(false);
                                    setReview();
                                    setInputErrors({});
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

export default UpdateAppointment;