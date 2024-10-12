import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

export default function AppointmentCard({ appointment }) {
    const appointmentDate = new Date(appointment.date_of_appointment);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
        weekday: 'short',  day: '2-digit', 
        month: 'short',  year: 'numeric', 
    }); 

    return (
        <div className="flex flex-col p-4 bg-white border border-gray-300 rounded-lg hover:shadow-md hover:border-primary transition-shadow">
            
            <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-500" />
                <p className="text-sm text-gray-500">{formattedDate}</p>
            </div>
            <h4 className="text-sm font-medium text-primary mb-1 mt-2">{appointment.message}</h4>
            <p className="text-sm mb-1">Doctor: {appointment.doctor_name}</p> {/* Doctor Name */}
            {appointment.cancellation_reason && (
                <div className="flex text-sm mb-1 items-center text-red-500">
                    <p>Reason of Rejection: {appointment.cancellation_reason}</p>
                </div>
            )}
            <span className="flex items-center py-1 mt-2 px-2 bg-accent rounded-md text-xs font-medium max-w-fit text-primary text-center">
                <IoMdCheckmarkCircleOutline className='mr-1'/>{appointment.appointment_mode}
            </span>
        </div>
    );
}
