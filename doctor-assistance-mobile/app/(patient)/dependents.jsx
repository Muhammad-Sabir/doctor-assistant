import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useAuth } from '@/contexts/AuthContext';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import AddDependent from '@/components/modals/AddDependent';
import UpdateDependent from '@/components/modals/UpdateDependent';
import DeleteItem from '@/components/modals/DeleteItem';
import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import Loading from '@/components/shared/Loading';

export default function DependentPatientsDetails() {

    const { fetchWithUserAuth } = useAuth();

    const { data, isFetching, isError, error } = useFetchQuery({
        url: 'patients/',
        queryKey: ['patientProfile'],
        fetchFunction: fetchWithUserAuth,
    });

    const dependentDetails = data?.results[0].dependents || []

    if (isFetching) return <Loading />;
    if (isError) return <Text className="text-red-500">Error: {error.message}</Text>;

    return (
        <>
            <View className="border border-r-0 border-t-0 border-l-0 border-gray-300 flex-row justify-between items-center bg-white p-4 rounded-b z-1" style={{ height: 65, marginTop: 40 }}>
                <HeaderBackButton />
                <Text className="text-xl font-semibold text-primary flex-1 text-center">Dependent Details</Text>
                <AddDependent />
            </View>

            <CustomKeyboardView>

                {isFetching && <Loading />}
                {isError && <Text className="text-center mt-4 text-red-500">Error: {error.message}</Text>}

                <View className="flex-1 bg-white w-full px-5">

                    {!isFetching && dependentDetails.length > 0 ? (
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
        </>
    );
}
