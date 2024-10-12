import { Home, Users, LineChart, Settings, LogOut, FileIcon } from 'lucide-react';
import { RiUserSearchLine } from "react-icons/ri";
import { FaRegComments } from "react-icons/fa6";
import { LuCalendarClock } from "react-icons/lu";
import { TbReportMedical } from "react-icons/tb";

export const menuItems = {
    doctor: [
        { icon: <Home className="h-5 w-5" />, url: "/doctor/home", name: "Home" },
        { icon: <Users className="h-5 w-5" />, url: "/doctor/my-patients", name: "My Patients" },
        { icon: <FileIcon className="h-5 w-5" />, url: "/doctor/my-consultations", name: "Consultations" },
        { icon: <LineChart className="h-5 w-5" />, url: "/doctor/analytics", name: "Analytics" },
    ],
    patient: [
        { icon: <Home className="h-5 w-5" />, url: "/patient/home", name: "Home" },
        { icon: <RiUserSearchLine className="h-5 w-5" />, url: "/patient/doctors", name: "Doctors" },
        { icon: <FaRegComments className="h-5 w-5" />, url: "/patient/reviews", name: "My Reviews" },
        { icon: <LuCalendarClock className="h-5 w-5" />, url: "/patient/appointments", name: "Appointments" },
        { icon: <TbReportMedical className="h-5 w-5" />, url: "/patient/prescription", name: "Prescription" },
    ],
};

export const accountLinks = [
    { icon: <Settings className="h-4 w-4" />, url: "profile", name: "Profile" },
    { icon: <LogOut className="h-4 w-4" />, url: "logout", name: "Logout" },
];
