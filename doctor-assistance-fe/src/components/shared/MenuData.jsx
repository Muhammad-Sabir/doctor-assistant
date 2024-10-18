import { Home, Users, Settings, LogOut } from 'lucide-react';
import { RiUserSearchLine } from "react-icons/ri";
import { FaRegComments } from "react-icons/fa6";
import { LuCalendarClock } from "react-icons/lu";
import { TbReportMedical } from "react-icons/tb";
import { TbBrandHipchat } from "react-icons/tb";

export const menuItems = {
    doctor: [
        { icon: <Home className="h-5 w-5" />, url: "/doctor/home", name: "Home" },
        { icon: <Users className="h-5 w-5" />, url: "/doctor/patients", name: "My Patients" },
        {icon: <LuCalendarClock className="h-5 w-5" />, url: "/doctor/appointments", name: "Appointments" },
        { icon: <TbBrandHipchat className="h-5 w-5" />, url: "/doctor/chats", name: "Chats" },
    ],
    patient: [
        { icon: <Home className="h-5 w-5" />, url: "/patient/home", name: "Home" },
        { icon: <RiUserSearchLine className="h-5 w-5" />, url: "/patient/doctors", name: "Doctors" },
        { icon: <FaRegComments className="h-5 w-5" />, url: "/patient/reviews", name: "My Reviews" },
        { icon: <LuCalendarClock className="h-5 w-5" />, url: "/patient/appointments", name: "Appointments" },
        { icon: <TbReportMedical className="h-5 w-5" />, url: "/patient/prescription", name: "Prescription" },
        { icon: <TbBrandHipchat className="h-5 w-5" />, url: "/patient/chats", name: "Chats" },
    ],
};

export const accountLinks = [
    { icon: <Settings className="h-4 w-4" />, url: "profile", name: "Profile" },
    { icon: <LogOut className="h-4 w-4" />, url: "logout", name: "Logout" },
];
