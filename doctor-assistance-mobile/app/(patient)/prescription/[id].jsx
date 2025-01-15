import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import Loading from '@/components/shared/Loading';

export default function Prescription() {

  const { id } = useLocalSearchParams();
  const { fetchWithUserAuth } = useAuth();

  const screenWidth = Dimensions.get('window').width;

  const [formData, setFormData] = useState({
    medicines: [],
    additionalInfo: '',
  });

  const { data, isFetching, isError, error } = useFetchQuery({
    url: `prescriptions/?consultation_id=${id}`,
    queryKey: ['patientPrescription', id],
    fetchFunction: fetchWithUserAuth,
  });

  useEffect(() => {
    if (data?.results?.length > 0) {
      const prescription = data.results[0];
      setFormData({
        medicines: prescription.medicines,
        additionalInfo: prescription.additional_info || 'N/A',
      });
    }
  }, [data]);

  return (
    <>
      <View className="border border-r-0 border-t-0 border-l-0 border-gray-300 flex-row justify-between items-center bg-white p-4 rounded-b z-1" style={{ height: screenWidth * 0.14, marginTop: screenWidth * 0.09 }}>
        <HeaderBackButton />
        <Text className="text-xl font-semibold text-primary flex-1 text-center">Prescription</Text>
      </View>
      <CustomKeyboardView>
        <View className="flex-1 bg-white px-5 py-5">
          {isFetching && <Loading />}
          {isError && <Text className="text-red-500">Error: {error.message}</Text>}

          {!isFetching && !isError && data && (
            <View>
              <Text className="text-lg font-semibold text-primary mb-4">Medications:</Text>
              {formData?.medicines.length > 0 ? (
                formData.medicines.map((med, index) => (
                  <View
                    key={index}
                    className="p-3 border border-gray-300 rounded mb-5"
                  >
                    <View className='flex-1 items-center justify-start gap-2'>
                      <Text className="text-base text-primary font-semibold">Medicine:</Text>
                      <Text className='text-gray-600'>{med.medicine_name}</Text>
                    </View>
                    <View className='flex-1 items-center justify-start gap-2'>
                      <Text className="text-base text-primary font-semibold">Instruction:</Text>
                      <Text className='text-gray-600'>{med.instruction}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text className="text-gray-500">No medicines for this prescription.</Text>
              )}

              <Text className="text-lg font-semibold text-primary mb-2 mt-4">Additional Notes</Text>
              <View className="px-2 mt-1">
                <Text className='text-gray-600'>{formData.additionalInfo || 'N/A'}</Text>
              </View>
            </View>
          )}
        </View>
      </CustomKeyboardView>
    </>
  );
}
