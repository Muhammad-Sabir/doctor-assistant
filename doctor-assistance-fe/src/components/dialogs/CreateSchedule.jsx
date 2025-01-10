import React, { useState } from 'react';
import { IoAddCircleOutline, IoCloseCircleOutline } from 'react-icons/io5';
import { BiSolidError } from 'react-icons/bi';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchWithAuth } from '@/utils/fetchApis';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { daysOfWeek } from '@/utils/day';
import { validateField, hasNoFieldErrors, validateAllFields } from '@/utils/validations';

export default function CreateSchedule() {

    const [formData, setFormData] = useState({
        hospitalId: '', dayOfWeek: '',
        timeSlots: [{ start_time: '', end_time: '', duration: '' }],
    });
    const [inputErrors, setInputErrors] = useState({});

    const { data: doctorData, isFetching, isError } = useFetchQuery({
        url: `doctors/me`,
        queryKey: ['doctorInfo'],
        fetchFunction: fetchWithAuth,
    });

    const hospitals = doctorData?.hospitals || [];

    const createScheduleMutation = useCreateUpdateMutation({
        url: `schedules/`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithAuth,
        onSuccessMessage: 'Schedule created successfully!',
        onErrorMessage: 'Failed to create Schedule',
        onSuccess: () => {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        },
    });

    const handleSelectChange = (value, field) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        const errors = validateField(field, value, inputErrors);
        setInputErrors(errors);
    };

    const handleTimeSlotChange = (index, field, value) => {
        const updatedTimeSlots = [...formData.timeSlots];
        updatedTimeSlots[index][field] = value;
        setFormData((prev) => ({ ...prev, timeSlots: updatedTimeSlots }));
    };

    const addTimeSlot = () => {
        setFormData((prev) => ({
            ...prev, timeSlots: [...prev.timeSlots, { start_time: '', end_time: '', duration: '' }],
        }));
    };

    const removeTimeSlot = (index) => {
        const updatedTimeSlots = formData.timeSlots.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, timeSlots: updatedTimeSlots }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateAllFields(formData, inputErrors);
        setInputErrors(errors);

        if (hasNoFieldErrors(errors)) {
            const { hospitalId, dayOfWeek, timeSlots } = formData;
            localStorage.setItem('openDay', daysOfWeek[dayOfWeek]);

            createScheduleMutation.mutate(JSON.stringify({
                hospital: hospitalId, day_of_week: dayOfWeek, is_available: true, time_slots: timeSlots,
            }));
        }
    };

    const handleDialogClose = () => {
        setFormData({
            hospitalId: '', dayOfWeek: '',
            timeSlots: [{ start_time: '', end_time: '', duration: '' }],
        });
        setInputErrors({});
    };

    return (
        <Dialog onOpenChange={handleDialogClose} >
            <DialogTrigger asChild>
                <Button>Create Schedule</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Schedule</DialogTitle>
                    <DialogDescription>
                        Set the details for the schedule you want to create.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">

                    <div className="grid gap-2">
                        <Label htmlFor="hospitalId" className='text-gray-700 text-sm font-normal'>Hospital</Label>
                        <div className="text-gray-500">
                            <Select id="hospitalId" value={formData.hospitalId}
                                onValueChange={(value) => handleSelectChange(value, 'hospitalId')} required
                            >
                                <SelectTrigger className={`${inputErrors.hospitalId ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="Select a hospital" />
                                </SelectTrigger>
                                <SelectContent>
                                    {isFetching ? (
                                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                                    ) : isError ? (
                                        <SelectItem value="error" disabled>Error fetching hospitals...</SelectItem>
                                    ) : (
                                        hospitals.map(hospital => (
                                            <SelectItem key={hospital.id} value={hospital.id}>{hospital.name}</SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            {inputErrors.hospitalId && (
                                <div aria-live="assertive" className="flex text-red-500 text-sm mt-2">
                                    <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.hospitalId}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="dayOfWeek" className='text-gray-700 text-sm font-normal'>Day of Week</Label>
                        <div className="text-gray-500">
                            <Select id="dayOfWeek" value={formData.dayOfWeek}
                                onValueChange={(value) => handleSelectChange(value, 'dayOfWeek')} required
                            >
                                <SelectTrigger className={`${inputErrors.dayOfWeek ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="Select a day" />
                                </SelectTrigger>
                                <SelectContent>
                                    {daysOfWeek.map((day, index) => (
                                        <SelectItem key={index} value={index}>{day}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {inputErrors.dayOfWeek && (
                                <div aria-live="assertive" className="flex text-red-500 text-sm mt-2">
                                    <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.dayOfWeek}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid">
                        <Label className='text-gray-700 text-sm font-normal'>Timings</Label>
                        <div className="overflow-y-auto max-h-64 p-2">
                            {formData.timeSlots.map((slot, index) => (
                                <div key={index} className="flex items-center gap-3 mb-2 ml-2">
                                    <div className="flex flex-col">
                                        <Label htmlFor={`start_time_${index}`} className='text-gray-600 font-normal text-sm mb-2'>From</Label>
                                        <Input type="time" id={`start_time_${index}`} value={slot.start_time} required
                                            onChange={(e) => handleTimeSlotChange(index, 'start_time', e.target.value)}
                                        />
                                    </div>
                                    <div className='flex text-gray-600 mt-5'>-</div>

                                    <div className="flex flex-col">
                                        <Label htmlFor={`end_time_${index}`} className='text-gray-600 font-normal text-sm mb-2'>To</Label>
                                        <Input type="time" id={`end_time_${index}`} value={slot.end_time} required
                                            onChange={(e) => handleTimeSlotChange(index, 'end_time', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <Label htmlFor={`duration_${index}`} className='text-gray-600 font-normal text-sm mb-2'>Duration</Label>
                                        <Input type="text" id={`duration_${index}`} value={slot.duration}
                                            onChange={(e) => handleTimeSlotChange(index, 'duration', e.target.value)}
                                            required className='w-32' placeholder="(minutes)"
                                        />
                                    </div>

                                    {formData.timeSlots.length === 1 ? (
                                        <span onClick={addTimeSlot}><IoAddCircleOutline color='green' className="font-bold h-5 w-5 mt-7" /></span>
                                    ) : (
                                        <>
                                            {index === formData.timeSlots.length - 1 && (
                                                <>
                                                    <span onClick={addTimeSlot}><IoAddCircleOutline color='green' className="font-bold h-5 w-5 mt-7" /></span>
                                                    <span onClick={() => removeTimeSlot(index)}><IoCloseCircleOutline color='red' className="font-bold -ml-1 h-5 w-5 mt-7" /></span>
                                                </>
                                            )}
                                            {index > 0 && index !== formData.timeSlots.length - 1 && (
                                                <span onClick={() => removeTimeSlot(index)}><IoCloseCircleOutline color='red' className="font-bold h-5 w-5 mt-7" /></span>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
