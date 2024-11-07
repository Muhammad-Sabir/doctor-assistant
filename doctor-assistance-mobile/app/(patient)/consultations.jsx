import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';

import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import { useRouter } from 'expo-router';

import Loading from '@/components/shared/Loading';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/utils/date';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { Clock4, ClockArrowUpIcon, Eye } from 'lucide-react-native';

const Consultations = () => {

    const { fetchWithUserAuth } = useAuth();
    const router = useRouter();

    const { data, isFetching, isError, error } = useFetchQuery({
        url: `consultations`,
        queryKey: ['patientAllConsultations'],
        fetchFunction: fetchWithUserAuth,
    });

    const patientConsultations = data?.results || [];

    const screenWidth = Dimensions.get('window').width;

    return (
        <>
            <View className="border border-r-0 border-t-0 border-l-0 border-gray-300 flex-row justify-between items-center bg-white p-4 rounded-b z-1" style={{ height: screenWidth * 0.14, marginTop: screenWidth * 0.09 }}>
                <HeaderBackButton />
                <Text className="text-xl font-semibold text-primary flex-1 text-center">My Consultationss</Text>
            </View>
            <CustomKeyboardView>
                <View className='bg-white flex-1 px-5 py-5'>
                    <Text className="text-lg font-medium text-primary mb-4">My Consultations History:</Text>

                    {isFetching ? (
                        <Loading />
                    ) : isError ? (
                        <Text className="text-primary">Error fetching consultations: {error.message}</Text>
                    ) : patientConsultations && patientConsultations.length > 0 ? (
                        <View className="mt-2 space-y-4">
                            {patientConsultations.map(consultation => (
                                <View key={consultation.id} className="mb-5 relative p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
                                    <TouchableOpacity
                                        className="absolute top-3 right-4 flex flex-row items-center"
                                        onPress={() => router.push(`prescription/${consultation.id}`)}
                                    >
                                        <Eye size={14} color='hsl(203, 87%, 30%)' />
                                        <Text className="text-sm underline text-primary ml-1">View Prescription</Text>
                                    </TouchableOpacity>

                                    <Text className="font-semibold text-primary mb-2 truncate">{consultation.title}</Text>
                                    <Text className="text-gray-600 mb-1">Consultation for {consultation.patient_name}</Text>
                                    <Text className="text-gray-600 mb-1">Created by Dr. {consultation.doctor_name}</Text>

                                    <View className="flex items-center flex-row justify-between text-xs text-gray-600 mt-4">
                                        <View className=' flex flex-row items-center gap-1'>
                                            <Clock4 size={14} color='grey' />
                                            <Text className="text-sm text-gray-500"> {formatDate(consultation.created_at)}</Text>
                                        </View>

                                        <View className=' flex flex-row items-center gap-1'>
                                            <ClockArrowUpIcon size={14} color='grey' />
                                            <Text className="text-sm text-gray-500"> {formatDate(consultation.updated_at)}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text className="text-sm text-gray-600 mt-4">You have no past consultations.</Text>
                    )}
                </View>
            </CustomKeyboardView>
        </>
    );
};

export default Consultations;



