import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Pressable, Dimensions } from 'react-native';
import { X, TriangleAlert } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useAuth } from '@/contexts/AuthContext';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { Picker } from '@react-native-picker/picker';
import { useFetchQuery } from '@/hooks/useFetchQuery';

export default function BookAppointment({ doctorId, doctorName }) {

    const { fetchWithUserAuth } = useAuth();
    const screenWidth = Dimensions.get('window').width;

    const [inputErrors, setInputErrors] = useState({});
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        patientId: '',
        message: '',
        date_of_appointment: '',
        appointment_mode: '',
    });

    const { data: dependentsData, isFetching, isError } = useFetchQuery({
        url: 'patients/',
        queryKey: ['allRelatedPatientList'],
        fetchFunction: fetchWithUserAuth,
    });

    const dependents = dependentsData?.results[0].dependents || [];
    const patient = dependentsData?.results[0];

    const bookAppointmentMutation = useCreateUpdateMutation({
        url: `appointments/`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithUserAuth,
        onSuccessMessage: 'Your Appointment has been Successfully Booked. You will get notified once its approved by the doctor',
        onErrorMessage: 'Failed to Book Appointment'
    });

    const setAppointmentMode = (mode) => {
        setFormData((prevData) => ({
            ...prevData,
            appointment_mode: mode,
        }));
    };

    const resetForm = () => {
        setFormData({ appointment_mode: '', date_of_appointment: '', patientId: '', message: '' });
        setInputErrors({});
    };

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
        console.log(formData)
        if (!hasNoFieldErrors(inputErrors)) {
            return;
        }
        const { patientId, date_of_appointment, message, appointment_mode } = formData;
        bookAppointmentMutation.mutate(JSON.stringify({
            doctor: doctorId, patient: patientId,
            date_of_appointment, message, appointment_mode
        }));

        setIsModalVisible(false);
        resetForm();
    };

    return (
        <View>

            <View className="flex flex-row items-center justify-center gap-4">
                <TouchableOpacity className="mt-4 bg-primary text-primary justify-center items-center px-4 h-10 rounded-md p-2"
                    onPress={() => {
                        setIsModalVisible(true)
                        setAppointmentMode('physical')
                    }}>
                    <Text className="text-white font-bold">Visit Clinic</Text>
                </TouchableOpacity>
                <TouchableOpacity className="mt-4 justify-center items-center h-10 rounded-md p-2 px-4" style={{ backgroundColor: 'rgb(219 234 254)' }}
                    onPress={() => {
                        setIsModalVisible(true)
                        setAppointmentMode('online')
                    }}>
                    <Text className="text-primary font-bold">Consult Online</Text>
                </TouchableOpacity>
            </View>

            <Modal animationType="slide" transparent={true} visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(false);
                    resetForm();
                }}
            >
                <View className='flex-1 relative items-center justify-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                    <View className="bg-white rounded-md p-5" style={{ width: screenWidth * 0.91 }}>

                        <View className='flex flex-row justify-between'>
                            <Text className="text-xl font-bold text-primary mb-1">Book Appointment</Text>
                            <Pressable onPress={() => {
                                setIsModalVisible(false);
                                resetForm();
                            }}>
                                <X size={24} color="grey" />
                            </Pressable>
                        </View>

                        <Text className="text-md text-gray-500 mb-4 wrap" style={{ width: 310 }}>Schedule {formData.appointment_mode} appointment with {doctorName}</Text>

                        <View className="my-4 gap-2">
                            <Text className='text-gray-700'>Patient</Text>
                            <View className='border border-gray-200 rounded-md'>
                                <Picker selectedValue={formData.patientId} style={{ height: 45, width: '100%', borderWidth: 1, borderColor: inputErrors.relationship ? 'red' : '#ccc' }}
                                    onValueChange={(value) => handleChange('patientId', value)}>
                                    <Picker.Item style={{ fontSize: 14, color: 'grey' }} value='' label='Select a Patient for the apppointment' />

                                    {patient && (
                                        <Picker.Item style={{ fontSize: 14, color: 'grey' }} key={patient.id} label={`${patient.name} (You)`} value={patient.id} />
                                    )}
                                    {dependents && dependents.length > 0 && dependents.map(dependent => (
                                        <Picker.Item style={{ fontSize: 14, color: 'grey' }} key={dependent.id} label={dependent.name} value={dependent.id} />
                                    ))}

                                </Picker>
                            </View>
                            {inputErrors.patientId && (
                                <Text style={{ color: 'red', fontSize: 12 }}>
                                    <TriangleAlert size={16} color="red" /> {inputErrors.patientId}
                                </Text>
                            )}
                        </View>

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
