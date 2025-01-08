import React, { useState, useEffect } from "react";
import { IoCloseCircleOutline, IoAddCircleOutline } from "react-icons/io5";
import { AiTwotoneEdit } from "react-icons/ai";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useCreateUpdateMutation } from "@/hooks/useCreateUpdateMutation";
import { fetchWithAuth } from "@/utils/fetchApis";
import { toHHMMFormat } from "@/utils/time";

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

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Schedule</DialogTitle>
                    <DialogDescription>
                        Update the details for the selected schedule.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid py-2">
                    <Label className="text-gray-700 text-sm font-normal">Timings</Label>
                    <div className="overflow-y-auto max-h-64 p-2">
                        {formData.timeSlots.map((slot, index) => (
                            <div key={index} className="flex items-center gap-3 mb-2 ml-2">

                                <div className="flex flex-col">
                                    <Label htmlFor={`start_time_${index}`} className="text-gray-600 font-normal text-sm mb-2">From</Label>
                                    <Input type="time" id={`start_time_${index}`} value={slot.start_time} required
                                        onChange={(e) => handleTimeSlotChange(index, "start_time", e.target.value)}
                                    />
                                </div>

                                <div className="flex text-gray-600 mt-5">-</div>

                                <div className="flex flex-col">
                                    <Label htmlFor={`end_time_${index}`} className="text-gray-600 font-normal text-sm mb-2">To</Label>
                                    <Input type="time" id={`end_time_${index}`} value={slot.end_time} required
                                        onChange={(e) => handleTimeSlotChange(index, "end_time", e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <Label htmlFor={`duration_${index}`} className="text-gray-600 font-normal text-sm mb-2">Duration </Label>
                                    <Input type="text" id={`duration_${index}`} value={slot.duration} required className="w-32" placeholder="(minutes)"
                                        onChange={(e) => handleTimeSlotChange(index, "duration", e.target.value)}
                                    />
                                </div>

                                {formData.timeSlots.length === 1 ? (
                                    <span onClick={addTimeSlot}><IoAddCircleOutline color="green" className="font-bold h-5 w-5 mt-7" /></span>
                                ) : (
                                    <>
                                        {index === formData.timeSlots.length - 1 && (
                                            <>
                                                <span onClick={addTimeSlot}><IoAddCircleOutline color="green" className="font-bold h-5 w-5 mt-7" /></span>
                                                <span onClick={() => removeTimeSlot(index)}><IoCloseCircleOutline color="red" className="font-bold -ml-1 h-5 w-5 mt-7" /></span>
                                            </>
                                        )}
                                        {index > 0 && index !== formData.timeSlots.length - 1 && (
                                            <span onClick={() => removeTimeSlot(index)}><IoCloseCircleOutline color="red" className="font-bold h-5 w-5 mt-7" /></span>
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
