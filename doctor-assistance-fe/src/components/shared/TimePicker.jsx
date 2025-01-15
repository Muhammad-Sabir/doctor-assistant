import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { formatTimeValue, removeLeadingZeros } from "@/utils/time";

const TimePicker = ({ value, onChange }) => {
  const [hours, setHours] = useState(value?.hours || "00");
  const [minutes, setMinutes] = useState(value?.minutes || "00");

  const handleHoursChange = (e) => {
    const formattedHours = formatTimeValue(e.target.value, 0, 24);
    setHours(formattedHours);
    onChange({ hours: formattedHours, minutes });
  };

  const handleMinutesChange = (e) => {
    const formattedMinutes = formatTimeValue(e.target.value, 0, 59); 
    setMinutes(formattedMinutes);
    onChange({ hours, minutes: formattedMinutes });
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
