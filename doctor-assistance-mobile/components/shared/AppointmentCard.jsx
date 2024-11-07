import React from 'react';
import { View, Text } from 'react-native';
import { formatDate } from '@/utils/date';
import { CheckCircle, Info } from 'lucide-react-native';

import UpdateAppointment from '@/components/modals/UpdateAppointment';
import DeleteItem from '@/components/modals/DeleteItem';
import { capitalizeWords } from '@/utils/strings';
import AppointmentRejectReason from '@/components/modals/AppointmentRejectReason';

const AppointmentCard = ({ appointment }) => {

    return (
        <View className="mb-5 gap-1 flex-col p-4 bg-white border border-gray-300 rounded-md hover:shadow-md hover:border-primary transition-shadow">

            <View className='flex-row justify-between items-end'>
                <View className="flex-row items-center gap-2">
                    <CheckCircle color='green' size={15} />
                    <Text style={{color:'green'}}>{capitalizeWords(appointment.appointment_mode)} appointment</Text>
                </View>
                <View className="flex-row items-center gap-2">
                    <Text className="text-gray-500">{formatDate(appointment.date_of_appointment)}</Text>
                </View>
            </View>

            <Text className='text-primary mt-2 text-md font-medium'>Appointment {appointment.status}</Text>
            <Text className="text-gray-600 mb-1">with {appointment.doctor_name}</Text>

            {appointment.status === 'rejected' && appointment.cancellation_reason && (
                <Text className="text-red-500 text-sm mb-1">Reason of Rejection: {appointment.cancellation_reason}</Text>
            )}

            <View className="mt-2 flex flex-row justify-between items-center">

                <View className="flex flex-row gap-2 items-center">
                    <Info color={'gray'} size={17} />
                    <Text className="text-gray-600">{appointment.message}</Text>
                </View>

                {appointment.status === 'pending' && (
                    <View className="flex flex-row items-center gap-2">
                        <UpdateAppointment appointment={appointment} />
                        <DeleteItem deleteUrl={`appointments/${appointment.id}/`} itemName={'Appointment'} iconSize={15} queryKey={'patientAppointments'} />
                    </View>
                )}

                {appointment.status === 'rejected' && appointment.cancellation_reason && (
                    <View className="flex flex-row items-center gap-2">
                        <AppointmentRejectReason reason={appointment.cancellation_reason} />
                    </View>
                )}
            </View>
        </View>
    );
}

export default AppointmentCard;