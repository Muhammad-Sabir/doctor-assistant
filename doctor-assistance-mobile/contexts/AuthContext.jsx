import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'expo-router';

import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchApi, fetchWithAuth } from '@/utils/fetchApis';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);

    const fetchWithUserAuth = (url, options) => {
        return fetchWithAuth(url, options, user, setUser, router);
    };

    const signupMutation = useCreateUpdateMutation({
        url: 'user/register/',
        method: 'POST',
        fetchFunction: fetchApi,
        headers: { 'Content-Type': 'application/json' },
        onSuccessMessage: 'A verification email has been sent to your email address.',
        onErrorMessage: 'Signup failed',
        onSuccess: () => {
            router.push('/verify-email');
        },
    });

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
                if (error.status === 400 && error.message === "Account is not verified.") {
                    router.push('/verify-email');
                }
            },
        });
    };

    const sendVerificationEmail = useCreateUpdateMutation({
        url: 'user/send-verify-email/',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchApi,
        onSuccessMessage: 'Verification email sent.',
        onErrorMessage: 'Failed to send verification email',
    });

    const verifyAccount = ({ uid, token }) => {
        return useCreateUpdateMutation({
            url: `user/verify-account/${uid}/${token}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            fetchFunction: fetchApi,
            onSuccessMessage: 'Your account has been verified successfully.',
            onErrorMessage: 'Verification failed',
        });
    };

    const resetPassword = ({ uid, token }) => {
        return useCreateUpdateMutation({
            url: `user/reset-password-confirm/${uid}/${token}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            fetchFunction: fetchApi,
            onSuccessMessage: 'Password reset successfully.',
            onErrorMessage: 'Failed to reset password',
            onSuccess: () => {
                router.push('/login');
            },
        });
    };

    const forgotPassword = useCreateUpdateMutation({
        url: 'user/send-reset-password/',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchApi,
        onSuccessMessage: 'Password reset email sent.',
        onErrorMessage: 'Failed to send reset email',
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
            verifyAccount, resetPassword, sendVerificationEmail, forgotPassword, fetchWithUserAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
