import React from 'react'
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Dimensions, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Pill, Bell, ClipboardPlus } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

import CustomDrawerContent from '@/components/ui/CustomDrawerContent';

const PatientLayout = () => {

    const router = useRouter();

    const handleNotificationPress = () => {
        router.push('/(patient)/notifications');
    };

    const screenWidth = Dimensions.get('window').width;

    return (
        <>
            <StatusBar style='light' backgroundColor="hsl(203, 87%, 30%)" />
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
                        headerTitleAlign: 'center',
                        headerStyle: {
                            backgroundColor: 'white',
                            borderBottomWidth: 1,
                            borderBottomColor: '#D1D5DB',
                            height: screenWidth * 0.23,
                        },
                        headerTitleStyle: {
                            fontSize: 18,
                        },
                    }}
                />
                <Drawer.Screen
                    name="edit-profile"
                    options={{
                        title: 'Edit Profile',
                        drawerItemStyle: { display: 'none' },
                        headerShown: false
                    }}
                />

                <Drawer.Screen
                    name="video-call"
                    options={{
                        title: 'Video Call',
                        drawerItemStyle: { display: 'none' },
                        headerShown: false
                    }}
                />

                <Drawer.Screen
                    name="dependents"
                    options={{
                        title: 'Dependent Patients',
                        drawerItemStyle: { display: 'none' },
                        headerShown: false
                    }}
                />

                <Drawer.Screen
                    name="notifications"
                    options={{
                        title: 'Notifications',
                        drawerItemStyle: { display: 'none' },
                    }}
                />

                <Drawer.Screen
                    name="reviews"
                    options={{
                        title: 'My Reviews',
                        drawerIcon: () => <FontAwesome6 name="comments" size={20} color='hsl(203, 87%, 30%)' />,
                        headerShown: false
                    }}
                />
                <Drawer.Screen
                    name="appointments"
                    options={{
                        title: 'My Appointments',
                        drawerIcon: () => <ClipboardPlus size={24} color='hsl(203, 87%, 30%)' />,
                        headerShown: false
                    }}
                />
                <Drawer.Screen
                    name="prescription"
                    options={{
                        title: 'My Prescription',
                        drawerIcon: () => <Pill size={24} color='hsl(203, 87%, 30%)' />,
                    }}
                />
                <Drawer.Screen
                    name="search-results"
                    options={{
                        title: 'Doctor Search Results',
                        drawerItemStyle: { display: 'none' },
                        headerShown: false
                    }}
                />
                <Drawer.Screen
                    name="doctor/[id]"
                    options={{
                        title: 'Doctor Details',
                        drawerItemStyle: { display: 'none' },
                        headerShown: false
                    }}
                />

                <Drawer.Screen
                    name="allergies/[id]"
                    options={{
                        title: 'Allergies Details',
                        drawerItemStyle: { display: 'none' },
                        headerShown: false
                    }}
                />

                <Drawer.Screen
                    name="hospital/[id]"
                    options={{
                        title: 'Hospital Details',
                        drawerItemStyle: { display: 'none' },
                        headerShown: false
                    }}
                />
            </Drawer>
        </>
    )
}
export default PatientLayout
