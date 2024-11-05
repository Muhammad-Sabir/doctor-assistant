import React from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const HospitalCard = ({ hospital }) => {
    
    const router = useRouter();
    
    return (
        <TouchableOpacity onPress={() => router.push(`/(patient)/hospital/${hospital.id}`)}
            className="flex flex-row items-center space-x-4 mb-1 gap-3 p-4 bg-white border border-gray-300 rounded-md hover:shadow-md hover:border-primary"
        >
            {hospital.logo_url && (
                <Image source={{ uri: hospital.logo_url }} alt={hospital.name}
                    style={{ height: 60, width: 60, objectFit: 'cover', borderRadius: 100 }}
                />
            )}
            <View>
                <Text className="text-base font-semibold text-primary capitalize" numberOfLines={1} ellipsizeMode="tail" style={{ width: 250 }}>
                    {hospital.name}, {hospital.city}
                </Text>
                <Text className="text-sm text-gray-500 wrap" style={{width: 270}}>
                    {hospital.street_address}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default HospitalCard;
