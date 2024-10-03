import React from 'react';

import SearchField from '@/components/shared/SearchFeild';

const WorkDetails = ({ inputValues, setInputValues, inputErrors, setInputErrors }) => {
  return (
    <div className='grid lg:grid-cols-2 gap-2 lg:gap-5 mt-7 items-baseline'>
      <SearchField
        placeholder="Affiliated Hospitals"
        onSelect={(selectedHospitals) => setInputValues(prev => ({
          ...prev,
          affiliatedHospitals: selectedHospitals
        }))}
        inputValues={inputValues.affiliatedHospitals}
        setInputError={setInputErrors}
        inputErrors={inputErrors}
        id="hospitals"
        labelClassName='text-gray-700 font-normal'
      />

      <SearchField
        placeholder="Diseases"
        onSelect={(selectedDiseases) => setInputValues(prev => ({
          ...prev,
          diseases: selectedDiseases
        }))}
        inputValues={inputValues.diseases}
        setInputError={setInputErrors}
        inputErrors={inputErrors}
        id="diseases"
        labelClassName='text-gray-700 font-normal'
      />
    </div>
  );
};

export default WorkDetails;
