import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useFocusEffect } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/AuthContext';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import AddDependent from '@/components/modals/AddDependent';
import UpdateDependent from '@/components/modals/UpdateDependent';
import DeleteItem from '@/components/modals/DeleteItem';
import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import Loading from '@/components/shared/Loading';

export default function DependentPatientsDetails() {

    const [dependentDetails, setDependentDetails] = useState([]);
    const queryClient = useQueryClient();
    const { fetchWithUserAuth } = useAuth();

    const { data, isFetching, isError, error } = useFetchQuery({
        url: 'patients/',
        queryKey: ['patientProfile'],
        fetchFunction: fetchWithUserAuth,
    });

    useFocusEffect(
        useCallback(() => {
            queryClient.invalidateQueries(['patientProfile']);
        }, [queryClient])
    );

    useEffect(() => {
        if (data) {
            setDependentDetails(data?.results[0].dependents || []);
        }
    }, [data]);

    return (
        <>
            <View className="border border-r-0 border-t-0 border-l-0 border-gray-300 flex-row justify-between items-center bg-white p-4 rounded-b z-1" style={{ height: 59, marginTop: 40 }}>
                <HeaderBackButton />
                <Text className="text-xl font-semibold text-primary flex-1 text-center">Dependent Details</Text>
                <AddDependent />
            </View>

            <CustomKeyboardView>
                <View className="flex-1 py-5 px-5 pb-8 bg-white">
                    {isFetching ? (
                        <Loading />
                    ) : isError ? (
                        <Text className="text-center mt-4 text-red-500">Error: {error.message}</Text>
                    ) : dependentDetails.length === 0 ? (
                        <Text className="text text-gray-600 text-center">No dependent patients found. Click "Add New" to create a dependent.</Text>
                    ) : (
                        <ScrollView>
                            {dependentDetails.map((dependent) => (
                                <View key={dependent.id} className="border border-gray-300 rounded-md p-4 mb-5">
                                    <Text className="font-normal text-gray-500">
                                        <Text className="font-semibold">Patient ID:</Text> {dependent.id}
                                    </Text>
                                    <Text className="font-bold text-md text-primary mt-2">{dependent.name}</Text>
                                    <Text className="mt-1 font-normal text-gray-500">
                                        <Text className="font-semibold">Date of Birth:</Text> {dependent.date_of_birth}
                                    </Text>

                                    <View className="mt-2 flex flex-row justify-between items-center">
                                        <View className="flex flex-row gap-2 items-center py-1 px-2 bg-accent rounded-md">
                                            <Text className='text-sm font-medium text-primary'>{dependent.gender === 'M' ? 'Male' : 'Female'}</Text>
                                        </View>

                                        <View className="flex flex-row items-center gap-2">
                                            <UpdateDependent selectedDependent={dependent} />
                                            <DeleteItem deleteUrl={`dependents/${dependent.id}/`} itemName={"Dependent"} iconSize={16} />
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>
            </CustomKeyboardView>
        </>
    );
}
