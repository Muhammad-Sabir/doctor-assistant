import React, { useEffect } from 'react';
import { View, Text, Alert, BackHandler, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';
import HospitalSearchBar from '@/components/dashboard/HospitalSearchBar';
import Banner from '@/components/dashboard/Banner';
import SpecialityList from '@/components/dashboard/SpecialityList';
import QuickLinks from '@/components/dashboard/QuickLinks';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import FAQSection from '@/components/dashboard/FaqSection';

const Home = () => {

    const { user, fetchWithUserAuth } = useAuth();

    const { data } = useFetchQuery({
        url: 'patients/',
        queryKey: ['patientProfile'],
        fetchFunction: fetchWithUserAuth,
    });

    const handleBackPress = () => {
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
            { text: 'Cancel', onPress: () => null, style: 'cancel' },
            { text: 'Exit', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
    };

    useEffect(() => {
        if (user) {
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                handleBackPress
            );
            return () => backHandler.remove();
        }
    }, [user]);

    const router = useRouter();

    const handleFAQClick = () => {
        router.push('/(patient)/faqs');
    };

    return (
        <CustomKeyboardView>
            <View className="flex-1 px-5 py-5 bg-white">

                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <View className="ml-1 rounded-full flex items-center justify-center"
                            style={{ height: 30, width: 30, backgroundColor: 'hsl(203, 87%, 30%)' }}>
                            <Text className="text-white font-bold">
                                {data && data.results[0].name ? data.results[0].name.charAt(0) : "L"}
                            </Text>
                        </View>
                        <View className="ml-4 flex-row">
                            <Text className="text-gray-700 text-md mr-2">Welcome,</Text>
                            <Text className="text-md font-bold text-primary">{data ? data.results[0].name : "Loading..."}</Text>
                        </View>
                    </View>
                </View>

                <HospitalSearchBar />

                <Banner imageSource={require('@/assets/images/banner.webp')} />

                <View>
                    <View className="flex flex-row justify-between items-center mb-3">
                        <Text className="text-lg font-semibold text-primary">Our Top Specialities</Text>
                    </View>
                    <SpecialityList />
                </View>

                <View>
                    <View className="flex flex-row justify-between items-center my-3">
                        <Text className="text-lg font-semibold text-primary">Quick Links</Text>
                    </View>
                    <QuickLinks />
                </View>

                <View>
                    <View className="flex flex-row justify-between items-center mt-5">
                        <Text className="text-lg mb-1 font-semibold text-primary">Frequently Asked Questions</Text>
                        <TouchableOpacity onPress={handleFAQClick}>
                            <Text className="text-[#045883] text-md">See All</Text>
                        </TouchableOpacity>
                    </View>
                    <FAQSection />
                </View>

            </View >
        </CustomKeyboardView>
    );
};

export default Home;
