import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useAuth } from '@/contexts/AuthContext';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import AddDependent from '@/components/modals/AddDependent';
import UpdateDependent from '@/components/modals/UpdateDependent';
import DeleteItem from '@/components/modals/DeleteItem';

export default function DependentPatientsDetails() {

    const { fetchWithUserAuth } = useAuth();

    const { data, isFetching, isError, error } = useFetchQuery({
        url: 'patients/',
        queryKey: ['patientProfile'],
        fetchFunction: fetchWithUserAuth,
    });

    const dependentDetails = data?.results[0].dependents || []

    if (isFetching) return <Text>Loading....</Text>;
    if (isError) return <Text className="text-red-500">Error: {error.message}</Text>;

    return (
        <CustomKeyboardView>
            <View className="flex-1 bg-white w-full px-5">

                <View className='flex flex-row items-center justify-between'>
                    <Text className="text-xl font-medium text-primary mb-4">Dependent Patients:</Text>
                    <AddDependent />
                </View>

                {dependentDetails.length > 0 ? (
                    <ScrollView>
                        {dependentDetails.map((dependent) => (
                            <View key={dependent.id} className="border border-gray-300 rounded-md p-4 mb-4">
                                <Text className="text-sm font-normal text-gray-500">
                                    <Text className="font-semibold">Patient ID:</Text> {dependent.id}
                                </Text>
                                <Text className="font-bold text-md text-primary">{dependent.name}</Text>
                                <Text className="text-sm font-normal text-gray-500">
                                    <Text className="font-semibold">Date of Birth:</Text> {dependent.date_of_birth}
                                </Text>
                                <Text className="text-sm font-normal text-blue-500">
                                    <Text className="font-semibold">Gender:</Text> {dependent.gender === 'M' ? 'Male' : 'Female'}
                                </Text>
                                <View className="flex-row justify-end mt-2">
                                <UpdateDependent selectedDependent={dependent} />
                                <DeleteItem deleteUrl={`dependents/${dependent.id}`} itemName={"Dependent"} iconSize={16} />
                            </View>
                            </View>
                        ))}
                    </ScrollView>
                ) : (
                    <Text className="text-sm text-gray-600">No dependent patients found. Click "Add New" to create a dependent.</Text>
                )}
            </View>
        </CustomKeyboardView>
    );
}
