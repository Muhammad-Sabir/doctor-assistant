import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Pressable } from 'react-native';
import { CheckCircle, Circle, X } from 'lucide-react-native';

const AppointmentFilters = ({ visible, onClose, filters, handleFilterChange, applyFilters, removeFilter }) => {
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
                        <Text className="text-gray-700 mb-2">Doctor Name</Text>
                        <TextInput
                            className="border border-gray-300 rounded px-4 py-2 mb-4"
                            placeholder="Filter by Doctor Name"
                            value={filters.doctorName}
                            onChangeText={(text) => handleFilterChange('doctorName', text)}
                        />
                    </View>

                    <View className="gap-3 mb-3">
                        <Text className="text-gray-700">Mode</Text>
                        <View className="flex flex-row -mt-3">
                            <Pressable onPress={() => handleFilterChange('mode', 'physical')}>
                                <View className="flex-row items-center p-2 mr-3">
                                    {filters.mode === 'physical' ? (
                                        <CheckCircle size={18} color="hsl(203, 87%, 30%)" />
                                    ) : (
                                        <Circle size={18} color="hsl(203, 87%, 30%)" />
                                    )}
                                    <Text className="ml-2 text-gray-700">Physical</Text>
                                </View>
                            </Pressable>
                            <Pressable onPress={() => handleFilterChange('mode', 'online')}>
                                <View className="flex-row items-center p-2 mr-3">
                                    {filters.mode === 'online' ? (
                                        <CheckCircle size={18} color="hsl(203, 87%, 30%)" />
                                    ) : (
                                        <Circle size={18} color="hsl(203, 87%, 30%)" />
                                    )}
                                    <Text className="ml-2 text-gray-700">Online</Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>

                    <View className="flex flex-row flex-wrap mb-4">
                        {Object.keys(filters).map(
                            (key) => filters[key] && !(key === 'gender' && filters[key] === 'all') && (
                                <TouchableOpacity key={key} className="flex flex-row gap-2 items-center py-1 px-2 bg-accent rounded-md mr-3" style={{ backgroundColor: 'rgb(219 234 254)' }} onPress={() => removeFilter(key)}>
                                    <Text className="text-sm font-medium text-gray-500">
                                        {`${key}: ${filters[key]}`}
                                    </Text>
                                    <X size={16} color="hsl(203, 87%, 30%)" />
                                </TouchableOpacity>
                            )
                        )}
                    </View>

                    <TouchableOpacity className="bg-primary rounded-md py-3 mt-2 mb-1" onPress={applyFilters}>
                        <Text className="text-white font-bold text-center">Apply Filters</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default AppointmentFilters;