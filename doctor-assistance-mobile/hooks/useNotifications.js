import { useState, useEffect } from 'react';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

export const useNotifications = () => {

    const { fetchWithUserAuth } = useAuth();
    const queryClient = useQueryClient();

    const { data: notificationData = { results: [] } } = useFetchQuery({
        url: 'notifications',
        queryKey: ['notify'],
        fetchFunction: fetchWithUserAuth,
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

    const refreshNotifications = () => {
        queryClient.invalidateQueries(['notify']);
    };
    
    return { notifications, markAsRead, unreadCount, refreshNotifications };
};
