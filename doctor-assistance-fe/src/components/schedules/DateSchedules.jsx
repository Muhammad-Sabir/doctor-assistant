import React from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { LuTimer } from "react-icons/lu";
import { BiMessageSquareDetail } from "react-icons/bi";
import { RiHospitalLine } from "react-icons/ri";

import HospitalName from "@/components/shared/HospitalName";
import { convert24HrTo12Hr } from "@/utils/time";

const DateSchedule = ({ key, date, dateSchedules }) => {

    return (
        <AccordionItem key={key} value={date}>
            <AccordionTrigger>
                <div className="font-bold text-md text-primary">{date}</div>
            </AccordionTrigger>
            <AccordionContent>
                {dateSchedules.length === 0 ? (
                    <div className="sm:ml-3 text-sm text-gray-500 py-1">No time slots available</div>
                ) : (
                    <div>
                        <div className="sm:ml-3 hidden sm:grid grid-cols-3 gap-4 py-3 border-t border-gray-300">
                            <div className="text-sm font-medium text-gray-700">Hospital</div>
                            <div className="text-sm font-medium text-gray-700">Reason</div>
                            <div className="text-sm font-medium text-gray-700">Slots</div>
                        </div>

                        {dateSchedules.map((schedule, index) => (
                            <div key={`${schedule.id}-${index}`} className="sm:ml-3 border-t border-gray-300 py-3">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:gap-4">
                                    <div className="flex sm:block text-sm font-normal text-gray-600 mb-1 sm:mb-2">
                                        <div className="flex items-center justify-between text-primary font-medium text-sm mr-1 sm:hidden">
                                            <RiHospitalLine className="mr-1" />
                                            <span>Hospital:</span>
                                        </div>
                                        <HospitalName id={schedule.hospital} />
                                    </div>

                                    <div className="flex sm:block text-sm font-normal text-gray-600 mb-2">
                                        <div className="flex items-center justify-between text-primary font-medium text-sm mr-1 sm:hidden">
                                            <BiMessageSquareDetail className="mr-1" />
                                            <span>Reason:</span>
                                        </div>
                                        {schedule.reason}
                                    </div>

                                    <div className="block text-sm text-gray-500 space-y-1">
                                        <div className="flex items-center text-primary font-medium text-sm mr-1 sm:hidden">
                                            <LuTimer className="mr-1" />
                                            <span>Slots:</span>
                                        </div>
                                        {schedule.time_slots.map((slot, slotIndex) => (
                                            <div key={`${schedule.id}-${slotIndex}`}>
                                                {convert24HrTo12Hr(slot.start_time)} - {convert24HrTo12Hr(slot.end_time)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    );
};

export default DateSchedule;
