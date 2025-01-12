import React, { useState } from "react";
import { IoAddCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import { BiSolidError } from "react-icons/bi";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import TimePicker from "../shared/TimePicker";

import { useCreateUpdateMutation } from "@/hooks/useCreateUpdateMutation";
import { fetchWithAuth } from "@/utils/fetchApis";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { daysOfWeek } from "@/utils/day";
import { validateField, hasNoFieldErrors, validateAllFields } from "@/utils/validations";
import { formatTime, formatTimeString } from "@/utils/time";

export default function CreateSchedule() {
  const [formData, setFormData] = useState({
    hospitalId: "",
    dayOfWeek: "",
    timeSlots: [{ start_time: "", end_time: "", duration: "" }],
  });
  const [inputErrors, setInputErrors] = useState({});

  const { data: doctorData, isFetching, isError, } = useFetchQuery({
    url: `doctors/me`,
    queryKey: ["doctorInfo"],
    fetchFunction: fetchWithAuth,
  });

  const hospitals = doctorData?.hospitals || [];

  const createScheduleMutation = useCreateUpdateMutation({
    url: `schedules/`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    fetchFunction: fetchWithAuth,
    onSuccessMessage: "Schedule created successfully!",
    onErrorMessage: "Failed to create Schedule",
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
      ...prev,
      timeSlots: [...prev.timeSlots, { start_time: "", end_time: "", duration: "" },],
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
      localStorage.setItem("openDay", daysOfWeek[dayOfWeek]);

      createScheduleMutation.mutate(JSON.stringify({
        hospital: hospitalId, day_of_week: dayOfWeek,
        is_available: true, time_slots: timeSlots,
      })
      );
    }
  };

  const handleDialogClose = () => {
    setFormData({
      hospitalId: "", dayOfWeek: "",
      timeSlots: [{ start_time: "", end_time: "", duration: "" }],
    });
    setInputErrors({});
  };

  return (
    <Dialog onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button>Create Schedule</Button>
      </DialogTrigger>

      <DialogContent className='max-w-xl'>
        <DialogHeader>
          <DialogTitle>Create Schedule</DialogTitle>
          <DialogDescription>
            Set the details for the schedule you want to create.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="hospitalId" className="text-sm font-normal text-gray-700" >Hospital</Label>
            <div className="text-gray-500">
              <Select id="hospitalId" value={formData.hospitalId}
                onValueChange={(value) => handleSelectChange(value, "hospitalId")} required
              >
                <SelectTrigger className={`${inputErrors.hospitalId ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select a hospital" />
                </SelectTrigger>
                <SelectContent>
                  {isFetching ? (<SelectItem value="loading" disabled>Loading... </SelectItem>
                  ) : isError ? (
                    <SelectItem value="error" disabled>Error fetching hospitals...</SelectItem>
                  ) : (
                    hospitals.map((hospital) => (
                      <SelectItem key={hospital.id} value={hospital.id}>{hospital.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {inputErrors.hospitalId && (
                <div aria-live="assertive" className="flex mt-2 text-sm text-red-500">
                  <BiSolidError color="red" className="mt-1 mr-1" />{inputErrors.hospitalId}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dayOfWeek" className="text-sm font-normal text-gray-700" >  Day of Week</Label>
            <div className="text-gray-500">
              <Select id="dayOfWeek" value={formData.dayOfWeek}
                onValueChange={(value) => handleSelectChange(value, "dayOfWeek")} required
              >
                <SelectTrigger className={`${inputErrors.dayOfWeek ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select a day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day, index) => (
                    <SelectItem key={index} value={index}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {inputErrors.dayOfWeek && (
                <div aria-live="assertive" className="flex mt-2 text-sm text-red-500">
                  <BiSolidError color="red" className="mt-1 mr-1" />{inputErrors.dayOfWeek}
                </div>
              )}
            </div>
          </div>

          <div className="grid">
            <Label className="text-sm font-normal text-gray-700">Timings</Label>
            <div className="p-2 overflow-y-auto max-h-28 sm:max-h-48">
              {formData.timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center gap-3 mb-2 ml-2">
                  <div className="flex flex-col">
                    <TimePicker value={formatTime(slot.start_time)} 
                    onChange={(value) => handleTimeSlotChange(index, "start_time", formatTimeString(value))} />
                  </div>
                  <div className="flex mx-2 text-sm mt-5 text-gray-600">To</div>

                  <div className="flex flex-col">
                    <TimePicker value={formatTime(slot.end_time)} 
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
                          <span onClick={() => removeTimeSlot(index)}><IoCloseCircleOutline color="red" className="w-5 h-5 -ml-1 font-bold mt-7"/></span>
                        </>
                      )}
                      {index > 0 && index !== formData.timeSlots.length - 1 && (
                        <span onClick={() => removeTimeSlot(index)}><IoCloseCircleOutline color="red" className="w-5 h-5 font-bold mt-7"/></span>
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
