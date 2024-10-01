import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";

import { Button } from '@/components/ui/button';

import StepIndicator from '@/components/shared/StepIndicator';
import SearchField from '@/components/shared/SearchFeild';
import { hasNoFieldErrors } from '@/utils/validations';

export default function CompleteProfileStep2() {
    const navigate = useNavigate();
    const [inputValues, setInputValues] = useState({ degrees: [], specialities: [] });
    const [inputErrors, setInputErrors] = useState({});

    useEffect(() => {
        const educationDetails = sessionStorage.getItem('profileData');
        if (educationDetails) {
            const storedData = JSON.parse(educationDetails);
            console.log(storedData)
            setInputValues({
                degrees: storedData.degrees || [],
                specialities: storedData.specialities|| []
            });
        }
    }, []);

    const handlePrev = () => {
        sessionStorage.setItem('currentStep', 1);
        navigate('/complete-profile/doctor/');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(inputValues)
        
        if (!hasNoFieldErrors(inputErrors)) {
            console.log(inputErrors);
            return;
        }
        console.log(inputValues);
        const currentProfileData = JSON.parse(sessionStorage.getItem('profileData')) || {};
        const updatedProfileData = {
            ...currentProfileData,
            degrees: inputValues.degrees,
            specialities: inputValues.specialities
        };
        sessionStorage.setItem('profileData', JSON.stringify(updatedProfileData));
        sessionStorage.setItem('currentStep', 3);
        navigate('/complete-profile/doctor/three');
    };

    return (
        <>
        <StepIndicator/>
        <form onSubmit={handleSubmit}>
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

