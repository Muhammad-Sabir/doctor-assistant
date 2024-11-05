
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import { CheckCircle, Circle, X } from 'lucide-react-native';

const FilterModal = ({ visible, onClose, filters, handleFilterChange, applyFilters, removeFilter }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className='flex-1' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View className='flex-1' />
                <View className="bg-white rounded-md p-5 z-10 justify-end">

                    <View className='flex flex-row justify-between'>
                        <Text className="text-xl font-bold text-primary mb-1">Filters</Text>
                        <Pressable onPress={onClose} >
                            <X size={24} color="grey" />
                        </Pressable>
                    </View>

                    <View className='mb-3 mt-3'>
                        <Text className="text-gray-700 mb-2">Name</Text>
                        <TextInput
                            className="border border-gray-300 rounded px-4 py-2 mb-4"
                            placeholder="Filter by Name"
                            value={filters.name}
                            onChangeText={(text) => handleFilterChange('name', text)}
                        />
                    </View>

                    <View className='mb-3'>
                        <Text className="text-gray-700">Min Rating: {filters.average_rating_min}</Text>
                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={0}
                            maximumValue={5}
                            step={1}
                            value={parseInt(filters.average_rating_min) || 0}
                            onValueChange={(value) => handleFilterChange('average_rating_min', value.toString())}
                            minimumTrackTintColor="hsl(203, 87%, 30%)"
                            maximumTrackTintColor="#d3d3d3"
                            thumbTintColor="hsl(203, 87%, 30%)"
                        />
                    </View>

                    <View className='mb-3'>
                        <Text className="text-gray-700">Max Rating: {filters.average_rating_max}</Text>
                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={0}
                            maximumValue={5}
                            step={1}
                            value={parseInt(filters.average_rating_max) || 0}
                            onValueChange={(value) => handleFilterChange('average_rating_max', value.toString())}
                            minimumTrackTintColor="hsl(203, 87%, 30%)"
                            maximumTrackTintColor="#d3d3d3"
                            thumbTintColor="hsl(203, 87%, 30%)"
                        />
                    </View>

                    <View className='mb-3'>
                        <Text className="text-gray-700 mb-2">Years of Experience</Text>
                        <TextInput
                            className="border border-gray-300 rounded px-4 py-2 mb-4"
                            placeholder="Years of Experience"
                            value={filters.years_of_experience}
                            keyboardType="numeric"
                            onChangeText={(text) => handleFilterChange('years_of_experience', text)}
                        />
                    </View>

                    <View className="gap-3 mb-3">
                        <Text className="text-gray-700">Gender</Text>
                        <View className="flex flex-row -mt-3">
                            <Pressable onPress={() => handleFilterChange('gender', 'M')}>
                                <View className="flex-row items-center p-2 mr-3">
                                    {filters.gender === 'M' ? (
                                        <CheckCircle size={18} color="hsl(203, 87%, 30%)" />
                                    ) : (
                                        <Circle size={18} color="hsl(203, 87%, 30%)" />
                                    )}
                                    <Text className="ml-2 text-gray-700">Male</Text>
                                </View>
                            </Pressable>
                            <Pressable onPress={() => handleFilterChange('gender', 'F')}>
                                <View className="flex-row items-center p-2 mr-3">
                                    {filters.gender === 'F' ? (
                                        <CheckCircle size={18} color="hsl(203, 87%, 30%)" />
                                    ) : (
                                        <Circle size={18} color="hsl(203, 87%, 30%)" />
                                    )}
                                    <Text className="ml-2 text-gray-700">Female</Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>

                    <View className="flex flex-row flex-wrap mb-4">
                        {Object.keys(filters).map(
                            (key) => filters[key] && !(key === 'gender' && filters[key] === 'all') && (
                                <TouchableOpacity key={key} className="flex flex-row items-center rounded-md px-3 py-2 mr-2 mb-2" style={{ backgroundColor: 'rgb(219 234 254)' }} onPress={() => removeFilter(key)}>
                                    <Text className="text-sm text-gray-700 mr-2">
                                        {`${key}: ${filters[key]}`}
                                    </Text>
                                    <X size={13} color="hsl(203, 87%, 30%)" />
                                </TouchableOpacity>
                            )
                        )}
                    </View>

                    <TouchableOpacity className="bg-primary rounded-md py-3 mt-2 mb-1" onPress={applyFilters} >
                        <Text className="text-white text-center">Apply Filters</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default FilterModal;
