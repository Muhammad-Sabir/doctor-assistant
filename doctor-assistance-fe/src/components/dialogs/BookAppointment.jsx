import React, { useState } from 'react';
import { BiSolidError } from 'react-icons/bi';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchWithAuth } from '@/utils/fetchApis';
import { validateField, hasNoFieldErrors, validateAllFields } from '@/utils/validations';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { toHHMMFormat } from '@/utils/time';

export default function BookAppointment({ doctorId, doctorName, hospitals }) {

    const [inputErrors, setInputErrors] = useState({});
    const [formData, setFormData] = useState({
        patientId: '', message: '', date_of_appointment: '',
        appointment_mode: '', appointmentHospital: '', appointmentTimeSlot: '',
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

    const { data: dependentsData, isFetching: isDependentFetching, isError: isDependentError } = useFetchQuery({
        url: `patients/`,
        queryKey: ['allRelatedPatientList'],
        fetchFunction: fetchWithAuth,
    });

    const dependents = dependentsData?.results[0].dependents || [];
    const patient = dependentsData?.results[0];

    const { data: timeSlots, isFetching: isTimeSlotFetching, isError: isTimeSlotError } = useFetchQuery({
        url: `appointments/available_slots/?doctor_id=${doctorId}&date=${formData.date_of_appointment}&hospital_id=${formData.appointmentHospital}`,
        queryKey: ['availableTimeSlots', formData.date_of_appointment, formData.appointmentHospital],
        enabled: () => Boolean(doctorId && formData.date_of_appointment && formData.appointmentHospital),
        fetchFunction: fetchWithAuth,
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

    const handleSelectChange = (id, value) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
        const errors = validateField(id, value, inputErrors);
        setInputErrors(errors);
    };

    const setAppointmentMode = (mode) => {
        setFormData((prevData) => ({ ...prevData, appointment_mode: mode, }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateAllFields(formData, inputErrors);
        setInputErrors(errors);

        if (hasNoFieldErrors(errors)) {
            const { patientId, date_of_appointment, message, appointment_mode, appointmentHospital, appointmentTimeSlot } = formData;
            bookAppointmentMutation.mutate(JSON.stringify({
                doctor: doctorId, patient: patientId, hospital: appointmentHospital, time_slot: appointmentTimeSlot,
                date_of_appointment, message, appointment_mode
            }));
        }
    };

    const handleDialogClose = () => {
        setFormData((prev) => ({
            ...prev, patientId: '', message: '',
            date_of_appointment: '', appointmentHospital: '', appointmentTimeSlot: ''
        }));
        setInputErrors({});
    };

    return (
        <Dialog onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <Button variant='secondary' onClick={() => setAppointmentMode('online')}>Consult Online</Button>
            </DialogTrigger>

            <DialogTrigger asChild>
                <Button className='ml-3' onClick={() => setAppointmentMode('physical')}>Visit Clinic</Button>
            </DialogTrigger>

            <DialogContent className='max-h-[97vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>Book Appointment</DialogTitle>
                    <DialogDescription>
                        Schedule {formData.appointment_mode} appointment with {doctorName}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">

                    <div className="grid gap-2">
                        <Label htmlFor="patientId" className='text-gray-700 text-sm font-normal'>Patient</Label>
                        <div className="text-gray-500">
                            <Select id="patientId" value={formData.patientId} required
                                onValueChange={(value) => handleSelectChange('patientId', value)}
                            >
                                <SelectTrigger className={`${inputErrors.patientId ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="Select a patient for the appointment" />
                                </SelectTrigger>
                                <SelectContent>
                                    {isDependentFetching ? (
                                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                                    ) : isDependentError ? (
                                        <SelectItem value="error" disabled>Error fetching dependents...</SelectItem>
                                    ) : (
                                        <>
                                            {patient && (
                                                <SelectItem key={patient.id} value={patient.id}>{patient.name} (You)</SelectItem>
                                            )}
                                            {dependents.map(dependent => (
                                                <SelectItem key={dependent.id} value={dependent.id}>{dependent.name}</SelectItem>
                                            ))}
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                            {inputErrors.patientId && (
                                <div aria-live="assertive" className="flex text-red-500 text-sm mt-2">
                                    <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.patientId}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="appointmentHospital" className='text-gray-700 text-sm font-normal'>Hospital</Label>
                        <div className="text-gray-500">
                            <Select id="appointmentHospital" value={formData.appointmentHospital} required
                                onValueChange={(value) => handleSelectChange('appointmentHospital', value)}
                            >
                                <SelectTrigger className={`${inputErrors.appointmentHospital ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="Select a hospital" />
                                </SelectTrigger>
                                <SelectContent>
                                    {hospitals?.map(hospital => (
                                        <SelectItem key={hospital.id} value={hospital.id}>{hospital.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {inputErrors.appointmentHospital && (
                                <div aria-live="assertive" className="flex text-red-500 text-sm mt-2">
                                    <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.appointmentHospital}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="date_of_appointment" className='text-gray-700 text-sm font-normal'>Date of Appointment</Label>
                        <Input type="date" id="date_of_appointment" value={formData.date_of_appointment}
                            className={`${inputErrors.date_of_appointment ? 'border-red-500' : ''}`}
                            onBlur={handleBlur} onChange={handleChange} required
                        />
                        {inputErrors.date_of_appointment && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.date_of_appointment}
                            </div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="appointmentTimeSlot" className='text-gray-700 text-sm font-normal'>Time Slot</Label>
                        <div className="text-gray-500">
                            <Select id="appointmentTimeSlot" value={formData.appointmentTimeSlot} required
                                onValueChange={(value) => handleSelectChange('appointmentTimeSlot', value)}
                            >
                                <SelectTrigger className={`${inputErrors.appointmentTimeSlot ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="Select doctor's available time slot" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(!formData.date_of_appointment || !formData.appointmentHospital) && (
                                        <SelectItem value="none" disabled className="text-black">First Select Date of Appointment and Hospital to Select Time Slot</SelectItem>
                                    )}
                                    {isTimeSlotFetching ? (
                                        <SelectItem value="loading" disabled>Loading available slots...</SelectItem>
                                    ) : isTimeSlotError ? (
                                        <SelectItem value="error" disabled>Error fetching available slots...</SelectItem>
                                    ) : timeSlots?.length === 0 ? (
                                        <SelectItem value="none" disabled>No available slots found</SelectItem>
                                    ) : (
                                        timeSlots?.[0]?.available_slots?.map((slot) => (
                                            <SelectItem key={slot.id} value={slot.id}>{toHHMMFormat(slot.start_time)} - {toHHMMFormat(slot.end_time)}</SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            {inputErrors.appointmentTimeSlot && (
                                <div aria-live="assertive" className="flex text-red-500 text-sm mt-2">
                                    <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.appointmentTimeSlot}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="message" className='text-gray-700 text-sm font-normal'>Message</Label>
                        <textarea id="message" rows="2" value={formData.message} onChange={handleChange}
                            placeholder="Write your message..." className={`${inputErrors.message ? 'border-red-500' : ''}`}
                            onBlur={handleBlur} required
                        />
                        {inputErrors.message && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.message}
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