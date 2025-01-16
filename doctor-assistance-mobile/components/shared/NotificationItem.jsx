import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { getNotificationData } from '@/components/shared/NotificationData';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { useAuth } from '@/contexts/AuthContext';
import { formatRelativeTime } from '@/utils/date';

export const NotificationItem = ({ notification, onMarkAsRead }) => {

    const router = useRouter();
    const { fetchWithUserAuth } = useAuth();

    const { icon, url } = getNotificationData(notification?.notification_type);

    const updateNotificationMutation = useCreateUpdateMutation({
        url: `notifications/${notification.id}/`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithUserAuth,
        onSuccessMessage: 'Notification Marked as Read',
        onErrorMessage: 'Failed to mark notification as read',
    });

    const handleClick = () => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }
        router.push(`(patient)/${url}`);
    };

    const markAsRead = (id) => {
        onMarkAsRead(id);
        updateNotificationMutation.mutate(JSON.stringify({ is_read: true }));
    };

    return (
        <TouchableOpacity className={`flex-row items-center p-3 bg-white rounded-md mb-3 ${!notification.is_read ? 'bg-blue-100' : 'bg-white'}`}
            onPress={handleClick}
        >
            <View className={`w-10 h-10 p-2 mr-3 ${notification.is_read ? 'bg-gray-200' : 'bg-white'} rounded-full`}>
                {icon}
            </View>
            <View className="flex-1">
                <Text className="text-md font-semibold text-gray-700">{notification.message}</Text>
                <Text className="text-sm mt-1 text-gray-500">{formatRelativeTime(notification?.created_at)} </Text>
            </View>
            {!notification.is_read && (
                <View className="w-2 h-2 bg-blue-500 rounded-full ml-3" />
            )}
        </TouchableOpacity>
    );
};
