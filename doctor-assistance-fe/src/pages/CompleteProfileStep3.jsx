import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";

import { Button } from '@/components/ui/button';

import SearchField from '@/components/shared/SearchFeild';
import { hasNoFieldErrors } from '@/utils/validations';
import StepIndicator from '@/components/shared/StepIndicator';

export default function CompleteProfileStep3() {
    const navigate = useNavigate();
    const [inputValues, setInputValues] = useState({ diseases: [], affiliatedHospitals: [] });
    const [inputErrors, setInputErrors] = useState({});

    useEffect(() => {
        const workDetails = sessionStorage.getItem('profileData');
        if (workDetails) {
            const storedData = JSON.parse(workDetails);
            setInputValues({
                diseases: storedData.diseases || [],
                affiliatedHospitals: storedData.hospitals || []
            });
        }
    }, []);

    const handleNext = (e) => {
        e.preventDefault();
        if (!hasNoFieldErrors(inputErrors)) {
            console.log(inputErrors);
            return;
        }
        console.log(inputValues);


        const currentProfileData = JSON.parse(sessionStorage.getItem('profileData')) || {};
        const updatedProfileData = {
            ...currentProfileData,
            diseases: inputValues.diseases,
            hospitals: inputValues.affiliatedHospitals
        };
        sessionStorage.setItem('profileData', JSON.stringify(updatedProfileData));
        sessionStorage.setItem('currentStep', 4);
        navigate('/complete-profile/four');
    };

    const handlePrev = () => {
        sessionStorage.setItem('currentStep', 2);
        navigate('/complete-profile/two');
    }

    return (
        <>
        <StepIndicator/>
        <form onSubmit={handleNext}>
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
            />

            <div className="flex justify-end">
                <div
                    onClick={handlePrev}
                    className='cursor-pointer flex items-center text-sm mr-4 text-gray-400'
                >
                    <FaArrowLeft className='mr-1 mt-1' size={10} /> Back
                </div>

                <Button type="submit">
                    Next Step
                </Button>
            </div>
        </form>
        </>
       
    );
}
