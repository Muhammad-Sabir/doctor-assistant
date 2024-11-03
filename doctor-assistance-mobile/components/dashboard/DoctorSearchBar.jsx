import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollView } from 'react-native-gesture-handler';

const DoctorSearchBar = () => {

    const { fetchWithUserAuth } = useAuth();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchBy, setSearchBy] = useState("speciality_name");
    const [isSelected, setIsSelected] = useState(false);

    const labels = {
        speciality_name: 'specialities',
        disease_name: 'diseases',
        degree_name: 'degrees',
    };

    const { data, isFetching } = useFetchQuery({
        url: `${labels[searchBy]}?name=${searchQuery}`,
        queryKey: ['suggestions', searchBy, searchQuery],
        fetchFunction: fetchWithUserAuth,
        enabled: searchQuery.length > 0 && !isSelected,
    });

    const suggestions = data?.results || [];

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/(patient)/search-results?searchBy=${searchBy}&searchQuery=${searchQuery}`);
            setSearchQuery("");
        }
    };

    const handleSuggestionClick = (item) => {
        setSearchQuery(item.name);
        setIsSelected(true);
    }

    const handleInputChange = (value) => {
        setSearchQuery(value);
        setIsSelected(false);
    };

    return (
        <View className="relative">
            <View className="flex-row items-center border border-gray-300 rounded-md px-3">
                <TextInput className="flex-1 p-2 border-0" value={searchQuery}
                    onChangeText={(text) => handleInputChange(text)}
                    placeholder={`Search Doctors By ${searchBy.replace("_", " ")}...`}
                />
                <TouchableOpacity onPress={handleSearch} className="p-2">
                    <Search color="hsl(203, 87%, 30%)" size={20} />
                </TouchableOpacity>
            </View>

            <Picker
                selectedValue={searchBy}
                onValueChange={(itemValue) => setSearchBy(itemValue)}
                style={{ width: 150, color: "hsl(203, 87%, 30%)", position: 'absolute', top: 32, right: -5, transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                dropdownIconColor={'hsl(203, 87%, 30%)'}
                dropdownIconRippleColor={'hsl(214, 95%, 93%)'}
            >
                <Picker.Item style={{fontSize: 14}} label="Speciality" value="speciality_name" />
                <Picker.Item style={{fontSize: 14}} label="Disease" value="disease_name" />
                <Picker.Item style={{fontSize: 14}} label="Degree" value="degree_name" />
            </Picker>

            <View className="absolute w-full bg-white rounded shadow-lg" style={{ zIndex: 10, top: 60 }}>
                {isFetching ? (
                    <View className="flex-row items-center p-3 px-4 border border-gray-300 rounded">
                        <ActivityIndicator size="small" color="hsl(203, 87%, 30%)" />
                        <Text className="text-gray-500 ml-2">Loading suggestions...</Text>
                    </View>
                ) : (
                    !isSelected && suggestions.length > 0 && (
                        <ScrollView className="border border-gray-300 rounded p-3" style={{maxHeight:200}}>
                            {suggestions.map((item) => (
                                <TouchableOpacity className='p-2' key={item.id} onPress={() => handleSuggestionClick(item)}>
                                    <Text className='text-gray-500'>{item.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )
                )}
            </View>

        </View>
    );
};

export default DoctorSearchBar;
