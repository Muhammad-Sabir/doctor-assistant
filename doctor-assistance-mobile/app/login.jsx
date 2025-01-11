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
            <View className="flex-1 px-5 bg-white justify-center">
                <AuthHeaderImage />

                <View className="gap-3">
                    <Text className="text-2xl font-bold text-primary">Login</Text>
                    <Text className="text-balance text-gray-500 -mt-2">Enter your credentials to login</Text>

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
                                <View className="flex flex-row items-center text-red-500 text-sm gap-2">
                                    <TriangleAlert size={13} color="red" />
                                    <Text className='text-sm text-red-500'>{inputErrors.username} </Text>
                                </View>
                            )}
                        </View>

                        <View className="gap-2">
                            <View className="flex-row justify-between items-center">
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
                                    <View className="flex flex-row items-center text-red-500 text-sm mt-2 gap-2">
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
                        className="mt-7 w-full bg-primary border border-gray-300 justify-center items-center h-14 rounded-md p-3"
                        onPress={handleLoginIn}
                    >
                        <Text className="text-white font-bold">Login</Text>
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
