import React from 'react';
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NotificationItem } from '@/components/dashboard/NotificationItem';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNotifications } from '@/hooks/useNotifications';

export default function Notifications() {
    const { notifications, markAsRead, unreadCount} = useNotifications();

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='outline' className="focus-visible:ring-0 border-none relative mt-1 overflow-visible p-0" aria-label="Notifications">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 z-10 -right-1 text-xxs text-white bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
                                {unreadCount}
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
                            notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onMarkAsRead={markAsRead}
                                />
                            ))
                        ) : (
                            <p className="text-gray-600 text-sm flex-1 w-64 sm:w-94 px-4 py-2 my-1 mx-1">You have no notifications yet.</p>
                        )}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
