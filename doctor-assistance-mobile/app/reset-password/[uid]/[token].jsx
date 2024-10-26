import React, { useState } from 'react';
import { View, Text, TextInput, Pressable} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { useAuth } from '@/contexts/AuthContext';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import AuthHeaderImage from '@/components/shared/AuthHeaderImage';

const ResetPassword = () => {

    const { uid, token } = useLocalSearchParams();

    const { resetPassword } = useAuth();
    const { mutate: reset } = resetPassword({ uid, token });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [inputErrors, setInputErrors] = useState({});
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });

    const handleChange = (id, value) => {
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
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
        
        reset(JSON.stringify({ password: formData.password}));
    };

    return (
        <CustomKeyboardView>
            <View className="flex-1 px-5 bg-white justify-center">
                <AuthHeaderImage/>

                <View className="gap-3">
                    <Text className="text-2xl font-bold text-primary">Reset Your Password</Text>
                    <Text className="text-balance text-gray-500 -mt-2">Enter your new password and confirm it below.</Text>

                    <View className="gap-4 mt-4">
                        <View className="gap-3">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-black">Password</Text>
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
                                    <View className="flex flex-row items-center text-red-500 text-sm mt-1">
                                        <MaterialIcons name="error-outline" size={13} color="red" className='mr-2' />
                                        <Text className='text-sm text-red-500'>{inputErrors.password} </Text>
                                    </View>
                                )}
                                <Pressable
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                    className="absolute right-2 top-2"
                                >
                                    <Feather name={passwordVisible ? "eye-off" : "eye"} size={15} color="gray" className='mr-2 mt-2' />
                                </Pressable>
                            </View>
                        </View>

                        <View className="gap-3">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-black">Confirm Password</Text>
                            </View>
                            <View className="relative">
                                <TextInput
                                    className={`w-full py-2 px-4 rounded-md border ${inputErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Confirm your password"
                                    secureTextEntry={!passwordVisible}
                                    value={formData.confirmPassword}
                                    onChangeText={(value) => handleChange("confirmPassword", value)}
                                    onBlur={() => handleBlur("confirmPassword", formData.confirmPassword)}
                                />
                                {inputErrors.confirmPassword && (
                                    <View className="flex flex-row items-center text-red-500 text-sm mt-1">
                                        <MaterialIcons name="error-outline" size={13} color="red" className='mr-2' />
                                        <Text className='text-sm text-red-500'>{inputErrors.confirmPassword} </Text>
                                    </View>
                                )}
                                <Pressable
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                    className="absolute right-2 top-2"
                                >
                                    <Feather name={passwordVisible ? "eye-off" : "eye"} size={15} color="gray" className='mr-2 mt-2' />
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
                </View>
            </View>
        </CustomKeyboardView>
    );
};

export default ResetPassword;
