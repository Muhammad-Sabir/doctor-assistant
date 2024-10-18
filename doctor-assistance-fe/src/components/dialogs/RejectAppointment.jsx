import React, { useState } from 'react';
import { BiSolidError } from 'react-icons/bi';
import { FaTimes } from "react-icons/fa";

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchWithAuth } from '@/utils/fetchApis';
import { validateField, hasNoFieldErrors } from '@/utils/validations';

export default function RejectAppointment({ appointment }) {

    const [inputErrors, setInputErrors] = useState({});
    const [inputValues, setInputValues] = useState({ cancellation_reason:'' });

    const rejectAppointmentMutation = useCreateUpdateMutation({
        url: `appointments/${appointment.id}/`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithAuth,
        onSuccessMessage: 'Appointment successfully Rejected',
        onErrorMessage: 'Failed to Reject Appointment',
        onSuccess: () => {
            setTimeout(() => {
                window.location.reload();
            }, 300);
        }
    });

    const handleBlur = (e) => {
        const { id, value } = e.target;
        const errors = validateField(id, value, inputErrors);
        setInputErrors(errors);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValues((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!hasNoFieldErrors(inputErrors)) {
            return;
        }

        const { cancellation_reason } = inputValues;
        rejectAppointmentMutation.mutate(JSON.stringify({ status: 'rejected', cancellation_reason }))
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <span>
                    <FaTimes size={16} className='mt-0.5 ml-1 text-red-500' />
                </span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Reject Appointment</DialogTitle>
                    <DialogDescription>
                        Are u sure you want to reject appointment with {appointment.patient_name}
                        <br />Add Cancellation Reason if u want to.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="cancellation_reason" className='text-gray-700 font-normal'>Cancellation Reason</Label>
                        <textarea
                            id="cancellation_reason"
                            name='cancellation_reason'
                            type="text"
                            placeholder="Enter Cancellation Reason..."
                            onChange={handleChange}
                            value={inputValues.cancellation_reason}
                            rows="4"
                            onBlur={handleBlur}
                            className={`${inputErrors.cancellation_reason ? 'border-red-500' : ''}`}
                        />
                        {inputErrors.cancellation_reason && (
                            <div className="flex items-center text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1" /> {inputErrors.cancellation_reason}
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Reject</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
