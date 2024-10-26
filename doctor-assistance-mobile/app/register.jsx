import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GoogleLogo from '@/assets/images/SVG/GoogleLogo';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { useAuth } from '@/contexts/AuthContext';
import AuthHeaderImage from '@/components/shared/AuthHeaderImage';

const Register = () => {

    const { signupMutation } = useAuth();

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [inputErrors, setInputErrors] = useState({});
    const [userDetails, setUserDetails] = useState({
        email: "",
        password: "",
        phoneNo: "",
    });

    const handleChange = (id, value) => {
        setUserDetails(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleBlur = (id, value) => {
        const errors = validateField(id, value, inputErrors);
        setInputErrors(errors);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
    
        if (!hasNoFieldErrors(inputErrors)) {
            return;
        }

        const { email, password, phoneNo } = userDetails;
        console.log(userDetails)
        await AsyncStorage.setItem('userEmail', email);
        signupMutation.mutate( JSON.stringify({email, password, phone_number: phoneNo, role: 'patient'}));
    };

    return (
        <CustomKeyboardView>
            <View className="flex-1 px-5 bg-white justify-center">
                <AuthHeaderImage/>

                <View className="gap-3">
                    <Text className="text-2xl font-bold text-primary">Signup</Text>
                    <Text className="text-balance text-gray-500 -mt-2">Enter your information to create an account</Text>

                    <View className="gap-4 mt-4">
                        <View className="gap-3">
                            <Text className="text-black">Email</Text>
                            <TextInput
                                className={`w-full py-2 px-4 rounded-md border ${inputErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your Email"
                                value={userDetails.email}
                                onChangeText={(value) => handleChange("email", value)}
                                onBlur={() => handleBlur("email", userDetails.email)}
                            />
                            {inputErrors.email && (
                                <View className="flex flex-row items-center text-red-500 text-sm -mt-2">
                                    <MaterialIcons name="error-outline" size={13} color="red" className='mr-2' />
                                    <Text className='text-sm text-red-500'>{inputErrors.email} </Text>
                                </View>
                            )}
                        </View>

                        <View className="gap-3">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-black">Password</Text>
                            </View>
                            <View className="relative">
                                <TextInput
                                    className={`w-full py-2 px-4 rounded-md border ${inputErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter your password"
                                    secureTextEntry={!passwordVisible}
                                    value={userDetails.password}
                                    onChangeText={(value) => handleChange("password", value)}
                                    onBlur={() => handleBlur("password", userDetails.password)}
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
                            <Text className="text-black">Phone No</Text>
                            <TextInput
                                className={`w-full py-2 px-4 rounded-md border ${inputErrors.phoneNo ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your Phone No"
                                value={userDetails.phoneNo}
                                onChangeText={(value) => handleChange("phoneNo", value)}
                                onBlur={() => handleBlur("phoneNo", userDetails.phoneNo)}
                            />
                            {inputErrors.phoneNo && (
                                <View className="flex flex-row items-center text-red-500 text-sm -mt-2">
                                    <MaterialIcons name="error-outline" size={13} color="red" className='mr-2' />
                                    <Text className='text-sm text-red-500'>{inputErrors.phoneNo} </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <Pressable
                        className="mt-7 w-full bg-primary border border-gray-300 justify-center items-center h-14 rounded-md p-3"
                        onPress={handleSignup}
                    >
                        <Text className="text-white font-bold">SignUp</Text>
                    </Pressable>
                </View>

                <View className="gap-0.5">
                    <View className="flex-row items-center justify-center my-5">
                        <View className="flex-1 h-px bg-gray-500"></View>
                        <Text className="px-3 text-xs text-gray-500 font-semibold">OR</Text>
                        <View className="flex-1 h-px bg-gray-500"></View>
                    </View>
                    <Pressable className="flex flex-row items-center justify-center w-full border border-gray-300 h-14 rounded-md p-3">
                        <GoogleLogo className="w-6 h-6" />
                        <Text className="ml-4">Signup with Google</Text>
                    </Pressable>
                </View>

                <View className="mt-8 mb-8 flex-row justify-center items-center gap-2">
                    <Text className="text-center text-gray-500">Already have an account?</Text>
                    <Link className='text-center text-[#045883] font-semibold ' href='/login'>Login</Link>
                </View>
            </View>
        </CustomKeyboardView>
    );
};

export default Register;
