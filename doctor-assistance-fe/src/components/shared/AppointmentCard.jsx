import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineArrowForwardIos } from 'react-icons/md';

import { getAuthStatus } from '@/utils/auth';
import { Button } from '@/components/ui/button'

import RejectAppointment from '@/components/dialogs/RejectAppointment';
import ApproveAppointment from '@/components/dialogs/ApproveAppointment';
import DeleteItem from '@/components/dialogs/DeleteItem';
import UpdateAppointment from '@/components/dialogs/UpdateAppointment';

export default function AppointmentCard({ appointment }) {

    const { user } = getAuthStatus();

    const appointmentDate = new Date(appointment.date_of_appointment);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
        weekday: 'short', day: '2-digit',
        month: 'short', year: 'numeric',
    });

    return (
        <div className="flex flex-col p-4 bg-white border border-gray-300 rounded-lg hover:shadow-md hover:border-primary transition-shadow">

            <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-500" />
                <p className="text-sm text-gray-500">{formattedDate}</p>
            </div>

            <h4 className="text-sm font-medium text-primary mb-1 mt-2">{appointment.message}</h4>

            {user.role === 'doctor' ? (
                <p className="text-sm mb-1">Patient: {appointment.patient_name}</p>
            ) : (
                <p className="text-sm mb-1">Doctor: {appointment.doctor_name}</p>
            )}

            {user.role !== 'doctor' && appointment.cancellation_reason && (
                <div className="flex text-sm mb-1 items-center text-red-500">
                    <p>Reason of Rejection: {appointment.cancellation_reason}</p>
                </div>
            )}

            <div className="flex justify-between items-center mt-2">
                <span className="flex items-center py-1 px-2 bg-accent rounded-md text-xs font-medium max-w-fit text-primary text-center">
                    <IoMdCheckmarkCircleOutline className='mr-1' />{appointment.appointment_mode}
                </span>

                {user.role === 'doctor' && appointment.status === 'pending' && (
                    <div className='flex items-center justify-end'>
                        <RejectAppointment appointment={appointment} />
                        <ApproveAppointment appointment={appointment} />
                    </div>
                )}

                {user.role === 'patient' && appointment.status === 'pending' && (
                    <div className='flex items-center justify-end'>
                        <DeleteItem deleteUrl={`appointments/${appointment.id}/`} itemName={'Appointment'} iconSize={16} />
                        <UpdateAppointment appointment={appointment} />
                    </div>
                )}
            </div>

            {user.role === 'doctor' && appointment.status === 'approved' && (
                <Button className="mt-4 bg-primary text-white max-w-fit">
                    <Link className="flex" to={`/doctor/consultation/${appointment.id}`}>
                        Start Consultation <MdOutlineArrowForwardIos className="mt-1 ml-1" />
                    </Link>
                </Button>
            )}
        </div>
    );
}
