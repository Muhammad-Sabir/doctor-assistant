export const toHHMMFormat = (time) => {
    return time?.slice(0, 5);
};

export const convert24HrTo12Hr = (time) => {
    if (!time) return null;

    const [hours, minutes] = time.split(":");

    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 % 12 || 12; 
    const period = hour24 < 12 ? "AM" : "PM";

    return `${hour12.toString().padStart(2, "0")}:${minutes} ${period}`;
};
