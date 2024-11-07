import { useState, useEffect } from 'react';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';

export const useNotifications = () => {

    const { data: notificationData = { results: [] } } = useFetchQuery({
        url: 'notifications',
        queryKey: ['notify'],
        fetchFunction: fetchWithAuth,
    });

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        if (notificationData.results.length > 0) {
            setNotifications(notificationData.results);
        }
        setUnreadCount(notificationData.unread_count);
    }, [notificationData.results]);

    
    const markAsRead = (id) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notif) =>
                notif.id === id ? { ...notif, is_read: true } : notif
            )
        );
        setUnreadCount((prevCount) => prevCount - 1);
    };
    
    return { notifications, markAsRead, unreadCount };
};
