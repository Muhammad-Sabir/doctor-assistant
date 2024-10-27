import React, { useState } from 'react';
import { View, Text, TextInput, Pressable} from 'react-native';
import { Link } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import GoogleLogo from '@/assets/images/SVG/GoogleLogo';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { useAuth } from '@/contexts/AuthContext';
import AuthHeaderImage from '@/components/shared/AuthHeaderImage';

const Login = () => {

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [inputErrors, setInputErrors] = useState({});
    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    const { loginMutation } = useAuth();
    const {username} = user;
    const { mutate: login } = loginMutation({ username });

    const handleChange = (id, value) => {
        setUser(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleBlur = (id, value) => {
        const errors = validateField(id, value, inputErrors);
        setInputErrors(errors);
    };

    const handleLoginIn = (e) => {
        e.preventDefault();
        if (!hasNoFieldErrors(inputErrors)) {
            return;
        }
        login(JSON.stringify({...user, role: 'patient'}))
    };

    return (
        <CustomKeyboardView>
            <View className="flex-1 px-5 bg-white justify-center">
                <AuthHeaderImage/>

                <View className="gap-3">
                    <Text className="text-2xl font-bold text-primary">Login</Text>
                    <Text className="text-balance text-gray-500 -mt-2">Enter your credentials to login</Text>

                    <View className="gap-4 mt-4">
                        <View className="gap-3">
                            <Text className="text-black">Username</Text>
                            <TextInput
                                className={`w-full py-2 px-4 rounded-md border ${inputErrors.username ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your Email or Phone No"
                                value={user.username}
                                onChangeText={(value) => handleChange("username", value)}
                                onBlur={() => handleBlur("username", user.username)}
                            />
                            {inputErrors.username && (
                                <View className="flex flex-row items-center text-red-500 text-sm -mt-2">
                                    <MaterialIcons name="error-outline" size={13} color="red" className='mr-2' />
                                    <Text className='text-sm text-red-500'>{inputErrors.username} </Text>
                                </View>
                            )}
                        </View>

                        <View className="gap-3">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-black">Password</Text>
                                <Link className="text-sm text-gray-500" href='/forget-password'>Forgot Password?</Link>
                            </View>
                            <View className="relative">
                                <TextInput
                                    className={`w-full py-2 px-4 rounded-md border ${inputErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter your password"
                                    secureTextEntry={!passwordVisible}
                                    value={user.password}
                                    onChangeText={(value) => handleChange("password", value)}
                                    onBlur={() => handleBlur("password", user.password)}
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
                    </View>

                    <Pressable
                        className="mt-7 w-full bg-primary border border-gray-300 justify-center items-center h-14 rounded-md p-3"
                        onPress={handleLoginIn}
                    >
                        <Text className="text-white font-bold">Login</Text>
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
                        <Text className="ml-4">Login with Google</Text>
                    </Pressable>
                </View>

                <View className="mt-8 mb-8 flex-row justify-center items-center gap-2">
                    <Text className="text-center text-gray-500">Don't have an account?</Text>
                    <Link className='text-center text-[#045883] font-semibold' href='/register'>Sign Up</Link>
                </View>
            </View>
        </CustomKeyboardView>
    );
};

export default Login;
