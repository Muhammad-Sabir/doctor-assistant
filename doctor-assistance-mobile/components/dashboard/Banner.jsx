import React from 'react';
import { View, Image, Dimensions } from 'react-native';

const Banner = ({ imageSource }) => {

    const screenWidth = Dimensions.get('window').width;

    return (
        <View className="flex flex-col items-center mt-8 mb-3">
            <Image
                source={imageSource}
                style={{
                    height: screenWidth * 0.5,
                    width: screenWidth * 0.91,
                    borderRadius: 13,
                }}
                resizeMode='contain'
            />
        </View>
    );
};

export default Banner;
