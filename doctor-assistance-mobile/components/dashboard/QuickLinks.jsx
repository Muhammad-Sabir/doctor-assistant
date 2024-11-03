import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

const QuickLinks = () => {

    const router = useRouter();

    return (
        <View className="flex-row flex-wrap">
            <TouchableOpacity
                onPress={() => router.push('(patient)/(tabs)/doctors')}
                className='flex-row gap-4 rounded-md p-4 items-center justify-center mb-4'
                style={{ backgroundColor: '#ede9ef', width: '100%', height: 140, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 }}
            >
                <Image source={require('@/assets/images/heroImg3.webp')} style={{ width: 120, height: 120, borderRadius: 20 }} />
                <View className='flex-1'>
                    <Text className='text-primary text-md font-bold mb-2'>Find top doctors and book appointments instantly</Text>
                    <Text className='text-gray-700 text-sm'>Need to find a doctor? Click to explore {'\n'}your options!</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push('(patient)/appointments')}
                className='flex-row gap-4 rounded-md p-4 items-center justify-center mr-4'
                style={{ backgroundColor: '#f7e2e5', width: '48%', height: 120, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 }}
            >
                <View className='flex-1'>
                    <Text className='text-md font-bold mb-2' style={{ color: '#832d4a' }}>Keep track of your appointments</Text>
                    <Text className='text-gray-700 text-sm'>Click to check your latest and past appointments</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push('(patient)/(tabs)/profile')}
                className='flex-row gap-4 rounded-md p-4 items-center justify-center'
                style={{ backgroundColor: '#E0F7FA', width: '48%', height: 120, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 }}
            >
                <View className='flex-1'>
                    <Text className='text-md font-bold mb-2' style={{ color: '#00796B' }}>Manage the health of your loved ones too</Text>
                    <Text className='text-gray-700 text-sm'>Manage dependents & book appointments in one profile.</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default QuickLinks;
