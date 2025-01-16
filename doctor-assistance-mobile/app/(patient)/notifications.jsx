import React, { useCallback } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import { NotificationItem } from '@/components/shared/NotificationItem';
import { useNotifications } from '@/hooks/useNotifications';

const Notifications = () => {

  const screenWidth = Dimensions.get('window').width;
  const { notifications, markAsRead, unreadCount, refreshNotifications } = useNotifications();

  useFocusEffect(
    useCallback(() => {
      refreshNotifications();
    }, [refreshNotifications])
  );

  return (
    <>
      <View className="border-b border-gray-300 flex-row justify-between items-center bg-white p-4 rounded-b z-1" style={{ height: screenWidth * 0.14, marginTop: screenWidth * 0.09 }}>
        <HeaderBackButton />
        <Text className="text-xl font-semibold text-primary flex-1 text-center">My Notifications {unreadCount > 0 && `(${unreadCount})`}</Text>
      </View>

      <CustomKeyboardView>
        <View className='bg-white flex-1 px-5 py-5'>
          <Text className={`text-gray-700 mb-4 ${notifications.length > 0 ? '': 'text-center'}`}> You have {notifications.length > 0 ? `total of ${notifications.length}` : 'no'} Notifications</Text>
          <ScrollView className="flex-1 bg-white">
            {notifications.map((item) => (
              <NotificationItem key={item.id} notification={item} onMarkAsRead={markAsRead} />
            ))}
          </ScrollView>
        </View>
      </CustomKeyboardView>
    </>
  );
};

export default Notifications;
