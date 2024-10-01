import React from 'react';

import SearchField from '@/components/shared/SearchFeild';

const EducationDetails = ({ inputValues, setInputValues, inputErrors, setInputErrors }) => {
    return (
        <div>
            <hr className="border-t mt-7 border-gray-300" />
            <p className="text-sm mb-4 mt-5 font-semibold text-primary">Education Details:</p>

            <div className='grid lg:grid-cols-2 gap-5 mt-5 items-baseline'>
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
        </div>
    );
};

export default EducationDetails;
