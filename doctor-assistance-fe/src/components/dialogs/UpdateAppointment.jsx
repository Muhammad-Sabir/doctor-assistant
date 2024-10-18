import React, { useState, useEffect } from 'react';
import { AiTwotoneEdit } from "react-icons/ai";
import { BiSolidError } from 'react-icons/bi';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchWithAuth } from '@/utils/fetchApis';
import { validateField, hasNoFieldErrors } from '@/utils/validations';

export default function UpdateAppointment({ appointment }) {

    const [inputErrors, setInputErrors] = useState({});
    const [formData, setFormData] = useState({
        message: '',
        date_of_appointment: '',
    });

    const updateAppointmentMutation = useCreateUpdateMutation({
        url: `appointments/${appointment.id}/`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithAuth,
        onSuccessMessage: 'Appointment Successfully Updated',
        onErrorMessage: 'Failed to Update Appointment',
        onSuccess: () => {
            setTimeout(() => {
                window.location.reload();
            }, 300);
        },
    });

    useEffect(() => {
        setFormData({ message: appointment.message, date_of_appointment: appointment.date_of_appointment });
    }, [appointment]);

    const handleBlur = (e) => {
        const { id, value } = e.target;
        const errors = validateField(id, value, inputErrors);
        setInputErrors(errors);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hasNoFieldErrors(inputErrors)) {
            return;
        }
        const { date_of_appointment, message } = formData;
        updateAppointmentMutation.mutate(JSON.stringify({date_of_appointment, message}));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
            <span> 
                <AiTwotoneEdit size={16} className='mt-0.5 ml-1 text-gray-500'/>
            </span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Appointment</DialogTitle>
                    <DialogDescription>
                       Update appointment with {appointment.doctor_name}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="message" className='text-gray-700 text-sm font-normal'>Message</Label>
                        <textarea
                            id="message"
                            rows="4"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Write your message..."
                            className={`${inputErrors.message ? 'border-red-500' : ''}`}
                            onBlur={handleBlur}
                            required
                        />
                        {inputErrors.message && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.message}
                            </div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="date_of_appointment" className='text-gray-700 text-sm font-normal'>Date of Appointment</Label>
                        <Input
                            type="date"
                            id="date_of_appointment"
                            value={formData.date_of_appointment}
                            onChange={handleChange}
                            className={`${inputErrors.date_of_appointment ? 'border-red-500' : ''}`}
                            onBlur={handleBlur}
                            required
                        />
                        {inputErrors.date_of_appointment && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.date_of_appointment}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
