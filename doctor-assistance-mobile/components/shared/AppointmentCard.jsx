import React from 'react';
import { View, Text } from 'react-native';
import { formatDate } from '@/utils/date';
import { BadgeCheck, CalendarDays } from 'lucide-react-native';

import UpdateAppointment from '@/components/modals/UpdateAppointment';
import DeleteItem from '@/components/modals/DeleteItem';

const AppointmentCard = ({ appointment }) => {

    return (
        <View className="mb-5 gap-1 flex-col p-4 bg-white border border-gray-300 rounded-md hover:shadow-md hover:border-primary transition-shadow">
            <View className="flex-row items-center gap-2">
                <CalendarDays color='grey' size={15}/>
                <Text className="text-gray-500">{formatDate(appointment.date_of_appointment)}</Text>
            </View>

            <Text className="text-primary font-medium mt-2">{appointment.message}</Text>
            <Text className="text-sm mb-1">Doctor: {appointment.doctor_name}</Text>

            {appointment.status === 'rejected' && appointment.cancellation_reason && (
                <Text className="text-red-500 text-sm mb-1">Reason of Rejection: {appointment.cancellation_reason}</Text>
            )}

            <View className="mt-2 flex flex-row justify-between items-center">

                <View className="flex flex-row gap-2 items-center py-1 px-2 bg-accent rounded-md">
                    <BadgeCheck color={'blue'} size={15}/>
                    <Text className='text-xs font-medium text-primary'>{appointment.appointment_mode}</Text>
                </View>

                {appointment.status === 'pending' && (
                    <View className="flex flex-row items-center gap-2">
                        <UpdateAppointment appointment={appointment} />
                        <DeleteItem deleteUrl={`appointments/${appointment.id}/`} itemName={'Appointment'} iconSize={15} queryKey={'patientAppointments'} />
                    </View>
                )}
            </View>
        </View>
    );
}

export default AppointmentCard;