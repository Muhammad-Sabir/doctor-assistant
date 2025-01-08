import React, { useState, useEffect } from "react";

import { Accordion } from "@/components/ui/accordion";
import Loading from "@/components/shared/Loading";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { fetchWithAuth } from "@/utils/fetchApis";
import OverrideSchedule from "@/components/dialogs/OverrideSchedule";
import DateSchedule from "@/components/schedules/DateSchedules";

const SpecificSchedule = () => {

    const { data, isFetching, isError, error } = useFetchQuery({
        url: "schedule-overrides/",
        queryKey: ["specificSchedule"],
        fetchFunction: fetchWithAuth,
    });

    const schedules = data?.results || [];
    const [openDate, setOpenDate] = useState("");

    useEffect(() => {
        if (openDate) {
            localStorage.setItem("openDate", openDate);
        } else {
            localStorage.removeItem("openDate");
        }
    }, [openDate]);

    if (isFetching) return <Loading />;
    if (isError) return <p className="text-primary">Error fetching specific schedules: {error.message}</p>;

    const groupedSchedules = schedules.reduce((acc, schedule) => {
        if (!acc[schedule.date]) {
            acc[schedule.date] = [];
        }
        acc[schedule.date].push(schedule);
        return acc;
    }, {});

    return (
        <div>
            
            <div className="block sm:flex sm:justify-between sm:items-center mb-3">
                <p className="text-gray-600 text-sm mb-4 sm:mb-0 sm:mr-4"> Here you can set special schedules according to your availability or unavailability.
                    <br />These will override the default schedule.
                </p>
                <div className="flex justify-end sm:justify-start">
                    <OverrideSchedule />
                </div>
            </div>

            <hr className="border-t border-gray-300 mt-6 sm:hidden" />
            <h2 className="mt-3 sm:mt-0 text-md font-medium text-primary mb-3">Your Customized Schedules:</h2>

            {Object.keys(groupedSchedules).length === 0 ? (
                <p className="text-gray-500">You don't have any customized schedules.</p>
            ) : (
                <Accordion type="single" collapsible value={openDate} onValueChange={setOpenDate}>
                    {Object.keys(groupedSchedules).map((date) => (
                        <DateSchedule key={date} date={date} dateSchedules={groupedSchedules[date]} />
                    ))}
                </Accordion>
            )}
        </div>
    );
};

export default SpecificSchedule;
