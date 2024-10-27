import React from 'react';
import { View, Image } from 'react-native';
import { useRouter } from 'expo-router';

import LogoImg from '@/assets/images/logo.png';

const AuthHeaderImage = () => {

    const router = useRouter();

    return (
        <View className="items-center">
            <Image
                source={LogoImg}
                resizeMode='contain'
                style={{ height: 300, width: 300 }}
            />
        </View>
    );
};

export default AuthHeaderImage;
