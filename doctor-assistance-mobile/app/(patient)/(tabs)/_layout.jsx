import React from 'react'
import { Tabs } from 'expo-router';
import { CircleUser, ClipboardPlus, House, UserSearch } from 'lucide-react-native';

import { TabIcon } from '@/components/shared/TabIcon';

const PatientTabs = () => {
    
    return (
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
                name="appointments"
                options={{ tabBarIcon: ({ focused }) => TabIcon(ClipboardPlus, focused, 'Appointments') }}
            />
            <Tabs.Screen
                name="profile"
                options={{ tabBarIcon: ({ focused }) => TabIcon(CircleUser, focused, 'Profile') }}
            />
        </Tabs>
    );
}

export default PatientTabs;
