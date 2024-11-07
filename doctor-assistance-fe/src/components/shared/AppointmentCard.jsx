import React from 'react';
import { CircleCheckBig, Info } from 'lucide-react';

import { getAuthStatus } from '@/utils/auth';
import { formatDate } from '@/utils/date';

import RejectAppointment from '@/components/dialogs/RejectAppointment';
import ApproveAppointment from '@/components/dialogs/ApproveAppointment';
import DeleteItem from '@/components/dialogs/DeleteItem';
import UpdateAppointment from '@/components/dialogs/UpdateAppointment';
import CreateConsultation from '@/components/dialogs/CreateConsultation';
import AppointmentRejectReason from '@/components/dialogs/AppointmentRejectReason';
import { capitalizeWords } from '@/utils/strings';

export default function AppointmentCard({ appointment }) {

    const { user } = getAuthStatus();

    return (
        <div className="relative flex flex-col p-4 bg-white border border-gray-300 rounded-lg hover:shadow-md hover:border-primary transition-shadow">

            <div className='flex justify-between items-center'>
                <div className="flex items-center gap-2">
                    <CircleCheckBig size={15} className="text-green-600" />
                    <p className="text-sm text-green-600">{capitalizeWords(appointment.appointment_mode)} Appointment</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">{formatDate(appointment.date_of_appointment)}</p>
                </div>
            </div>

            <div>
                <p className="mt-2 text-sm font-medium text-primary">Appointment {capitalizeWords(appointment.status)} </p>
                {user.role === 'doctor' ? (
                    <p className="text-sm text-gray-600 mb-1"> with {appointment.patient_name}</p>
                ) : (
                    <p className="text-sm mb-1 text-gray-600"> with {appointment.doctor_name}</p>
                )}
            </div>

            <div className='flex gap-2 items-center'>
                <Info size={15} className='text-gray-500' />
                <h4 className="text-sm font-medium text-gray-500">{appointment.message}</h4>
            </div>

            <div className="absolute bottom-3 right-3 flex justify-between items-center mt-2">
                {appointment.cancellation_reason && (
                    <div className='flex items-center justify-end'>
                        <AppointmentRejectReason reason = {appointment.cancellation_reason} />
                    </div>
                )}

                {user.role === 'doctor' && appointment.status === 'pending' && (
                    <div className='flex items-center justify-end'>
                        <RejectAppointment appointment={appointment} />
                        <ApproveAppointment appointment={appointment} />
                    </div>
                )}

                {user.role === 'doctor' && appointment.status === 'approved' && (
                    <div className='flex items-center justify-end'>
                        <CreateConsultation patientId={appointment.patient} />
                    </div>
                )}

                {user.role === 'patient' && appointment.status === 'pending' && (
                    <div className='flex items-center justify-end'>
                        <DeleteItem deleteUrl={`appointments/${appointment.id}/`} itemName={'Appointment'} iconSize={16} />
                        <UpdateAppointment appointment={appointment} />
                    </div>
                )}
            </div>
        </div>
    );
}
