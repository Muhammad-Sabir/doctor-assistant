import { View, Text } from 'react-native';

export const TabIcon = (IconComponent, focused, label) => {
    return (
        <View className='items-center justify-center py-3'>
            <View>
                <IconComponent size={28} color={focused ? 'hsl(203, 87%, 30%)' : 'gray'} />
            </View>
            <Text className={`text-sm ${focused ? 'text-primary' : 'text-gray-500'}`}>{label}</Text>
        </View>
    );
};
