import React from 'react'
import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import "@/global.css";

const MainLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'white' } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="signIn" />
            <Stack.Screen name="signUp" />
            <Stack.Screen name="forgetPassword" />
            <Stack.Screen name="resetPassword" />
            <Stack.Screen name="verifyEmail" />
            <Stack.Screen name="(patient)/index" />
        </Stack>
    );
};

const RootLayout = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <MainLayout />
        </GestureHandlerRootView>
    );
};

export default RootLayout;
