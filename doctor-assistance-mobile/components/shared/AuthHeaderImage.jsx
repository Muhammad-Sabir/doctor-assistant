import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import LogoImg from '@/assets/images/logo.png';

const AuthHeaderImage = () => {

    const router = useRouter();

    return (
        <TouchableOpacity onPress={() => router.push('/')}>
            <View className="items-center">
                <Image
                    source={LogoImg}
                    resizeMode='contain'
                    style={{ height: 300, width: 300 }}
                />
            </View>
        </TouchableOpacity>
    );
};

export default AuthHeaderImage;
