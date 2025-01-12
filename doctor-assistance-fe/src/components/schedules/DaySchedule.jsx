import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { RiHospitalLine } from 'react-icons/ri';
import { LuTimer } from 'react-icons/lu';
import { BiHourglass } from 'react-icons/bi';

import DisplaySlots from "@/components/dialogs/DisplaySlots";
import CopySchedule from '@/components/dialogs/CopySchedule';
import UpdateSchedule from '@/components/dialogs/UpdateSchedule';
import DeleteItem from '@/components/dialogs/DeleteItem';
import { toHHMMFormat } from "@/utils/time";

const DaySchedule = ({dayName, schedules }) => {

    const groupSlots = (slots, blockStartTime, blockEndTime) => {
        return slots.filter(
            (slot) => slot.start_time >= blockStartTime && slot.end_time <= blockEndTime
        );
    };

    return (
        <AccordionItem value={dayName}>
            <AccordionTrigger>
                <div className="font-bold text-md text-primary">{dayName}</div>
            </AccordionTrigger>
            <AccordionContent>
                {schedules.length === 0 ? (
                    <div className="sm:ml-3 text-sm text-gray-500 py-1">No schedule set yet for {dayName}. Create one by clicking the Create Schedule button</div>
                ) : (
                    <div>
                        <div className="sm:ml-3 hidden sm:grid grid-cols-6 gap-4 py-3 border-t border-gray-300">
                            <div className="text-sm font-medium text-gray-700">Hospital</div>
                            <div className="text-sm font-medium text-gray-700">Timings</div>
                            <div className="text-sm font-medium text-gray-700">Duration</div>
                            <div className="text-sm font-medium text-gray-700">Slots</div>
                            <div className="text-sm font-medium text-gray-700">Actions</div>
                        </div>
                        {schedules.map((schedule, hospitalIndex) => (
                            <div key={`${dayName}-${hospitalIndex}`}>
                                <div className="sm:ml-3 border-t border-gray-300 py-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-6 gap-0 sm:gap-4">
                                        <div className="flex sm:block text-sm font-normal text-primary sm:text-gray-600 mb-1 sm:mb-2">
                                            <div className="flex items-center text-primary font-medium text-sm mr-1 sm:hidden mb-3">
                                                <RiHospitalLine className="mr-1" />
                                                <span>Hospital:</span>
                                            </div>
                                            {schedule.hospital_name}
                                        </div>
                                        <div className="flex flex-col space-y-2 col-span-4">
                                            {schedule.original_time_slots.map((slot, slotIndex) => {
                                                const groupedSlots = groupSlots(schedule.time_slots, slot.start_time, slot.end_time);

                                                return (
                                                    <div key={`${schedule.id}-${slotIndex}`} className="grid grid-cols-1 sm:grid-cols-4 gap-1 pb-2">
                                                        <div className='border border-gray-300 p-3 rounded-md sm:hidden'>
                                                            <div className="flex text-sm font-normal text-gray-600 sm:mb-2">
                                                                <div className="flex items-center text-primary font-medium text-sm mr-1 sm:hidden">
                                                                    <LuTimer className="mr-1" />
                                                                </div>
                                                                {toHHMMFormat(slot.start_time)} - {toHHMMFormat(slot.end_time)}
                                                            </div>
                                                            <div className="flex text-sm font-normal text-gray-600 sm:mb-2">
                                                                <div className="flex items-center text-primary font-medium text-sm mr-1 sm:hidden">
                                                                    <BiHourglass className="mr-1" />
                                                                </div>
                                                                {slot.duration} mins
                                                            </div>
                                                            <div className="text-sm font-normal text-gray-500">
                                                                <DisplaySlots groupedSlots={groupedSlots} dayName={dayName}
                                                                    hospitalName={schedule.hospital_name} timings={`${toHHMMFormat(slot.start_time)} - ${toHHMMFormat(slot.end_time)}`}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="hidden sm:block text-sm font-normal text-gray-500">{toHHMMFormat(slot.start_time)} - {toHHMMFormat(slot.end_time)}</div>
                                                        <div className="hidden sm:block text-sm font-normal text-gray-500">{slot.duration} mins</div>
                                                        <div className="hidden sm:block text-sm font-normal text-gray-500">
                                                            <DisplaySlots groupedSlots={groupedSlots} dayName={dayName}
                                                                hospitalName={schedule.hospital_name} timings={`${toHHMMFormat(slot.start_time)} - ${toHHMMFormat(slot.end_time)}`}
                                                            />
                                                        </div>
                                                        <div className="flex mt-3 sm:mt-0 justify-end sm:justify-start items-center">
                                                            {slotIndex === schedule.original_time_slots.length - 1 && (
                                                                <>
                                                                    <CopySchedule sourceDay={schedule.day_of_week} hospitalId={schedule.hospital}
                                                                        sourceDayName={schedule.day_name} hospitalName={schedule.hospital_name} />
                                                                    <UpdateSchedule scheduleData={schedule} />
                                                                    <DeleteItem deleteUrl={`schedules/${schedule.id}/`} itemName={`Schedule for ${schedule.hospital_name} `} iconSize={16} />
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
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

export default DaySchedule;
