import { Home, ShoppingCart, Package, Users, LineChart, Settings, LogOut } from 'lucide-react';

export const menuItems = {
    doctor: [
        { icon: <Home className="h-5 w-5" />, url: "/doctor/dashboard", name: "Dashboard" },
        { icon: <ShoppingCart className="h-5 w-5" />, url: "/doctor/orders", name: "Orders" },
        { icon: <Package className="h-5 w-5" />, url: "/doctor/products", name: "Products" },
        { icon: <Users className="h-5 w-5" />, url: "/doctor/customers", name: "Customers" },
        { icon: <LineChart className="h-5 w-5" />, url: "/doctor/analytics", name: "Analytics" },
    ],
    patient: [
        { icon: <Home className="h-5 w-5" />, url: "/patient/chat", name: "Chat" },
        { icon: <Package className="h-5 w-5" />, url: "/patient/my-patients", name: "My Patients" },
        { icon: <Users className="h-5 w-5" />, url: "/patient/my-doctors", name: "My Doctors" },
        { icon: <Home className="h-5 w-5" />, url: "/patient/home", name: "Home" },
    ],
};

export const accountLinks = [
    { icon: <Settings className="h-4 w-4" />, url: "profile", name: "Profile" },
    { icon: <LogOut className="h-4 w-4" />, url: "logout", name: "Logout" },
];
