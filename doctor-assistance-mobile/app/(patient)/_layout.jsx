import React from 'react'
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { View, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ArrowLeft, Pill, Bell, ClipboardPlus } from 'lucide-react-native';

import CustomDrawerContent from '@/components/ui/CustomDrawerContent';

const HeaderBackButton = (router) => (
    <TouchableOpacity onPress={() => { router.back() }}>
        <View className='ml-4 mr-4'>
            <ArrowLeft size={24} color="hsl(203, 87%, 30%)" />
        </View>
    </TouchableOpacity>
);

const PatientLayout = () => {
    const router = useRouter();

    const handleNotificationPress = () => {
        console.log("Notification Pressed");
        router.push('/(patient)/edit-profile');
    };
    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerLabelStyle: { marginLeft: -20, color: 'hsl(203, 87%, 30%)' },
                drawerActiveTintColor: 'gray', headerTintColor: 'hsl(203, 87%, 30%)',
            }}>
            <Drawer.Screen
                name="(tabs)"
                options={{
                    title: 'Doctor Assistance',
                    drawerItemStyle: { display: 'none' },
                    headerRight: () => (
                        <TouchableOpacity className='mr-4' onPress={handleNotificationPress}>
                            <Bell size={24} color="hsl(203, 87%, 30%)" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Drawer.Screen
                name="edit-profile"
                options={{
                    title: 'Edit Profile',
                    drawerItemStyle: { display: 'none' },
                    headerLeft: () => (HeaderBackButton(router)),
                }}
            />

            <Drawer.Screen
                name="dependents"
                options={{
                    title: 'Dependent Patients',
                    drawerItemStyle: { display: 'none' },
                    headerLeft: () => (HeaderBackButton(router)),
                }}
            />

            <Drawer.Screen
                name="notifications"
                options={{
                    title: 'Notifications',
                    drawerItemStyle: { display: 'none' },
                    headerLeft: () => (HeaderBackButton(router)),
                }}
            />

            <Drawer.Screen
                name="reviews"
                options={{
                    title: 'My Reviews',
                    drawerIcon: () => <FontAwesome6 name="comments" size={20} color='hsl(203, 87%, 30%)' />,
                    headerLeft: () => (HeaderBackButton(router)),
                    drawerItemStyle: { marginTop: 16 }
                }}
            />
            <Drawer.Screen
                name="appointments"
                options={{
                    title: 'My Appointments',
                    drawerIcon: () => <ClipboardPlus size={24} color='hsl(203, 87%, 30%)' />,
                    headerLeft: () => (HeaderBackButton(router)),
                    headerShown: false
                    
                }}
            />
            <Drawer.Screen
                name="prescription"
                options={{
                    title: 'My Prescription',
                    drawerIcon: () => <Pill size={24} color='hsl(203, 87%, 30%)' />,
                    headerLeft: () => (HeaderBackButton(router)),
                }}
            />
            <Drawer.Screen
                name="search-results"
                options={{
                    title: 'Doctor Search Results',
                    drawerItemStyle: { display: 'none' },
                    headerLeft: () => (HeaderBackButton(router)),
                    headerStyle: {
                        elevation: 4,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                    },
                }}
            />
            <Drawer.Screen
                name="doctor/[id]"
                options={{
                    title: 'Doctor Details',
                    drawerItemStyle: { display: 'none' },
                    headerLeft: () => (HeaderBackButton(router)),
                    headerStyle: {
                        elevation: 4,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                    },
                }}
            />

            <Drawer.Screen
                name="allergies/[id]"
                options={{
                    title: 'Allergies Details',
                    drawerItemStyle: { display: 'none' },
                    headerLeft: () => (HeaderBackButton(router)),
                }}
            />

            <Drawer.Screen
                name="hospital/[id]"
                options={{
                    title: 'Hospital Details',
                    drawerItemStyle: { display: 'none' },
                    headerLeft: () => (HeaderBackButton(router)),
                    headerStyle: {
                        elevation: 4,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                    },
                }}
            />
        </Drawer>
    )
}
export default PatientLayout
