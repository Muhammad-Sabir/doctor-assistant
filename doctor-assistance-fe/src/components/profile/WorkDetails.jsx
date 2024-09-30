import React from 'react';

import SearchField from '@/components/shared/SearchFeild';

const WorkDetails = ({ inputValues, setInputValues, inputErrors, setInputErrors }) => {
  return (
    <div>
      <hr className="border-t mt-6 border-gray-300" />
      <p className="text-sm mb-4 mt-6 font-semibold text-primary">Work Details:</p>

      <div className='md:flex mt-4 gap-5 items-baseline'>
        
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
          inputClassName='w-80'
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
          inputClassName='w-80'
        />

      </div>

    </div>
  );
};

export default WorkDetails;
