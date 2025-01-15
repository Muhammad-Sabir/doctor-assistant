export const toHHMMFormat = (time) => {
    return time?.slice(0, 5);
};

export const formatTimeString = (value) => {
    return `${value.hours}:${value.minutes}`;
};

export const formatTime = (time) => {
    if (!time) return { hours: "", minutes: "" };

    const [hours, minutes] = time.split(":");

    return {
        hours,
        minutes: minutes || "",
    };
};

export const removeLeadingZeros = (str) => {
    return str.replace(/^0+/, '');
}

export const formatTimeValue = (value, min, max) => {
    let newValue = Math.max(min, Math.min(max, Number(value))); 
    newValue = removeLeadingZeros(newValue.toString());
    return newValue.padStart(2, "0");
};