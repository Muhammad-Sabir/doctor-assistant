import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSolidError } from "react-icons/bi";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { validateField, hasNoFieldErrors } from '@/utils/validations';
import StepIndicator from '@/components/shared/StepIndicator';

export default function CompleteProfileStep1() {
    const navigate = useNavigate();
    const [inputValues, setInputValues] = useState({ name: '', doctorBirthDate: '', gender: 'M' });
    const [inputErrors, setInputErrors] = useState({});

    useEffect(() => {
        const personalDetails = sessionStorage.getItem('profileData');
        if (personalDetails) {
            setInputValues(JSON.parse(personalDetails));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e) => {
        const { id, value } = e.target;
        const errors = validateField(id, value, inputErrors);
        setInputErrors(errors);
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (!hasNoFieldErrors(inputErrors)) {
            console.log(inputErrors);
            return;
        }
        console.log(inputValues);
        sessionStorage.setItem('profileData', JSON.stringify(inputValues));
        sessionStorage.setItem('currentStep', 2);
        navigate('two');
    };

    return (
        <>
            <StepIndicator />
            <form onSubmit={handleNext}>
                <div className="grid gap-2 mb-5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        name='name'
                        type="text"
                        placeholder="Enter your name..."
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={inputValues.name}
                        className={inputErrors.name ? 'border-red-500' : ''}
                        required
                    />
                    {inputErrors.name && (
                        <div aria-live="assertive" className="flex text-red-500 text-sm">
                            <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.name}
                        </div>
                    )}
                </div>
                <div className="grid gap-2 mb-5">
                    <Label htmlFor="doctorBirthDate">Date of Birth</Label>
                    <Input
                        id="doctorBirthDate"
                        name="doctorBirthDate"
                        type="date"
                        placeholder="Enter your age..."
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={inputValues.doctorBirthDate}
                        className={`w-full border rounded-md p-2 ${inputErrors.doctorBirthDate ? 'border-red-500' : 'border-gray-300'}`}
                        required
                    />
                    {inputErrors.doctorBirthDate && (
                        <div aria-live="assertive" className="flex text-red-500 text-sm">
                            <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.doctorBirthDate}
                        </div>
                    )}
                </div>
                <div className='grid gap-2 mb-3'>
                    <Label>Gender</Label>
                    <div>
                        <input
                            type="radio"
                            id="M"
                            name="gender"
                            value="M"
                            onChange={handleChange}
                            checked={inputValues.gender === 'M'}
                        />
                        <Label htmlFor="M" className='ml-2 -mt-2 font-normal'>Male</Label>
                        
                        <input
                            type="radio"
                            id="F"
                            name="gender"
                            value="F"
                            onChange={handleChange}
                            className='ml-3'
                            checked={inputValues.gender === 'F'}
                        />
                        <Label htmlFor="F" className='ml-2 -mt-2 font-normal'>Female</Label>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" >
                        Next Step
                    </Button>

                </div>
            </form>
        </>

    );
}
