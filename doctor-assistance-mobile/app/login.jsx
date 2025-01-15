import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { Eye, EyeOff, TriangleAlert } from 'lucide-react-native';

import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { useAuth } from '@/contexts/AuthContext';
import AuthHeaderImage from '@/components/shared/AuthHeaderImage';

const Login = () => {

    const router = useRouter();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [inputErrors, setInputErrors] = useState({});
    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    const { loginMutation } = useAuth();
    const { username } = user;
    const { mutate: login } = loginMutation({ username });

    const handleChange = (id, value) => {
        setUser(prev => ({ ...prev, [id]: value }));
    };

    const handleBlur = (id, value) => {
        const errors = validateField(id, value, inputErrors);
        setInputErrors(errors);
    };

    const handleForgetPassword = ()=> {
        router.push('/forget-password');
    }

    const handleLoginIn = (e) => {
        e.preventDefault();
        if (!hasNoFieldErrors(inputErrors)) {
            return;
        }
        
        login(JSON.stringify({ ...user, role: 'patient' }))
    };

    useFocusEffect(
        useCallback(() => {
            setInputErrors({});
            setUser({ username: "", password: "" });
        }, [])
    );

    return (
        <CustomKeyboardView>
            <View className="justify-center flex-1 px-5 bg-white">
                <AuthHeaderImage />

                <View className="gap-3">
                    <Text className="text-2xl font-bold text-primary">Login</Text>
                    <Text className="-mt-2 text-gray-500 text-balance">Enter your credentials to login</Text>

                    <View className="gap-4 mt-4">
                        <View className="gap-2">
                            <Text className="text-gray-700">Username</Text>
                            <TextInput
                                className={`w-full py-2 px-4 rounded-md border ${inputErrors.username ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your Email or Phone No"
                                value={user.username}
                                onChangeText={(value) => handleChange("username", value)}
                                onBlur={() => handleBlur("username", user.username)}
                            />
                            {inputErrors.username && (
                                <View className="flex flex-row items-center gap-2 text-sm text-red-500">
                                    <TriangleAlert size={13} color="red" />
                                    <Text className='text-sm text-red-500'>{inputErrors.username} </Text>
                                </View>
                            )}
                        </View>

                        <View className="gap-2">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-gray-700">Password</Text>
                                <Text className="text-sm text-gray-500" onPress={handleForgetPassword}>Forgot Password?</Text>
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
                                    <View className="flex flex-row items-center gap-2 mt-2 text-sm text-red-500">
                                        <TriangleAlert size={13} color="red" />
                                        <Text className='text-sm text-red-500'>{inputErrors.password} </Text>
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
                    </View>

                    <Pressable
                        className="items-center justify-center w-full p-3 border border-gray-300 rounded-md mt-7 bg-primary h-14"
                        onPress={handleLoginIn}
                    >
                        <Text className="font-bold text-white">Login</Text>
                    </Pressable>
                </View>

                <View className="flex-row items-center justify-center gap-2 mt-8 mb-8">
                    <Text className="text-center text-gray-500">Don't have an account?</Text>
                    <Link className='text-center text-[#045883] font-semibold' href='/register'>Sign Up</Link>
                </View>
            </View>
        </CustomKeyboardView>
    );
};

export default Login;
