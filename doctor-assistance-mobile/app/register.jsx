import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { Eye, EyeOff, TriangleAlert } from 'lucide-react-native';

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

    const {email} = userDetails;
    const { mutate: signup } = signupMutation({ email });

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
        signup(JSON.stringify({ email, password, phone_number: phoneNo, role: 'patient' }));
    };

    useFocusEffect(
        useCallback(() => {
            setInputErrors({});
            setUserDetails({ email: "", password: "", phoneNo: "" });
        }, [])
    );

    return (
        <CustomKeyboardView>
            <View className="justify-center flex-1 px-5 bg-white">
                <AuthHeaderImage />

                <View className="gap-3">
                    <Text className="text-2xl font-bold text-primary">Signup</Text>
                    <Text className="-mt-2 text-gray-500 text-balance">Enter your information to create an account</Text>

                    <View className="gap-4 mt-4">
                        <View className="gap-2">
                            <Text className="text-gray-700">Email</Text>
                            <TextInput
                                className={`w-full py-2 px-4 rounded-md border ${inputErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your Email"
                                value={userDetails.email}
                                onChangeText={(value) => handleChange("email", value)}
                                onBlur={() => handleBlur("email", userDetails.email)}
                            />
                            {inputErrors.email && (
                                <View className="flex flex-row items-center gap-2 text-sm text-red-500">
                                    <TriangleAlert size={13} color="red" />
                                    <Text className='text-sm text-red-500'>{inputErrors.email} </Text>
                                </View>
                            )}
                        </View>

                        <View className="gap-2">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-gray-700">Password</Text>
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
                                    <View className="flex flex-row items-center gap-2 mt-2 text-sm text-red-500">
                                        <TriangleAlert size={13} color="red" />
                                        <Text className='text-sm text-red-500'>{inputErrors.password} </Text>
                                    </View>
                                )}
                                <Pressable onPress={() => setPasswordVisible(!passwordVisible)} className="absolute mt-2 mr-2 right-2 top-2">
                                    {passwordVisible ? (
                                        <EyeOff size={17} color="gray" />
                                    ) : (
                                        <Eye size={17} color="gray" />
                                    )}
                                </Pressable>
                            </View>
                        </View>

                        <View className="gap-2">
                            <Text className="text-gray-700">Phone No</Text>
                            <TextInput
                                className={`w-full py-2 px-4 rounded-md border ${inputErrors.phoneNo ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your Phone No"
                                value={userDetails.phoneNo}
                                onChangeText={(value) => handleChange("phoneNo", value)}
                                onBlur={() => handleBlur("phoneNo", userDetails.phoneNo)}
                            />
                            {inputErrors.phoneNo && (
                                <View className="flex flex-row items-center gap-2 text-sm text-red-500">
                                    <TriangleAlert size={13} color="red" />
                                    <Text className='text-sm text-red-500'>{inputErrors.phoneNo} </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <Pressable
                        className="items-center justify-center w-full p-3 border border-gray-300 rounded-md mt-7 bg-primary h-14"
                        onPress={handleSignup}
                    >
                        <Text className="font-bold text-white">SignUp</Text>
                    </Pressable>
                </View>

                {/* <View className="gap-0.5">
                    <View className="flex-row items-center justify-center my-5">
                        <View className="flex-1 h-px bg-gray-500"></View>
                        <Text className="px-3 text-xs font-semibold text-gray-500">OR</Text>
                        <View className="flex-1 h-px bg-gray-500"></View>
                    </View>
                    <Pressable className="flex flex-row items-center justify-center w-full p-3 border border-gray-300 rounded-md h-14">
                        <GoogleLogo className="w-6 h-6" />
                        <Text className="ml-4">Signup with Google</Text>
                    </Pressable>
                </View> */}

                <View className="flex-row items-center justify-center gap-2 mt-8 mb-8">
                    <Text className="text-center text-gray-500">Already have an account?</Text>
                    <Link className='text-center text-[#045883] font-semibold ' href='/login'>Login</Link>
                </View>
            </View>
        </CustomKeyboardView>
    );
};

export default Register;
