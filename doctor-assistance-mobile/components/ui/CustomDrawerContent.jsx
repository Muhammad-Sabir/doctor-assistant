import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import userIcon from '@/assets/images/user.png';
import { useAuth } from '@/contexts/AuthContext';
import { useFetchQuery } from '@/hooks/useFetchQuery';

const CustomDrawerContent = (props) => {

  const { logout, fetchWithUserAuth, user } = useAuth();

  const { data } = useFetchQuery({
    url: 'patients/',
    queryKey: ['patientProfile'],
    fetchFunction: fetchWithUserAuth,
  });

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, backgroundColor: 'hsl(214, 95%, 96%)' }}>
      <View className="items-center">
        <Image source={userIcon} style={{ height: 100, width: 100 }} className="rounded-full mb-4 mt-8" />
        <Text className="text-lg text-primary font-bold">{data ? data.results[0].name : "Loading..."}</Text>
        <Text className="text-sm text-gray-500 mb-8">{user.username}</Text>
      </View>

      <View className="bg-white mt-4 py-3 px-1 flex-1">
        <DrawerItemList {...props} />
      </View>

      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity className="bg-primary p-3 rounded-md items-center" onPress={logout}>
          <Text className="text-white font-bold">Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
