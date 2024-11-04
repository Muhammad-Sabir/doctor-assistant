import React from 'react';
import { View, Text, Dimensions } from 'react-native';

import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';

const Notifications = () => {

  const screenWidth = Dimensions.get('window').width;

  return (
    <>
      <View className="border border-r-0 border-t-0 border-l-0 border-gray-300 flex-row justify-between items-center bg-white p-4 rounded-b z-1" style={{ height: screenWidth * 0.14, marginTop: screenWidth * 0.09 }}>
        <HeaderBackButton />
        <Text className="text-xl font-semibold text-primary flex-1 text-center">My Notificationss</Text>
      </View>
      <CustomKeyboardView>
        <View className='bg-white flex-1 px-5 py-5'>
          <Text>This is Notifications page</Text>
        </View>
      </CustomKeyboardView>
    </>
  );
};

export default Notifications;
