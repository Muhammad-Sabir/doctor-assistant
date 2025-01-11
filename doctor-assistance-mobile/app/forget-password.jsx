import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { TriangleAlert } from 'lucide-react-native';
import { Link } from 'expo-router';

import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { useAuth } from '@/contexts/AuthContext';
import AuthHeaderImage from '@/components/shared/AuthHeaderImage';

const ForgetPassword = () => {

    const [email, setEmail] = useState('');
    const [inputErrors, setInputErrors] = useState({});

    const { sendResetPasswordOTP } = useAuth();
    const { mutate: sendOTP } = sendResetPasswordOTP({ email });

    const handleBlur = (id, value) => {
        const errors = validateField(id, value, inputErrors);
        setInputErrors(errors);
    };

    const handleSendOtp = async () => {
        if (!hasNoFieldErrors(inputErrors)) {
            return;
        }

        sendOTP(JSON.stringify({ email }));
    };

    return (
        <CustomKeyboardView>
            <View className="flex-1 px-5 bg-white justify-center">
                <AuthHeaderImage />

                <View className="gap-3">
                    <Text className="text-2xl font-bold text-primary">Forgot your Password?</Text>
                    <Text className="text-gray-500 -mt-2">
                        Please enter your email address below to receive a password reset OTP
                    </Text>

                    <View className="gap-4 mt-4">
                        <View className="gap-2">
                            <Text className="text-gray-700">Email</Text>
                            <TextInput
                                className={`w-full py-2 px-4 rounded-md border ${inputErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your Email"
                                value={email}
                                onChangeText={(value) => setEmail(value)}
                                onBlur={() => handleBlur("email", email)}
                            />
                            {inputErrors.email && (
                                <View className="flex flex-row items-center text-red-500 text-sm gap-2">
                                    <TriangleAlert size={13} color="red" />
                                    <Text className="text-sm text-red-500">{inputErrors.email}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <Pressable
                        className="mt-5 w-full bg-primary border border-gray-300 justify-center items-center h-14 rounded-md p-3"
                        onPress={handleSendOtp}
                    >
                        <Text className="text-white font-bold">Send OTP</Text>
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

export default ForgetPassword;
