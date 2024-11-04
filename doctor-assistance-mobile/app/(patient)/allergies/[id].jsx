import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useAuth } from '@/contexts/AuthContext';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import Loading from '@/components/shared/Loading';

export default function PatientAllergiesDetail() {

    const { fetchWithUserAuth } = useAuth();
    const { id } = useLocalSearchParams();

    const [patientAllergies, setPatientAllergies] = useState([]);
    const [dependentsAllergies, setDependentsAllergies] = useState([]);

    const { data: allergiesData, isFetching, isSuccess: allergiesSuccess, isError, error } = useFetchQuery({
        url: 'patient-allergies/',
        queryKey: ['patientAllergies'],
        fetchFunction: fetchWithUserAuth,
    });

    useEffect(() => {
        if (allergiesSuccess && allergiesData) {

            const filteredPatientAllergies = allergiesData.results.filter(allergy => allergy.patient.id === Number(id));
            const filteredDependentAllergies = allergiesData.results.filter(allergy => allergy.patient.id !== Number(id));

            setPatientAllergies(filteredPatientAllergies);
            setDependentsAllergies(filteredDependentAllergies);
        }
    }, [allergiesSuccess, allergiesData, id]);

    const groupedOtherAllergies = dependentsAllergies.reduce((acc, allergy) => {
        const patientId = allergy.patient.id;
        if (!acc[patientId]) {
            acc[patientId] = {
                id: patientId,
                name: allergy.patient.name,
                allergies: [],
            };
        }
        acc[patientId].allergies.push(allergy.allergy.name);
        return acc;
    }, {});

    return (
        <>
            <View className="border border-r-0 border-t-0 border-l-0 border-gray-300 flex-row justify-between items-center bg-white p-4 rounded-b z-1" style={{ height: 59, marginTop: 40 }}>
                <HeaderBackButton />
                <Text className="text-xl font-semibold text-primary flex-1 text-center">Allergies Details</Text>
            </View>

            <CustomKeyboardView>
                {isFetching ? (
                    <Loading />
                ) : isError ? (
                    <Text className="text-primary text-center mt-4">Error fetching patient allergies: {error.message}</Text>
                ) : (
                    <View className="px-5 flex-1 bg-white w-full py-5">
                        <Text className="text-lg font-semibold text-primary mb-3">Your Allergies:</Text>
                        {patientAllergies.length > 0 ? (
                            <View className="flex-row flex-wrap mb-4">
                                {patientAllergies.map(allergy => (
                                    <View key={allergy.id} className="mr-2 m-1 py-1 px-2 bg-accent rounded-md">
                                        <Text className="text-sm font-medium text-primary text-center">{allergy.allergy.name}</Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text className="text-gray-600 mb-4">No allergies found for this patient.</Text>
                        )}

                        <Text className="text-lg font-semibold text-primary mb-3">Dependent Patients Allergies:</Text>
                        {Object.values(groupedOtherAllergies).length > 0 ? (
                            Object.values(groupedOtherAllergies).map(({ id, name, allergies }) => (
                                <View key={id} className="border border-gray-300 rounded-md p-4 mb-4">
                                    <Text className="text-sm text-gray-500 mb-1">
                                        <Text className="font-semibold">Patient ID: </Text>{id}
                                    </Text>
                                    <Text className="font-bold text-primary mb-2">{name}</Text>
                                    <View className="flex-row flex-wrap">
                                        {allergies.map((allergy, index) => (
                                            <Text key={allergy} className="mr-2 m-1 py-1 px-2 bg-accent rounded-md text-xs font-medium text-primary text-center">
                                                {allergy}{index < allergies.length - 1 && ', '}
                                            </Text>
                                        ))}
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text className="text-gray-600 ">No allergies found for dependents.</Text>
                        )}
                    </View>
                )}
            </CustomKeyboardView>
        </>
    );
}