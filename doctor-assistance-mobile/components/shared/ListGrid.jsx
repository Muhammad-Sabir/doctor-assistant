import { Text, View } from 'react-native'
import React from 'react'

export default function ListGrid({ data, icon: Icon, color }) {
    return (
        <View className="mt-3 mb-1 flex flex-row  gap-3 justify-between flex-wrap" style={{width: 300}}>
            {data.length > 0 ? (
                data.map((item, index) => (
                    <View key={index} className="flex flex-row items-center space-x-2 gap-2">
                        <Icon size={17} color={color} />
                        <Text className="text-gray-700">{item.name}</Text>
                    </View>
                ))
            ) : (
                <Text className="text-gray-600 text-sm">N/A</Text>
            )}
        </View>
    )
}
