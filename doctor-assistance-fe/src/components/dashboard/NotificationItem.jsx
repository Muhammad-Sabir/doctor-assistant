import React from 'react';
import { useNavigate } from 'react-router-dom';

import { getNotificationData } from '@/components/shared/NotificationData';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { DropdownMenuItem} from "@/components/ui/dropdown-menu";
import { fetchWithAuth } from '@/utils/fetchApis';
import { formatRelativeTime } from '@/utils/date';

export const NotificationItem = ({ notification, onMarkAsRead }) => {
    const navigate = useNavigate();
    const { icon, url } = getNotificationData(notification?.notification_type);

    const updateNotificationMutation = useCreateUpdateMutation({
        url: `notifications/${notification.id}/`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithAuth,
        onSuccessMessage: 'Notification Mark as read',
        onErrorMessage: 'Failed to mark notification as read',
    });

    const handleClick = () => {
        markAsRead(notification.id);
        navigate(url);
    };

    const markAsRead = (id) => {
        onMarkAsRead(id);
        updateNotificationMutation.mutate(JSON.stringify({ is_read: true }));
    };

    return (
        <DropdownMenuItem
            onClick={handleClick}
            className={`relative flex items-center gap-3 px-4 group py-2 my-2 mx-2 cursor-pointer ${
                notification.is_read ? '' : 'bg-accent'
            }`}
        >
            <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center ${notification.is_read ? 'bg-gray-200' : 'bg-white'} group-hover:bg-white rounded-full`}>
                {icon}
            </div>

            <div className="flex-1 w-64 sm:w-94">
                <p className="text-sm font-semibold text-gray-600">
                    {notification.message}
                </p>
                <p className="text-xs text-gray-500">{formatRelativeTime(notification?.created_at)}</p>
            </div>

            {!notification.is_read && (
                <span className="absolute top-1/2 right-2 w-2 h-2 -mt-1 bg-blue-500 rounded-full"></span>
            )}
        </DropdownMenuItem>
    );
};
