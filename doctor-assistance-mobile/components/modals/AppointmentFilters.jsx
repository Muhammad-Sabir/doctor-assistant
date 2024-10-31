
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { X } from 'lucide-react-native';

const AppointmentFilters = ({ visible, onClose, filters, handleFilterChange, applyFilters, removeFilter }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className='flex-1'>
                <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
                <View className="bg-white rounded-t-md p-4 shadow-lg z-10 justify-end">
                    <Pressable onPress={onClose} style={{ alignSelf: 'flex-end' }}>
                        <X size={24} color="hsl(203, 87%, 30%)" />
                    </Pressable>
                    <Text className="text-lg font-semibold mb-4 text-primary">Filters</Text>

                    <View className='mb-2'>
                        <Text className="text-black mb-2">Doctor Name</Text>
                        <TextInput
                            className="border border-gray-300 rounded px-4 py-2 mb-4"
                            placeholder="Filter by Doctor Name"
                            value={filters.doctorName}
                            onChangeText={(text) => handleFilterChange('doctorName', text)}
                        />
                    </View>

                    <View className="gap-3 mb-4">
                        <Text className="text-black">Mode</Text>
                        <View className="flex flex-row -mt-3">
                            <Pressable onPress={() => handleFilterChange('mode', 'physical')}>
                                <View className="flex-row items-center p-2 mr-3">
                                    <MaterialIcons
                                        name={filters.mode === "physical" ? "radio-button-checked" : "radio-button-unchecked"}
                                        size={20}
                                        color="hsl(203, 87%, 30%)"
                                    />
                                    <Text className="ml-2">Physical</Text>
                                </View>
                            </Pressable>
                            <Pressable onPress={() => handleFilterChange('mode', 'online')}>
                                <View className={'flex-row items-center p-2 mr-3'}>
                                    <MaterialIcons
                                        name={filters.mode === "online" ? "radio-button-checked" : "radio-button-unchecked"}
                                        size={20}
                                        color="hsl(203, 87%, 30%)"
                                    />
                                    <Text className="ml-2">Online</Text>
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

                    <TouchableOpacity className="bg-primary rounded-md py-3 mb-2" onPress={applyFilters}>
                        <Text className="text-white text-center">Apply Filters</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default AppointmentFilters;