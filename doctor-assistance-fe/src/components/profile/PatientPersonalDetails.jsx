import React, { useState, useEffect } from 'react';
import { BiSolidError } from "react-icons/bi";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchWithAuth } from '@/utils/fetchApis';
import { validateField, hasNoFieldErrors } from '@/utils/validations';

const PatientPersonalDetails = ({ patientData }) => {
    const [inputValues, setInputValues] = useState({ name: '', birthDate: '', gender: 'M' });
    const [inputErrors, setInputErrors] = useState({});

    const patientId = patientData?.results?.[0]?.id;

    const updateProfileMutation = useCreateUpdateMutation({
        url: `patients/${patientId}/`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithAuth,
        onSuccessMessage: 'Profile Successfully Updated',
        onErrorMessage: 'Profile Update Failed',
        onSuccess: () => {
            window.location.reload();
        }
    });

    useEffect(() => {
        if (patientData) {
            const patient = patientData.results[0];
            setInputValues((prev) => ({
                ...prev, name: patient.name || '', birthDate: patient.date_of_birth || '', gender: patient.gender || '',
            }));
        }
    }, [patientData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e) => {
        const { id, value } = e.target;
        const errors = validateField(id, value, inputErrors);
        setInputErrors(errors);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!hasNoFieldErrors(inputErrors)) {
            return;
        }
        const { name, birthDate, gender } = inputValues;
        updateProfileMutation.mutate(JSON.stringify({ name, date_of_birth: birthDate, gender }))
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='mb-4'>
                <div className='grid lg:grid-cols-2 gap-5 mt-6 items-baseline'>
                    <div className="grid gap-2 mb-2 lg:mb-5">
                        <Label htmlFor="name" className='text-gray-700 font-normal'>Name</Label>
                        <Input
                            id="name"
                            name='name'
                            type="text"
                            placeholder="Enter your name..."
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputValues.name}
                            className={inputErrors.name ? 'border-red-500' : 'border-gray-300'}
                            required
                        />
                        {inputErrors.name && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.name}
                            </div>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="birthDate" className='text-gray-700 font-normal'>Date of Birth</Label>
                        <Input
                            id="birthDate"
                            name="birthDate"
                            type="date"
                            placeholder="Enter your age..."
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputValues.birthDate}
                            className={`${inputErrors.birthDate ? 'border-red-500' : ''}`}
                            required
                        />
                        {inputErrors.birthDate && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.birthDate}
                            </div>
                        )}
                    </div>
                </div>

                <div className='grid gap-2 mt-7 lg:mt-0.5'>
                    <Label className='text-gray-700 font-normal'>Gender</Label>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="M"
                            name="gender"
                            value="M"
                            onChange={handleChange}
                            checked={inputValues.gender === 'M'}
                        />
                        <Label htmlFor="M" className='ml-2 font-normal'>Male</Label>
                        <input
                            type="radio"
                            id="F"
                            name="gender"
                            value="F"
                            onChange={handleChange}
                            className='ml-6'
                            checked={inputValues.gender === 'F'}
                        />
                        <Label htmlFor="F" className='ml-2 font-normal'>Female</Label>
                    </div>
                </div>

            </div>

            <div className='flex justify-end mt-10'>
                <Button type="submit">Update</Button>
            </div>
        </form>
    );
};

export default PatientPersonalDetails;
