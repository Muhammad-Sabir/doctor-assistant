import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { removeLeadingZeros } from "@/utils/time";

const TimePicker = ({ value, onChange }) => {
  const [hours, setHours] = useState(value?.hours || "00");
  const [minutes, setMinutes] = useState(value?.minutes || "00");

  const handleHoursChange = (e) => {
    let newHours = Math.max(0, Math.min(24, Number(e.target.value)));

    newHours = removeLeadingZeros(newHours.toString());

    const formattedHours = newHours.padStart(2, "0");
    setHours(formattedHours);
    onChange({ hours: formattedHours, minutes });
  };

  const handleMinutesChange = (e) => {
    let newMinutes = Math.max(0, Math.min(59, Number(e.target.value)));
    newMinutes = removeLeadingZeros(newMinutes.toString());

    setMinutes(newMinutes.padStart(2, "0"));
    onChange({ hours, minutes: newMinutes.padStart(2, "0") });
  };

  return (
    <div className="flex items-center gap-4 my-2">
      <div className="flex flex-col items-center">
        <Label className="mb-1 text-sm font-normal text-gray-600">HH</Label>
        <Input
          type="number"
          value={hours}
          onChange={handleHoursChange}
          min="1"
          max="24"
          className="w-16 text-center text-gray-600 "
        />
      </div>

      <div className="flex flex-col items-center">
        <Label className="mb-1 text-sm font-normal text-gray-600">MM</Label>
        <Input
          type="number"
          value={minutes}
          onChange={handleMinutesChange}
          min="0"
          max="59"
          className="w-16 text-center text-gray-600"
        />
      </div>
    </div>
  );
};

export default TimePicker;
