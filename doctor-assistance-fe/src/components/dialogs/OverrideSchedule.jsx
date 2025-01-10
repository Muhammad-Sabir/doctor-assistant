import React, { useState } from 'react';
import { BiSolidError } from 'react-icons/bi';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchWithAuth } from '@/utils/fetchApis';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { validateField, hasNoFieldErrors, validateAllFields } from '@/utils/validations';

export default function OverrideSchedule() {

    const [formData, setFormData] = useState({
        hospitalId: '',
        overrideDate: '',
        overrideReason: '',
        start_time: '',
        end_time: '',
        duration: '',
    });
    const [inputErrors, setInputErrors] = useState({});

    const { data: doctorData, isFetching, isError } = useFetchQuery({
        url: `doctors/me`,
        queryKey: ['doctorInfo'],
        fetchFunction: fetchWithAuth,
    });

    const hospitals = doctorData?.hospitals || [];

    const createScheduleOverrideMutation = useCreateUpdateMutation({
        url: `schedule-overrides/`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithAuth,
        onSuccessMessage: 'Schedule override created successfully!',
        onErrorMessage: 'Failed to create schedule override',
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

        const errors = validateAllFields(formData, inputErrors);
        setInputErrors(errors);

        if (hasNoFieldErrors(errors)) {
            const { hospitalId, overrideDate, overrideReason, start_time, end_time, duration } = formData;

            console.log(formData)
            createScheduleOverrideMutation.mutate(JSON.stringify({
                hospital: hospitalId, date: overrideDate, is_available: true, reason: overrideReason,
                slot_duration: parseInt(duration, 10), start_time, end_time,
            }));
        }
    };

    const handleDialogClose = () => {
        setFormData({
            hospitalId: '', overrideDate: '', overrideReason: '',
            start_time: '', end_time: '', duration: '',
        });
        setInputErrors({});
    };

    return (
        <Dialog onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <Button>Create Custom Schedule</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Custom Schedule</DialogTitle>
                    <DialogDescription>
                        Set the following details to create custom schedule for some date.
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
                        </div>
                        {inputErrors.hospitalId && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm mt-2">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.hospitalId}
                            </div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="overrideDate" className='text-gray-700 text-sm font-normal'>Date</Label>
                        <Input type="date" id="overrideDate" value={formData.overrideDate} required
                            onBlur={handleBlur} onChange={handleChange} className={`${inputErrors.overrideDate ? 'border-red-500' : ''}`}
                        />
                        {inputErrors.overrideDate && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.overrideDate}
                            </div>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="overrideReason" className='text-gray-700 text-sm font-normal'>Reason</Label>
                        <textarea id="overrideReason" rows="2" value={formData.overrideReason} onChange={handleChange}
                            placeholder="Write your reason..." className={`${inputErrors.overrideReason ? 'border-red-500' : ''}`}
                            onBlur={handleBlur} required
                        />
                        {inputErrors.overrideReason && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.overrideReason}
                            </div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label className='text-gray-700 text-sm font-normal'>Timings</Label>
                        <div className="flex items-center gap-3 mb-2 ml-2">
                            <div className="flex flex-col">
                                <Label htmlFor="start_time" className='text-gray-700 text-sm font-normal mb-2'>Start Time</Label>
                                <Input type="time" id="start_time" value={formData.start_time} required onChange={handleChange}
                                />
                            </div>
                            <div className='flex text-gray-600 mt-5'>-</div>
                            <div className="flex flex-col">
                                <Label htmlFor="end_time" className='text-gray-700 text-sm font-normal mb-2'>End Time</Label>
                                <Input type="time" id="end_time" value={formData.end_time} required onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col">
                                <Label htmlFor="duration" className='text-gray-700 text-sm font-normal mb-2'>Duration (minutes)</Label>
                                <Input type="number" id="duration" value={formData.duration} required
                                    onChange={handleChange} className='w-32' placeholder="(minutes)"
                                />
                            </div>
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