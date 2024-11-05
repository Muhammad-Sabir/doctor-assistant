import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

export default function Loading() {
    return (
        <View className="flex-1 flex-col items-center justify-center">
            <ActivityIndicator size={100} className='text-primary' />
        </View>
    );
}
