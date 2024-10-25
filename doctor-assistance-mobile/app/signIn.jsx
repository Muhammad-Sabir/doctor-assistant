import React from 'react';
import { View, Text } from 'react-native';

const SignIn = () => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <Text className="text-3xl font-bold mb-4 text-gray-800">Sign In</Text>
      <Text className="text-lg text-gray-600 text-center mb-8">
        Welcome back! Please sign in to continue.
      </Text>
    </View>
  );
};

export default SignIn;
