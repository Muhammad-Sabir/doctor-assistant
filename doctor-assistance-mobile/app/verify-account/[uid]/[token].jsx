import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import { useAuth } from '@/contexts/AuthContext';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import AuthHeaderImage from '@/components/shared/AuthHeaderImage';

export default function VerifyAccount() {

    const { uid, token } = useLocalSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState('loading');

    const { verifyAccount } = useAuth();
    const { mutate: verifyEmail, isSuccess, isError } = verifyAccount({ uid, token });

    useEffect(() => {
        verifyEmail();
    }, [uid, token, verifyAccount]);

    useEffect(() => {
        if (isSuccess) {
            setStatus('success');
            const timer = setTimeout(() => {
                router.replace('/login');
            }, 4000);

            return () => clearTimeout(timer);
        }
        if (isError) {
            setStatus('error');
        }
    }, [isSuccess, isError, router]);


    return (
        <CustomKeyboardView>
            <View className="flex-1 px-5 bg-white items-center justify-center">
                <AuthHeaderImage/>
                <View className="items-center text-center">
                    {status === 'loading' && (
                        <View className="flex flex-col items-center">
                            <ActivityIndicator size={100} className='text-primary' />
                            <Text className="text-xl font-semibold mb-2 text-primary">Verifying your account...</Text>
                            <Text className="text-gray-600">Please wait while we verify your account.</Text>
                        </View>
                    )}
                    {status === 'success' && (
                        <View className="flex flex-col items-center">
                            <Ionicons name="checkmark-circle" size={100} color="green" />
                            <Text className="text-xl font-semibold mb-2 text-green-600">Account Verified Successfully!</Text>
                            <Text className="text-gray-600 text-center">
                                Your account has been successfully verified. You will be redirected to the login page shortly.
                            </Text>
                        </View>
                    )}
                    {status === 'error' && (
                        <View className="flex flex-col items-center">
                            <MaterialIcons name="error" size={100} color="red" />
                            <Text className="text-xl font-semibold mb-2 text-red-700">Verification Failed!</Text>
                            <Text className="text-gray-600 text-center">
                                There was an issue verifying your account. Your link might have expired or is incorrect. Please{' '}
                                <Text className="text-blue-500 underline" onPress={() => router.push('/verify-email')}>click here</Text>
                                {' '}to request a new verification email.
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </CustomKeyboardView>
    );
}
