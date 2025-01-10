import React, { useState } from 'react';
import { MdCopyAll } from 'react-icons/md';
import { BiSolidError } from 'react-icons/bi';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchWithAuth } from '@/utils/fetchApis';
import { daysOfWeek } from '@/utils/day';
import { validateField, hasNoFieldErrors } from '@/utils/validations';

export default function CopySchedule({ sourceDay, sourceDayName, hospitalName, hospitalId }) {

    const [formData, setFormData] = useState({
        targetDays: [],
    });

    const [inputErrors, setInputErrors] = useState({});

    const copyScheduleMutation = useCreateUpdateMutation({
        url: `schedules/copy_schedule/`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithAuth,
        onSuccessMessage: 'Schedule copied successfully!',
        onErrorMessage: 'Failed to copy Schedule',
        onSuccess: () => {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        },
    });

    const handleCheckboxChange = (dayIndex) => {
        setFormData((prev) => {
            const updatedTargetDays = prev.targetDays.includes(dayIndex)
                ? prev.targetDays.filter((day) => day !== dayIndex)
                : [...prev.targetDays, dayIndex];
    
            const errors = validateField("targetDays", updatedTargetDays, inputErrors);
            setInputErrors(errors);
    
            return { ...prev, targetDays: updatedTargetDays };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateField("targetDays", formData.targetDays, inputErrors);
        setInputErrors(errors);

        if (hasNoFieldErrors(errors)) {
            copyScheduleMutation.mutate(JSON.stringify({
                source_day: sourceDay, target_days: formData.targetDays, hospital_id: hospitalId,
            }));
        }
    };

    const handleDialogClose = () => {
        setFormData((prev) => ({ ...prev, targetDays: [] }));
        setInputErrors({});
    };

    return (
        <Dialog onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <span>
                    <MdCopyAll size={17} className="mt-0.5 ml-1.5 text-green-600" />
                </span>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Copy Schedule</DialogTitle>
                    <DialogDescription>
                        Select the days you want to copy the schedule from {sourceDayName} at {hospitalName}. The selected days will receive the same schedule as of {sourceDayName}.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label className='text-gray-700 text-sm font-normal'>Copy Schedule To</Label>
                        <div className="grid grid-cols-2 gap-2 text-gray-500">
                            {daysOfWeek.map((day, index) => {
                                if (index === sourceDay) return null;
                                return (
                                    <label key={index} className="flex items-center space-x-2">
                                        <input type="checkbox" value={index} className="form-checkbox "
                                            checked={formData.targetDays.includes(index)} onChange={() => handleCheckboxChange(index)}
                                        />
                                        <span className="text-gray-500 text-sm">{day}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                    {inputErrors.targetDays && (
                        <div aria-live="assertive" className="flex text-red-500 text-sm mt-2">
                            <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.targetDays}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
