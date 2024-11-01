import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useAuth } from '@/contexts/AuthContext';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';

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

    if (isFetching) {
        return <Text>Loading....</Text>;
    }

    if (isError) {
        return <Text className="text-primary text-center mt-4">Error fetching patient allergies: {error.message}</Text>;
    }

    return (
        <CustomKeyboardView>
            <View className="px-5 flex-1 bg-white w-full p-4">
                <Text className="text-base font-semibold text-primary mb-2">Your Allergies:</Text>
                {patientAllergies.length > 0 ? (
                    <View className="flex-row flex-wrap mb-4">
                        {patientAllergies.map(allergy => (
                            <View key={allergy.id} className="mr-2 m-1 py-1 px-2 bg-accent rounded-md">
                                <Text className="text-xs font-medium text-primary text-center">{allergy.allergy.name}</Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text className="text-sm text-gray-600 mb-4">No allergies found for this patient.</Text>
                )}

                <Text className="text-base font-semibold text-primary mb-4">Dependent Patients Allergies:</Text>
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
                    <Text className="text-gray-600 text-sm">No allergies found for dependents.</Text>
                )}
            </View>
        </CustomKeyboardView>
    );
}
