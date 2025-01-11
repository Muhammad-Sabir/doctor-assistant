import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Eye, EyeOff, TriangleAlert } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';

import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { useAuth } from '@/contexts/AuthContext';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import AuthHeaderImage from '@/components/shared/AuthHeaderImage';

const ResetPassword = () => {

    const { resetPassword } = useAuth();

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const [email, setEmail] = useState('');
    const [inputErrors, setInputErrors] = useState({});
    const [formData, setFormData] = useState({
        otp: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (id, value) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleBlur = (id, value) => {
        const errors = validateField(id, value, inputErrors, formData.password);
        setInputErrors(errors);
    };

    const handleSubmit = (e) => {

        e.preventDefault();
        if (!hasNoFieldErrors(inputErrors)) {
            return;
        }

        const { otp, password } = formData;
        resetPassword.mutate(JSON.stringify({ email, otp_code: otp, password }));
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
                    <Text className="text-2xl font-bold text-primary">Reset Your Password</Text>
                    <Text className="text-balance text-gray-500 -mt-2">Enter the OTP sent to your email {'\n'}along with your new password and confirm it below.</Text>

                    <View className="gap-4 mt-4">
                        <View className="gap-2">
                            <Text className="text-gray-700">Enter OTP Code</Text>
                            <TextInput
                                className={`w-full py-2 px-4 rounded-md border ${inputErrors.otp ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter OTP Code"
                                value={formData.otp}
                                onChangeText={(value) => handleChange("otp", value)}
                                onBlur={() => handleBlur("otp", formData.otp)}
                            />
                            {inputErrors.otp && (
                                <View className="flex flex-row items-center text-red-500 text-sm gap-2 mt-1">
                                    <TriangleAlert size={13} color="red" />
                                    <Text className="text-sm text-red-500">{inputErrors.otp}</Text>
                                </View>
                            )}
                        </View>
                        <View className="gap-2">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-gray-700">Password</Text>
                            </View>
                            <View className="relative">
                                <TextInput
                                    className={`w-full py-2 px-4 rounded-md border ${inputErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter your password"
                                    secureTextEntry={!passwordVisible}
                                    value={formData.password}
                                    onChangeText={(value) => handleChange("password", value)}
                                    onBlur={() => handleBlur("password", formData.password)}
                                />
                                {inputErrors.password && (
                                    <View className="flex flex-row items-center text-red-500 text-sm gap-2 mt-2.5">
                                        <TriangleAlert size={13} color="red" />
                                        <Text className="text-sm text-red-500">{inputErrors.password}</Text>
                                    </View>
                                )}
                                <Pressable onPress={() => setPasswordVisible((prev => !prev))} className="mt-2 mr-2 absolute right-2 top-2">
                                    {passwordVisible ? (
                                        <EyeOff size={17} color="gray" />
                                    ) : (
                                        <Eye size={17} color="gray" />
                                    )}
                                </Pressable>
                            </View>
                        </View>

                        <View className="gap-3">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-gray-700">Confirm Password</Text>
                            </View>
                            <View className="relative">
                                <TextInput
                                    className={`w-full py-2 px-4 rounded-md border ${inputErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Confirm your password"
                                    secureTextEntry={!confirmPasswordVisible}
                                    value={formData.confirmPassword}
                                    onChangeText={(value) => handleChange("confirmPassword", value)}
                                    onBlur={() => handleBlur("confirmPassword", formData.confirmPassword)}
                                />
                                {inputErrors.confirmPassword && (
                                    <View className="flex flex-row items-center text-red-500 text-sm gap-2 mt-2.5">
                                        <TriangleAlert size={13} color="red" />
                                        <Text className="text-sm text-red-500">{inputErrors.confirmPassword}</Text>
                                    </View>
                                )}
                                <Pressable onPress={() => setConfirmPasswordVisible((prev => !prev))} className="mt-2 mr-2 absolute right-2 top-2">
                                    {confirmPasswordVisible ? (
                                        <EyeOff size={17} color="gray" />
                                    ) : (
                                        <Eye size={17} color="gray" />
                                    )}
                                </Pressable>
                            </View>
                        </View>

                    </View>

                    <Pressable
                        className="mt-7 w-full bg-primary border border-gray-300 justify-center items-center h-14 rounded-md p-3"
                        onPress={handleSubmit}
                    >
                        <Text className="text-white font-bold">Submit</Text>
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

export default ResetPassword;