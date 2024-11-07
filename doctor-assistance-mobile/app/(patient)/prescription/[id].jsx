import React, { useState } from 'react';
import { View, Text, Dimensions } from 'react-native';

import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import { HeaderBackButton } from '@/components/ui/HeaderBackButton';

export default function Prescription() {

  const screenWidth = Dimensions.get('window').width;

  const [formData, setFormData] = useState({
    medications: [
      { name: 'Aspirin (Bayer)', dosage: '500mg', frequency: 'Take one tablet every 4-6 hours' },
      { name: 'Ibuprofen (Advil)', dosage: '320mg', frequency: 'Take one tablet daily' },
      { name: 'Acetaminophen (Tylenol)', dosage: '500mg', frequency: 'Take one tablet every 4-6 hours' },
    ],
    prescribedTests: ['Complete Blood Count (CBC)', 'C-reactive protein (CRP)', 'Comprehensive Metabolic Panel (CMP)'],
    patientInstructions: [
      'Take medications as prescribed by the doctor. Follow dosage instructions carefully.',
      'Stay hydrated by drinking plenty of fluids to help thin mucus and alleviate congestion.',
    ],
    additionalInfo: '',
  });

  return (

    <>
      <View className="border border-r-0 border-t-0 border-l-0 border-gray-300 flex-row justify-between items-center bg-white p-4 rounded-b z-1" style={{ height: screenWidth * 0.14, marginTop: screenWidth * 0.09 }}>
        <HeaderBackButton />
        <Text className="text-xl font-semibold text-primary flex-1 text-center">Prescription</Text>
      </View>
      <CustomKeyboardView>
        <View className='bg-white flex-1 px-5 py-5'>
          <Text className="text-lg font-semibold text-primary mb-4">Medications:</Text>
          {formData.medications.map((medication, index) => (
            <View
              key={index}
              className="p-3 border border-gray-300 rounded mb-5"
            >
              <Text className="text-base text-primary font-semibold">{medication.name}</Text>
              <Text className='text-gray-600' >Dosage: {medication.dosage}</Text>
              <Text className='text-gray-600'>Frequency: {medication.frequency}</Text>
            </View>
          ))}

          <Text className="text-lg font-semibold text-primary mb-2">Prescribed Tests:</Text>
          <View className="px-2 mt-1">
            {formData.prescribedTests.map((test, index) => (
              <Text className='text-gray-600' key={index}>{test}</Text>
            ))}
          </View>

          <Text className="text-lg font-semibold text-primary mb-2 mt-4">Patient Instructions:</Text>
          <View className="px-2 mt-1">
            {formData.patientInstructions.map((instruction, index) => (
              <Text className='text-gray-600 mb-2' key={index}>{instruction}</Text>
            ))}
          </View>

          <Text className="text-lg font-semibold text-primary mb-2 mt-4">Additional Notes</Text>
          <View className="px-2 mt-1">
            <Text className='text-gray-600'>{formData.additionalInfo || 'N/A'}</Text>
          </View>
        </View>
      </CustomKeyboardView>
    </>
  );
}
