import React, { createContext, useContext, useState } from 'react';
import { useRouter, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchApi, fetchWithAuth } from '@/utils/fetchApis';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);

    const fetchWithUserAuth = (url, options) => {
        return fetchWithAuth(url, options, user, setUser, router);
    };

    const signupMutation = ({ email }) => {
        return useCreateUpdateMutation({
            url: 'user/register/',
            method: 'POST',
            fetchFunction: fetchApi,
            headers: { 'Content-Type': 'application/json' },
            onSuccessMessage: 'A verification email has been sent to your email address.',
            onErrorMessage: 'Signup failed',
            onSuccess: async () => {
                await AsyncStorage.setItem('userEmail', email);
                router.push('/verify-email');
            },
        });
    };

    const loginMutation = ({ username }) => {
        return useCreateUpdateMutation({
            url: 'user/login/',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            fetchFunction: fetchApi,
            onSuccessMessage: 'Logged in successfully.',
            onErrorMessage: 'Login failed',
            onSuccess: (data) => {
                const { access, refresh, role, is_profile_completed } = data.data;
                const userData = {
                    access_token: access,
                    refresh_token: refresh,
                    role: role,
                    is_profile_completed: is_profile_completed,
                    username: username
                };
                setUser(userData);
                if (!is_profile_completed) {
                    router.push(`/complete-profile`);
                }
                else
                    router.replace('(patient)');
            },
            onError: (error) => {
                if (error.status === 400 && error.message === "Account is not verified. OTP sent to your email.") {
                    router.push('/verify-email');
                }
            },
        });
    };

    const sendOTPVerification = useCreateUpdateMutation({
        url: 'user/send-otp/',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchApi,
        onSuccessMessage: 'OTP Code sent has been sent on your email.',
        onErrorMessage: 'Failed to send OTP Code',
        onSuccess: () => {
            if (pathname === '/login') {
                router.push('/forget-password');
            }
        }
    })

    const verifyOTP = useCreateUpdateMutation({
        url: `user/verify-otp/`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchApi,
        onSuccessMessage: 'Your account has been verified successfully.',
        onErrorMessage: 'Verification failed',
        onSuccess: () => {
            if (pathname === '/forget-password') {
                router.push('/reset-password');
            } else {
                router.push('/login');
            }
        }
    })

    const resetPassword = useCreateUpdateMutation({
        url: `user/change-password/`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchApi,
        onSuccessMessage: 'Password reset successfully.',
        onErrorMessage: 'Failed to reset password',
        onSuccess: () => {
            router.push('/login');
        },
    });

    const completeProfile = useCreateUpdateMutation({
        url: 'patients/',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithUserAuth,
        onSuccessMessage: 'Profile Successfully Setup',
        onErrorMessage: 'Profile Setup Failed',
        onSuccess: () => {
            setUser(prev => ({ ...prev, is_profile_completed: true }));
            router.replace('(patient)');
        }
    });

    const logout = () => {
        setUser(null);
        router.replace('login');
    };

    return (
        <AuthContext.Provider value={{
            user, signupMutation, loginMutation, logout, completeProfile,
            verifyOTP, resetPassword, sendOTPVerification, fetchWithUserAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
