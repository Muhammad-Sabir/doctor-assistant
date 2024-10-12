import React, { useState } from 'react';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BiSolidError } from 'react-icons/bi';

import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchWithAuth } from '@/utils/fetchApis';
import { validateField, hasNoFieldErrors } from '@/utils/validations';

export default function BookAppointment({ doctorId, doctorName }) {

    const [inputErrors, setInputErrors] = useState({});
    const [formData, setFormData] = useState({
        patientId: '',
        message: '',
        date_of_appointment: '',
        appointment_mode: '',
    });

    const bookAppointmentMutation = useCreateUpdateMutation({
        url: `appointments/`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithAuth,
        onSuccessMessage: 'Your Appointment has been Successfully Booked. You will get notified once its approved by the doctor',
        onErrorMessage: 'Failed to Book Appointment',
        onSuccess: () => {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        },
    });

    const handleBlur = (e) => {
        const { id, value } = e.target;
        const errors = validateField(id, value, inputErrors);
        setInputErrors(errors);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const setAppointmentMode = (mode) => {
        setFormData((prevData) => ({
            ...prevData,
            appointment_mode: mode,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hasNoFieldErrors(inputErrors)) {
            return;
        }
        const { patientId, date_of_appointment, message, appointment_mode } = formData;
        bookAppointmentMutation.mutate(JSON.stringify({
            doctor: doctorId, patient: patientId,
            date_of_appointment, message, appointment_mode
        }));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='secondary' onClick={() => setAppointmentMode('online')}>Consult Online</Button>
            </DialogTrigger>

            <DialogTrigger asChild>
                <Button className='ml-3' onClick={() => setAppointmentMode('physical')}>Visit Clinic</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Book Appointment</DialogTitle>
                    <DialogDescription>
                        Schedule {formData.appointment_mode} appointment with {doctorName}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="patientId" className='text-gray-700 text-sm font-normal'>Patient ID</Label>
                        <Input
                            type="text"
                            id="patientId"
                            value={formData.patientId}
                            onChange={handleChange}
                            placeholder="Enter patient ID"
                            className={`${inputErrors.patientId ? 'border-red-500' : ''}`}
                            onBlur={handleBlur}
                            required
                        />
                        {inputErrors.patientId && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.patientId}
                            </div>
                        )}
                    </div>

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
