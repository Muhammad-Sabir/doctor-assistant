import React, { useEffect, useState } from "react";

import { Accordion } from "@/components/ui/accordion";

import { useFetchQuery } from "@/hooks/useFetchQuery";
import { fetchWithAuth } from "@/utils/fetchApis";
import Loading from "@/components/shared/Loading";
import CreateSchedule from "@/components/dialogs/CreateSchedule";
import DaySchedule from "@/components/schedules/DaySchedule";
import { daysOfWeek } from "@/utils/day";

const DefaultSchedule = () => {

    const { data, isFetching, isError, error } = useFetchQuery({
        url: "schedules/",
        queryKey: ["doctorSchedule"],
        fetchFunction: fetchWithAuth,
    });

    const schedules = data?.results || [];
    const [openDay, setOpenDay] = useState(() => localStorage.getItem("openDay") || "");

    useEffect(() => {
        if (openDay) {
            localStorage.setItem("openDay", openDay);
        } else {
            localStorage.removeItem("openDay");
        }
    }, [openDay]);

    const getSchedulesForDay = (dayName) => {
        return schedules.filter((schedule) => schedule.day_name === dayName);
    };

    if (isFetching) return <Loading />;
    if (isError) return <p className="text-primary">Error fetching doctor schedules: {error.message}</p>;

    return (
        <div>
            <div className="block sm:flex sm:justify-between sm:items-center mb-3">
                <p className="text-gray-600 text-sm mb-4 sm:mb-0 sm:mr-4"> View and Set your default schedule for each day of the week.</p>
                <div className="flex justify-end sm:justify-start">
                    <CreateSchedule />
                </div>
            </div>

            <hr className="border-t border-gray-300 mt-6 sm:hidden" />
            <h2 className="mt-3 sm:mt-0 text-md font-medium text-primary mb-3">Your Default Schedules:</h2>

            <Accordion type="single" collapsible value={openDay} onValueChange={setOpenDay}>
                {daysOfWeek.map((dayName) => (
                    <DaySchedule key={dayName} dayName={dayName} schedules={getSchedulesForDay(dayName)} />
                ))}
            </Accordion>
        </div>
    );
};

export default DefaultSchedule;
