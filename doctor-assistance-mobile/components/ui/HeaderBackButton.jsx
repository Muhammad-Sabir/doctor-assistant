import { useRouter } from "expo-router";
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

export const HeaderBackButton = () => {
    const router = useRouter();

    return (
        <TouchableOpacity onPress={() => router.back()}>
            <View>
                <ArrowLeft size={24} color="hsl(203, 87%, 30%)" />
            </View>
        </TouchableOpacity>
    );
};
