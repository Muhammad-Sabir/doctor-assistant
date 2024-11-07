import React from 'react';
import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner-native';

import "@/global.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';

const MainLayout = () => {

    return (
        <>
            <StatusBar style='light' backgroundColor="hsl(203, 87%, 30%)" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'white' } }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
                <Stack.Screen name="forget-password" />
                <Stack.Screen name="reset-password" />
                <Stack.Screen name="verify-email" />
                <Stack.Screen name="verify-account/[uid]/[token]" />
                <Stack.Screen name="complete-profile" />
                <Stack.Screen name="(patient)" />
            </Stack>
        </>
    );
};

const RootLayout = () => {
    const queryClient = new QueryClient();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <MainLayout />
                    <Toaster />
                </AuthProvider>
            </QueryClientProvider>
        </GestureHandlerRootView >
    );
};

export default RootLayout;
