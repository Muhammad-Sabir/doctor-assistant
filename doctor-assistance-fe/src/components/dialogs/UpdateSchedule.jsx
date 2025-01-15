import React, { useState, useEffect } from "react";
import { IoCloseCircleOutline, IoAddCircleOutline } from "react-icons/io5";
import { AiTwotoneEdit } from "react-icons/ai";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useCreateUpdateMutation } from "@/hooks/useCreateUpdateMutation";
import { fetchWithAuth } from "@/utils/fetchApis";
import TimePicker from "@/components/shared/TimePicker";
import { toHHMMFormat, formatTime, formatTimeString } from "@/utils/time";

export default function UpdateSchedule({ scheduleData }) {
    const [formData, setFormData] = useState({
        timeSlots: [],
    });

    useEffect(() => {
        if (scheduleData?.original_time_slots?.length) {
            setFormData({
                timeSlots: scheduleData.original_time_slots.map((slot) => ({
                    ...slot,
                    start_time: toHHMMFormat(slot.start_time),
                    end_time: toHHMMFormat(slot.end_time)
                })),
            });
        }
    }, [scheduleData]);

    const updateScheduleMutation = useCreateUpdateMutation({
        url: `schedules/${scheduleData?.id}/`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        fetchFunction: fetchWithAuth,
        onSuccessMessage: "Schedule updated successfully!",
        onErrorMessage: "Failed to update schedule",
        onSuccess: () => {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        },
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        updateScheduleMutation.mutate(JSON.stringify({ time_slots: formData.timeSlots }));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <span>
                    <AiTwotoneEdit size={17} className="mt-0.5 ml-1 text-gray-500" />
                </span>
            </DialogTrigger>

            <DialogContent className='max-w-xl'> 
                <DialogHeader>
                    <DialogTitle>Update Schedule</DialogTitle>
                    <DialogDescription>
                        Update the details for the selected schedule.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid py-2">
                    <Label className="text-gray-700 text-sm font-normal">Timings</Label>
                    <div className="p-2 overflow-y-auto max-h-28 sm:max-h-48">
                        {formData.timeSlots.map((slot, index) => (
                            <div key={index} className="flex items-center gap-3 mb-2 ml-2">
                                <div className="flex flex-col">
                                    <TimePicker value={formatTime(toHHMMFormat(slot.start_time))}
                                        onChange={(value) => handleTimeSlotChange(index, "start_time", formatTimeString(value))} />
                                </div>
                                <div className="flex mx-2 text-sm mt-5 text-gray-600">To</div>

                                <div className="flex flex-col">
                                    <TimePicker value={formatTime(toHHMMFormat(slot.end_time))}
                                        onChange={(value) => handleTimeSlotChange(index, "end_time", formatTimeString(value))} />
                                </div>

                                <div className="flex flex-col mx-2">
                                    <Label htmlFor={`duration_${index}`} className="mb-1 text-sm font-normal text-gray-600">Duration</Label>
                                    <Input type="text" id={`duration_${index}`} value={slot.duration}
                                        onChange={(e) => handleTimeSlotChange(index, "duration", e.target.value)}
                                        required className="w-20" placeholder="mins"
                                    />
                                </div>

                                {formData.timeSlots.length === 1 ? (
                                    <span onClick={addTimeSlot}><IoAddCircleOutline color="green" className="w-5 h-5 font-bold mt-7" /> </span>
                                ) : (
                                    <>
                                        {index === formData.timeSlots.length - 1 && (
                                            <>
                                                <span onClick={addTimeSlot}><IoAddCircleOutline color="green" className="w-5 h-5 font-bold mt-7" /></span>
                                                <span onClick={() => removeTimeSlot(index)}><IoCloseCircleOutline color="red" className="w-5 h-5 -ml-1 font-bold mt-7" /></span>
                                            </>
                                        )}
                                        {index > 0 && index !== formData.timeSlots.length - 1 && (
                                            <span onClick={() => removeTimeSlot(index)}><IoCloseCircleOutline color="red" className="w-5 h-5 font-bold mt-7" /></span>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit}>Update</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
