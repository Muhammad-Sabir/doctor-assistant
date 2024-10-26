import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { useAuth } from '@/contexts/AuthContext';
import AuthHeaderImage from '@/components/shared/AuthHeaderImage';

const VerifyEmail = () => {

    const { sendVerificationEmail } = useAuth();

    const [inputErrors, setInputErrors] = useState({});
    const [email, setEmail] = useState('');

    const handleChange = (value) => {
        setEmail(value);
        const errors = validateField('email', value, inputErrors);
        setInputErrors(errors);
    };

    const handleBlur = (value) => {
        const errors = validateField('email', value, inputErrors);
        setInputErrors(errors);
    };

    const handleSubmit =  async (e) => {
        e.preventDefault();
        if (!hasNoFieldErrors(inputErrors)) {
            return;
        }
        sendVerificationEmail.mutate(JSON.stringify({ email }));
        await AsyncStorage.removeItem('userEmail');
        console.log(email);
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
                <AuthHeaderImage/>

                <View className="gap-3">
                    <Text className="text-2xl font-bold text-primary">Verify Your Email</Text>
                    <Text className="text-balance text-gray-500 -mt-2">{email ? "We have sent a verification link to:" : "Please enter your email address to \nreceive a verification link:"}</Text>

                    <View className="gap-4 mt-4">
                        <View className="gap-3">
                            <Text className="text-black">Email</Text>
                            <TextInput
                                className={`w-full py-2 px-4 rounded-md border ${inputErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your Email"
                                value={email}
                                onChangeText={(value) => handleChange(value)}
                                onBlur={() => handleBlur(email)}
                            />
                            {inputErrors.email && (
                                <View className="flex flex-row items-center text-red-500 text-sm -mt-2">
                                    <MaterialIcons name="error-outline" size={13} color="red" className='mr-2' />
                                    <Text className='text-sm text-red-500'>{inputErrors.email} </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <Pressable
                        className="mt-7 w-full bg-primary border border-gray-300 justify-center items-center h-14 rounded-md p-3"
                        onPress={handleSubmit}
                    >
                        <Text className="text-white font-bold">Resend Verification Email</Text>
                    </Pressable>

                </View>
            </View>
        </CustomKeyboardView>
    );
};

export default VerifyEmail;
