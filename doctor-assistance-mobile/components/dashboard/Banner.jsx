import React from 'react';
import { View, Image } from 'react-native';

const Banner = ({ imageSource }) => {
    return (
        <View className="flex-row items-center justify-between mb-3 mt-3">
            <View className="flex flex-col items-center mt-8 mb-3">
                <Image source={imageSource}
                style={{height: 200, width: 393, borderRadius: 8}} resizeMode='contain'/>
            </View>
        </View>

    );
};

export default Banner;
