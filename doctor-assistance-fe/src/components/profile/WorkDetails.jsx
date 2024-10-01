import React from 'react';

import SearchField from '@/components/shared/SearchFeild';

const WorkDetails = ({ inputValues, setInputValues, inputErrors, setInputErrors }) => {
  return (
    <div>
      <hr className="border-t mt-3 border-gray-300" />
      <p className="text-sm mb-4 mt-5 font-semibold text-primary">Work Details:</p>

      <div className='grid lg:grid-cols-2 gap-5 mt-5 items-baseline'>
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
    </div>
  );
};

export default WorkDetails;
