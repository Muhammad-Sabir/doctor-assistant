import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TriangleAlert } from 'lucide-react-native';
import { Link } from 'expo-router';

import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { useAuth } from '@/contexts/AuthContext';
import AuthHeaderImage from '@/components/shared/AuthHeaderImage';

const VerifyEmail = () => {

    const { sendOTPVerification, verifyOTP } = useAuth();

    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [inputErrors, setInputErrors] = useState({});

    const handleOtpChange = (value) => {
        setOtp(value);
    };

    const handleBlur = (id, value) => {
        const errors = validateField(id, value, inputErrors);
        setInputErrors(errors);
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();

        if (!hasNoFieldErrors(inputErrors)) {
            return;
        }

        verifyOTP.mutate(JSON.stringify({ email, otp_code: otp }));
    };

    const handleResendOtp = async () => {
        sendOTPVerification.mutate(JSON.stringify({ email }));
    };

    useEffect(() => {
        const fetchEmail = async () => {
            const storedEmail = await AsyncStorage.getItem('userEmail');
            if (storedEmail) {
                setEmail(storedEmail);
            }
        };
        fetchEmail();
    }, []);

    return (
        <CustomKeyboardView>
            <View className="flex-1 px-5 bg-white justify-center">
                <AuthHeaderImage />

                <View className="gap-3">
                    <Text className="text-2xl font-bold text-primary">Enter Verification Code</Text>
                    <Text className="text-gray-500 -mt-2">
                        We have sent an OTP code to your email: {'\n'}{email}
                    </Text>

                    <View className="gap-4 mt-4">
                        <View className="gap-2">
                            <Text className="text-gray-700">Enter OTP Code</Text>
                            <TextInput
                                className={`w-full py-2 px-4 rounded-md border ${inputErrors.otp ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter OTP Code"
                                value={otp}
                                onChangeText={(value) => handleOtpChange(value)}
                                onBlur={() => handleBlur("otp", otp)}
                            />
                            {inputErrors.otp && (
                                <View className="flex flex-row items-center text-red-500 text-sm gap-2">
                                    <TriangleAlert size={13} color="red" />
                                    <Text className="text-sm text-red-500">{inputErrors.otp}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <Pressable
                        className="mt-5 w-full bg-primary border border-gray-300 justify-center items-center h-14 rounded-md p-3"
                        onPress={handleOtpSubmit}
                    >
                        <Text className="text-white font-bold">Verify OTP</Text>
                    </Pressable>

                    <Pressable
                        className="mt-3 w-full border border-gray-300 justify-center items-center h-14 rounded-md p-3"
                        onPress={handleResendOtp}
                    >
                        <Text className="text-primary font-bold">Resend OTP</Text>
                    </Pressable>

                    <View className="mt-6 mb-8 flex-row justify-center items-center gap-2">
                        <Text className="text-center text-gray-500">Want to Go Back to Login?</Text>
                        <Link className="text-center text-[#045883] font-semibold" href="/login">Login</Link>
                    </View>
                </View>
            </View>
        </CustomKeyboardView>
    );
};

export default VerifyEmail;
