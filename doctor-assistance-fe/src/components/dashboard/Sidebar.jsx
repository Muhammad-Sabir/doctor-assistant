import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import logoIcon from '@/assets/images/svg/logo-icon.svg';
import { Home, ShoppingCart, Package, Users, LineChart, Settings, LogOut } from 'lucide-react';

const sidebarItems = {
    doctor: [
        { icon: <Home className="icon-size" />, url: "/doctor/dashboard", name: "Dashboard" },
        { icon: <ShoppingCart className="icon-size" />, url: "/doctor/orders", name: "Orders" },
        { icon: <Package className="icon-size" />, url: "/doctor/products", name: "Products" },
        { icon: <Users className="icon-size" />, url: "/doctor/customers", name: "Customers" },
        { icon: <LineChart className="icon-size" />, url: "/doctor/analytics", name: "Analytics" },
    ],
    patient: [
        { icon: <Home className="icon-size" />, url: "/patient/chat", name: "Chat" },
        { icon: <ShoppingCart className="icon-size" />, url: "/patient/my-patients", name: "My Patients" },
        { icon: <LineChart className="icon-size" />, url: "/patient/my-doctors", name: "My Doctors" },
        { icon: <Home className="icon-size" />, url: "/patient/home", name: "Dashboard" },
    ],
};

const accountLinks = [
    { icon: <Settings className="icon-size" />, url: "profile", name: "Profile" },
    { icon: <LogOut className="icon-size" />, url: "logout", name: "Logout" },
];

export default function Sidebar() {
    const { user, logout } = useContext(AuthContext);
    const [activeItem, setActiveItem] = useState("Dashboard");
    const items = sidebarItems[user.role] || [];

    const handleSetActive = async (itemName) => {
        if (itemName === "Logout") {
            await logout();
        }
        setActiveItem(itemName);
    };

    return (
        <div className="hidden bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
                    <Link to={`/${user.role}`} className="flex items-center gap-2 font-semibold">
                        <img src={logoIcon} alt="LogoIcon" className="h-6 w-6" />
                        <span className="text-primary font-semibold">Doctor Assistance</span>
                    </Link>
                </div>
                <div className="flex-col">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <h2 className="text-xs font-medium p-2.5 pb-2 text-black">MAIN MENU</h2>
                        {items.map((item, index) => (
                            <Link
                                key={index}
                                to={item.url}
                                onClick={() => handleSetActive(item.name)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all 
                                    ${activeItem === item.name ? 'bg-primary text-white' : 'hover:bg-accent'}`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="border-t border-gray-300 px-4 py-2 mt-4">
                    <h2 className="text-xs font-medium p-2.5 text-black">ACCOUNT</h2>
                    <nav className="grid gap-2 text-sm font-medium">
                        {accountLinks.map((item, index) => (
                            <Link
                                key={index}
                                to={`/${user.role}/${item.url}`}
                                onClick={() => handleSetActive(item.name)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all 
                                    ${activeItem === item.name ? 'bg-primary text-white' : 'hover:bg-accent'}`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}
