import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Info, LogOut, UserRoundPen, Users, Siren, BadgeHelp, ChevronRight } from 'lucide-react-native';

import userIcon from '@/assets/images/user.png';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useAuth } from '@/contexts/AuthContext';
import banner from "@/assets/images/profileBanner.webp";
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import Loading from '@/components/shared/Loading';

export default function Profile() {
  const router = useRouter();
  const { fetchWithUserAuth, user, logout } = useAuth();

  const { data, isFetching, isError, error } = useFetchQuery({
    url: 'patients/',
    queryKey: ['patientProfile'],
    fetchFunction: fetchWithUserAuth,
  });

  const options = [
    { icon: <UserRoundPen size={20} color="gray" />, title: 'Edit Profile', screen: 'edit-profile' },
    { icon: <Users size={20} color="gray" />, title: 'Dependent Patients', screen: 'dependents' },
    { icon: <Siren size={20} color="gray" />, title: 'Allergies', screen: `allergies/${data?.results[0]?.id}` },
    { icon: <Bell size={20} color="gray" />, title: 'Notifications', screen: 'notifications' },
    { icon: <BadgeHelp size={20} color="gray" />, title: 'FAQ', screen: 'FAQ' },
    { icon: <Info size={20} color="gray" />, title: 'About App', screen: 'aboutApp' },
  ];

  const handleOptionPress = (screen) => {
    router.push(`(patient)/${screen}`);
  };

  return (
    <CustomKeyboardView>
      <View className="flex-1 bg-white mx-1">

        {isFetching && <Loading />}
        {isError && <Text className="text-red-500">Error: {error.message}</Text>}

        {!isFetching && !isError && (
          <>
            <View style={{ position: 'relative' }}>
              <Image source={banner} style={{ height: 200 }} />
            </View>

            <View className="flex-1 w-full max-w-7xl mx-auto px-5 -mt-20 bg-white rounded-lg">
              <View className="flex items-center justify-center mt-4">
                <Image
                  source={userIcon}
                  alt={data?.results[0]?.name}
                  resizeMode='contain'
                  style={{ position: 'absolute', top: -100, height: 150, width: 150, objectFit: 'cover', borderRadius: 100, backgroundColor: 'white' }}
                />
              </View>

              <View className="flex items-center justify-center gap-3 mb-5" style={{ marginTop: 70 }}>
                <View className="items-center">
                  <Text className="font-bold text-xl text-primary text-center">{data?.results[0]?.name}</Text>
                  <View className="flex flex-col lg:flex-row lg:gap-3 mt-2 items-center text-sm text-gray-500">
                    <View className="flex flex-row items-center gap-2">
                      <Text className='text-gray-500'>{user?.username}</Text>
                    </View>
                    <View className="flex flex-row items-center mt-2 gap-1">
                      <Text className="text-gray-500">Patient ID: {data?.results[0]?.id} </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="border-t border-gray-200 my-4" />

              <View className="flex flex-col items-center">
                {options.map((option, index) => (
                  <TouchableOpacity key={index} onPress={() => handleOptionPress(option.screen)}>
                    <View className="flex flex-row items-center justify-between w-full py-4 mx-2">
                      <View className="flex flex-row items-center">
                        {option.icon}
                        <Text className="text-md ml-2 text-gray-500">{option.title}</Text>
                      </View>
                      <ChevronRight size={20} color="gray" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <View className="border-t border-gray-200 my-4 mt-11" />

              <TouchableOpacity onPress={logout}>
                <View className="flex flex-row items-center justify-between w-full py-4">
                  <View className="flex flex-row items-center">
                    <LogOut size={20} color="#045883" />
                    <Text className="text-md ml-2 text-[#045883]">Logout</Text>
                  </View>
                </View>
              </TouchableOpacity>

            </View>
          </>
        )}
      </View>
    </CustomKeyboardView>
  );
}
