import { Home, Users, Settings, LogOut } from 'lucide-react';
import { RiUserSearchLine } from "react-icons/ri";
import { FaRegComments } from "react-icons/fa6";
import { LuCalendarClock } from "react-icons/lu";
import { TbClock24, TbReportMedical, TbBrandHipchat} from "react-icons/tb";
import ChatBadge from './ChatBadge';

export const menuItems = {
    doctor: [
        { icon: <Home className="h-5 w-5" />, url: "/doctor/home", name: "Home" },
        { icon: <TbClock24 className="h-5 w-5" />, url: "/doctor/schedule", name: "My Schedule" },
        { icon: <Users className="h-5 w-5" />, url: "/doctor/patients", name: "My Patients" },
        {icon: <LuCalendarClock className="h-5 w-5" />, url: "/doctor/appointments", name: "Appointments" },
        {icon: <TbReportMedical className="h-5 w-5" />, url: "/doctor/consultations", name: "Consultations" },
        { icon: <div className="relative"><TbBrandHipchat className="h-5 w-5" /><ChatBadge /></div>, url: "/doctor/chats", name: "Chats" },
    ],
    patient: [
        { icon: <Home className="h-5 w-5" />, url: "/patient/home", name: "Home" },
        { icon: <RiUserSearchLine className="h-5 w-5" />, url: "/patient/doctors", name: "Doctors" },
        { icon: <FaRegComments className="h-5 w-5" />, url: "/patient/reviews", name: "My Reviews" },
        { icon: <LuCalendarClock className="h-5 w-5" />, url: "/patient/appointments", name: "Appointments" },
        { icon: <TbReportMedical className="h-5 w-5" />, url: "/patient/consultations", name: "Consultations" },
        { icon: <div className="relative"><TbBrandHipchat className="h-5 w-5" /><ChatBadge /></div>, url: "/patient/chats", name: "Chats" },
    ],
};

export const accountLinks = [
    { icon: <Settings className="h-4 w-4" />, url: "profile", name: "Profile" },
    { icon: <LogOut className="h-4 w-4" />, url: "logout", name: "Logout" },
];
