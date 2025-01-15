import React from "react";
import { FiEye } from "react-icons/fi";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import {  toHHMMFormat } from "@/utils/time";

const DisplaySlots = ({ dayName, hospitalName, timings, groupedSlots }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <span className="flex items-center gap-2 text-sm font-normal cursor-pointer text-primary">
                    <FiEye /> View Slots
                </span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Slots</DialogTitle>
                    <DialogDescription>
                        Showing your time slots for <strong>{dayName}</strong>, for <strong>{hospitalName}</strong>, during timings <strong>{timings}</strong>.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    {groupedSlots.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {groupedSlots.map((slot, index) => (
                                <li key={index} className="mb-2 text-sm text-gray-500">
                                    {toHHMMFormat(slot.start_time)} - {toHHMMFormat(slot.end_time)}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No grouped slots available.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DisplaySlots;
