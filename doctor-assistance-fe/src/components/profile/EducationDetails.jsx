import React from 'react';

import SearchField from '@/components/shared/SearchFeild';

const EducationDetails = ({ inputValues, setInputValues, inputErrors, setInputErrors }) => {
    return (
        <div className='grid lg:grid-cols-2 gap-2 lg:gap-5 mt-7 items-baseline'>
            <SearchField
                placeholder="Degrees"
                onSelect={(selectedDegrees) => setInputValues(prev => ({
                    ...prev,
                    degrees: selectedDegrees
                }))}
                inputValues={inputValues.degrees}
                setInputError={setInputErrors}
                inputErrors={inputErrors}
                id="degrees"
                labelClassName='text-gray-700 font-normal'
            />

            <SearchField
                placeholder="Specialities"
                onSelect={(selectedSpecialities) => setInputValues(prev => ({
                    ...prev,
                    specialities: selectedSpecialities
                }))}
                inputValues={inputValues.specialities}
                setInputError={setInputErrors}
                inputErrors={inputErrors}
                id="specialities"
                labelClassName='text-gray-700 font-normal'
            />
        </div>
    );
};

export default EducationDetails;
