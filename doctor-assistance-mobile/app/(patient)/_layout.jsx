import React, { useEffect } from 'react'
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Pill, Bell, ClipboardPlus, Info, BadgeHelp } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

import CustomDrawerContent from '@/components/ui/CustomDrawerContent';
import { WebRTCProvider } from '@/contexts/WebRTCContext';
import { useNotifications } from '@/hooks/useNotifications';

const PatientLayout = () => {

    const router = useRouter();
    const screenWidth = Dimensions.get('window').width;

    const { unreadCount, refreshNotifications } = useNotifications();

    useEffect(() => {
        refreshNotifications();
    }, [unreadCount, refreshNotifications]);

    const handleNotificationPress = () => {
        router.push('/(patient)/notifications');
    };

    return (
        <WebRTCProvider>
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
                            <TouchableOpacity className='mr-4' onPress={handleNotificationPress} style={{ position: 'relative' }}>
                                <Bell size={24} color="hsl(203, 87%, 30%)" />
                                {unreadCount > 0 && (
                                    <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                                        <Text className="text-white text-xs font-bold">{unreadCount}</Text>
                                    </View>
                                )}
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
                        headerShown: false
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
                    name="prescription/[id]"
                    options={{
                        title: 'Prescription',
                        drawerItemStyle: { display: 'none' },
                        headerShown: false
                    }}
                />

                <Drawer.Screen
                    name="consultations"
                    options={{
                        title: 'My Consultations',
                        drawerIcon: () => <Pill size={24} color='hsl(203, 87%, 30%)' />,
                        headerShown: false
                    }}
                />

                <Drawer.Screen
                    name="about-us"
                    options={{
                        title: 'About App',
                        drawerIcon: () => <Info size={20} color='hsl(203, 87%, 30%)' />,
                        headerShown: false
                    }}
                />

                <Drawer.Screen
                    name="faqs"
                    options={{
                        title: 'FAQs',
                        drawerIcon: () => <BadgeHelp size={20} color='hsl(203, 87%, 30%)' />,
                        headerShown: false
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
        </WebRTCProvider>
    )
}
export default PatientLayout
