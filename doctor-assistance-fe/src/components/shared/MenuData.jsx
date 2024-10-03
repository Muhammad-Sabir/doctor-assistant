import { Home, Users, LineChart, Settings, LogOut, MessageCircle, FileIcon } from 'lucide-react';

export const menuItems = {
    doctor: [
        { icon: <Home className="h-5 w-5" />, url: "/doctor/home", name: "Home" },
        { icon: <Users className="h-5 w-5" />, url: "/doctor/my-patients", name: "My Patients" },
        { icon: <FileIcon className="h-5 w-5" />, url: "/doctor/my-consultations", name: "Consultations" },
        { icon: <LineChart className="h-5 w-5" />, url: "/doctor/analytics", name: "Analytics" },
    ],
    patient: [
        { icon: <Home className="h-5 w-5" />, url: "/patient/home", name: "Home" },
        { icon: <MessageCircle className="h-5 w-5" />, url: "/patient/chat", name: "Chat" },
        { icon: <Users className="h-5 w-5" />, url: "/patient/my-patients", name: "My Patients" },
        { icon: <LineChart className="h-5 w-5" />, url: "/patient/analytics", name: "Analytics" },
    ],
};

export const accountLinks = [
    { icon: <Settings className="h-4 w-4" />, url: "profile", name: "Profile" },
    { icon: <LogOut className="h-4 w-4" />, url: "logout", name: "Logout" },
];
