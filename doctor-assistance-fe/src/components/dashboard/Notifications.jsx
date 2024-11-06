import React, { useState } from 'react';
import { Bell } from "lucide-react";
import { useNavigate } from 'react-router-dom';

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { getNotificationData } from '@/components/shared/NotificationData';
import dummyNotifications from '@/assets/data/dummyNotifications';

export default function Notifications() {

    const [notifications, setNotifications] = useState(dummyNotifications);

    const navigate = useNavigate();

    const handleNotificationClick = (url) => {
        navigate(url);
    };

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='outline' className="focus-visible:ring-0 border-none relative mt-1 overflow-visible p-0" aria-label="Notifications">
                        <Bell className="h-5 w-5" />
                        {notifications.length > 0 && (
                            <span className="absolute top-0 z-10 -right-1 text-xxs text-white bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
                                {notifications.length}
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="sticky top-0 bg-white z-10 px-4 py-2">
                        <h3 className='text-primary font-semibold'>
                            Notifications
                            {notifications.length > 0 && (
                                <span className='ml-1'>({notifications.length})</span>
                            )}
                        </h3>
                        <p className='text-gray-600 font-normal text-sm'>Stay updated with your latest notifications</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-56 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => {
                                const { icon, url } = getNotificationData(notification.type);
                                return (
                                    <DropdownMenuItem
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(url)}
                                        className="flex items-center gap-3 px-4 group py-2 my-1 mx-1"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-200 group-hover:bg-white rounded-full">
                                            {icon}
                                        </div>

                                        <div className="flex-1 w-64 sm:w-94">
                                            <p className="text-sm font-semibold text-gray-600">{notification.message}</p>
                                            <p className="text-xs text-gray-500">{notification.timestamp}</p>
                                        </div>
                                    </DropdownMenuItem>
                                );
                            })
                        ) : (
                            <p className="text-gray-600 text-sm flex-1 w-64 sm:w-94 px-4 py-2 my-1 mx-1">You have no notifications yet.</p>
                        )}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
