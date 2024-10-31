import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileTabs = ({ activeTab, setActiveTab, tabs }) => {

    useEffect(() => {
        const loadActiveTab = async () => {
            const savedTab = await AsyncStorage.getItem('activeTab');
            const isValidTab = tabs.some(tab => tab.key === savedTab);

            if (savedTab && isValidTab) {
                setActiveTab(savedTab);
            } else {
                const defaultTab = tabs[0]?.key;
                setActiveTab(defaultTab);
                await AsyncStorage.setItem('activeTab', defaultTab);
            }
        };
        loadActiveTab();
    }, [setActiveTab, tabs]);

    const handleTabClick = async (tabKey) => {
        setActiveTab(tabKey);
        await AsyncStorage.setItem('activeTab', tabKey);
    };

    return (
        <View className="flex-row justify-center items-center bg-gray-200 rounded-full p-1 mb-4">
            {tabs.map(tab => (
                <TouchableOpacity
                    key={tab.key}
                    onPress={() => handleTabClick(tab.key)}
                    className={`flex-1 py-2 rounded-full ${activeTab === tab.key ? 'bg-white' : 'bg-transparent'}`}>
                    <Text className={`text-center font-semibold ${activeTab === tab.key ? 'text-black' : 'text-gray-500'}`}>
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

export default ProfileTabs;