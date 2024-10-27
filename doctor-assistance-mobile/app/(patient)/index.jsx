import React, { useEffect } from 'react';
import { View, Text, Alert, BackHandler, Button } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {

  const { user, logout } = useAuth(); 

  const handleBackPress = () => {
    Alert.alert('Exit App', 'Are you sure you want to exit?', [
      { text: 'Cancel', onPress: () => null, style: 'cancel' },
      { text: 'Exit', onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  useEffect(() => {
    if (user) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress
      );
      return () => backHandler.remove();
    }
  }, [user]);

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <Text className="text-3xl font-bold mb-4 text-gray-800">Patient</Text>
      <Text className="text-lg text-gray-600 text-center mb-8">HomePage</Text>
      
      {user && (
        <View className="bg-white p-4 rounded shadow-md">
          <Text className="text-xl font-semibold text-gray-700">User Information</Text>
          <Text className="text-md text-gray-600">Username: {user.username}</Text>
          <Text className="text-md text-gray-600">Role: {user.role}</Text>
          <Text className="text-md text-gray-600">Profile Completed: {user.is_profile_completed ? 'Yes' : 'No'}</Text>
        </View>
      )}
      
      <Button title="Logout" onPress={logout} color="#d9534f" />
    </View>
  );
};

export default Home;
