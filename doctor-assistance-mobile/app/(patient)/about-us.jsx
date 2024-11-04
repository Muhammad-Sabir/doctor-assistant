import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import AuthHeaderImage from '@/components/shared/AuthHeaderImage';

const AboutUs = () => {

    const screenWidth = Dimensions.get('window').width;

    return (
        <View className="bg-white flex-1">

            <View className="border border-r-0 border-t-0 border-l-0 border-gray-300 flex-row justify-between items-center bg-white p-4 rounded-b z-1" style={{ height: screenWidth * 0.14, marginTop: screenWidth * 0.09 }}>
                <HeaderBackButton />
                <Text className="text-xl font-semibold text-primary flex-1 text-center">About App</Text>
            </View>

            <View className="px-5 mt-11">
                <AuthHeaderImage />
                <Text className="text-primary text-xl font-bold text-center mb-3">Empowering Patients and Doctors</Text>
                <Text className="text-gray-500 text-base leading-relaxed text-center">
                    This app is designed for patients to easily find doctors, book consultations, and manage their healthcare information.
                    Moreover, Our platform empowers patients and doctors with advanced features that enhance
                    communication and streamline the healthcare experience. By simplifying the process,
                    we foster meaningful interactions between patients and doctors.
                </Text>
                <Text className="text-gray-500 text-base leading-relaxed text-center mt-4">
                    Patients and Doctors can also visit our website to log in and continue managing their healthcare journey seamlessly.
                </Text>
                <View className="border-t border-gray-200" style={{margin:40}} />
            </View>

        </View>
    );
};

export default AboutUs;
