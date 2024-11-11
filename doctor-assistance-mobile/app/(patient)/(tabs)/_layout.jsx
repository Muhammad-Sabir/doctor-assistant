import React, { useEffect } from 'react'
import { Tabs } from 'expo-router';
import { CircleUser, House, MessageCircleMore, UserSearch } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

import { TabIcon } from '@/components/shared/TabIcon';
import { useAuth } from '@/contexts/AuthContext';
import { getChatSocket } from '@/utils/getChatSocket';

const PatientTabs = () => {

    const { user } = useAuth();

    useEffect(()=> {
        getChatSocket(user.access_token);
    }, [getChatSocket])
    
    return (
        <>
            <StatusBar style='light' backgroundColor="hsl(203, 87%, 30%)" />
            <Tabs screenOptions={{
                tabBarShowLabel: false, headerShown: false,
                tabBarStyle: { height: 73 }
            }}>
                <Tabs.Screen
                    name="index"
                    options={{ tabBarIcon: ({ focused }) => TabIcon(House, focused, 'Home') }}
                />
                <Tabs.Screen
                    name="doctors"
                    options={{ tabBarIcon: ({ focused }) => TabIcon(UserSearch, focused, 'Doctors') }}
                />
                <Tabs.Screen
                    name="chats"
                    options={{ tabBarIcon: ({ focused }) => TabIcon(MessageCircleMore, focused, 'Chats') }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{ tabBarIcon: ({ focused }) => TabIcon(CircleUser, focused, 'Profile') }}
                />
            </Tabs>
        </>
    );
}

export default PatientTabs;
