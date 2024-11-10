import React from 'react';
import { View, Text, ScrollView } from 'react-native';

import DoctorSearchBar from '@/components/dashboard/DoctorSearchBar';
import TopDoctors from '@/components/dashboard/TopDoctors';
import Banner from '@/components/dashboard/Banner';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';

export default function DoctorsList() {

  return (
    <CustomKeyboardView>
      <View className="flex-1 px-5 py-5 bg-white">
        <DoctorSearchBar />

        <Banner imageSource={require('@/assets/images/banner2.webp')} />

        <View>
          <View className="flex flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-primary"> Top Medical Specialists </Text>
          </View>
          <ScrollView>
            <TopDoctors />
          </ScrollView>
        </View>

      </View>
    </CustomKeyboardView>
  );
}
