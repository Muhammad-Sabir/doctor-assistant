import { View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

const SpecialityList = () => {
    const router = useRouter();

    const specialties = [
        { id: '1', name: 'Orthopedics', searchQuery: 'Orthopedic Surgeon' },
        { id: '2', name: 'Cardiology', searchQuery: 'Cardiologist' },
        { id: '3', name: 'Dermatology', searchQuery: 'Dermatologist' },
        { id: '4', name: 'Pediatrics', searchQuery: 'Pediatrician' },
        { id: '5', name: 'Neurology', searchQuery: 'Neurologist' },
        { id: '6', name: 'Ophthalmology', searchQuery: 'Ophthalmologist' },
        { id: '7', name: 'Pediatrics', searchQuery: 'Pediatrician' },
        { id: '8', name: 'Neurology', searchQuery: 'Neurologist' },
        { id: '9', name: 'Ophthalmology', searchQuery: 'Ophthalmologist' },
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => {
            router.push(`/(patient)/search-results?searchBy=speciality_name&searchQuery=${item.searchQuery}`);
        }}>
            <View className="mr-3 p-3 rounded-md" style={{ backgroundColor: 'hsl(203, 87%, 30%)' }}>
                <Text className="text-md text-white">{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            <FlatList
                data={specialties.slice(0, 6)}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                className="flex-grow-0"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 10 }}
                decelerationRate="fast"
                snapToInterval={Dimensions.get('window').width / 3.5}
                snapToAlignment="center"
            />
        </View>
    );
};

export default SpecialityList;
