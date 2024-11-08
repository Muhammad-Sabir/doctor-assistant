import { CiMedicalCross } from "react-icons/ci";
import { LuCalendarClock } from "react-icons/lu";
import { TbReportMedical } from "react-icons/tb";

export function getNotificationData(type) {
    
    const notificationMap = {
        appointment: {
            icon: <LuCalendarClock size={18} className=" text-blue-500" />,
            url: 'appointments',
        },
        prescription: {
            icon: <CiMedicalCross size={18} className=" text-green-500" />,
            url: 'prescription',
        },
        consultation: {
            icon: <TbReportMedical size={18} className=" text-green-500" />,
            url: 'consultations',
        },
    };

    return notificationMap[type];
}
