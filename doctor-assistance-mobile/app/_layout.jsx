import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "@/global.css";
import { Stack } from "expo-router";

const MainLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="signIn" options={{ headerShown: false }} />
            <Stack.Screen name="signUp" options={{ headerShown: false }} />
            <Stack.Screen name="(patient)/index" options={{ headerShown: false }} />
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
