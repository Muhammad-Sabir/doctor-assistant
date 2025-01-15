import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSolidError } from "react-icons/bi";
import { CircleCheck } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { validateField, hasNoFieldErrors } from '@/utils/validations';
import StepIndicator from '@/components/shared/StepIndicator';
import { fetchApi } from '@/utils/fetchApis';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';

export default function CompleteProfileStep1() {

    const navigate = useNavigate();
    const [inputValues, setInputValues] = useState({ name: '', registrationNo: '', doctorBirthDate: '' });

    const [inputErrors, setInputErrors] = useState({});
    const [pmdcVerified, setPmdcVerified] = useState(false);

    const { mutate: verifyPmdcNo, isSuccess, isError, error } = useCreateUpdateMutation({
        url: 'verify-pmdc/',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchApi,
    });

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

        if (id === 'registrationNo') {
            if (value.trim()) {
                verifyPmdcNo(JSON.stringify({ pmdc_no: value }));
            }
        }

        const errors = validateField(id, value, inputErrors);
        setInputErrors(errors);
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (!hasNoFieldErrors(inputErrors)) {
            console.log(inputErrors);
            return;
        }
        sessionStorage.setItem('profileData', JSON.stringify(inputValues));
        sessionStorage.setItem('currentStep', 2);
        navigate('two');
    };

    useEffect(() => {
        if (isSuccess) {
            setPmdcVerified(true);
            setInputErrors((prev) => {
                const updatedErrors = { ...prev };
                delete updatedErrors.registrationNo;
                return updatedErrors;
            });
        }
        if (isError && error?.status === 400) {
            setPmdcVerified(false);
            setInputErrors((prev) => ({ ...prev, registrationNo: error.message || 'PMDC number verification failed.' }));
        }
    }, [isSuccess, isError, error]);

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
                    <Label htmlFor="registrationNo">PMDC Registration No</Label>
                    <Input
                        id="registrationNo"
                        name="registrationNo"
                        type="text"
                        placeholder="Enter your registration number..."
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={inputValues.registrationNo || ''}
                        className={inputErrors.registrationNo ? 'border-red-500' : ''}
                        required
                    />
                    {inputErrors.registrationNo && (
                        <div aria-live="assertive" className="flex text-red-500 text-sm">
                            <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.registrationNo}
                        </div>
                    )}
                    {pmdcVerified && !inputErrors.registrationNo && (
                        <div aria-live="assertive" className="flex text-green-600 text-sm">
                            <CircleCheck color='green' className="mr-1 mt-1" size={14} />Your PMDC Registration No. Has Been Verified
                        </div>
                    )}
                </div>
                <div className="grid gap-2 mb-5">
                    <div className='flex items-center justify-start gap-2'>
                        <Label htmlFor="doctorBirthDate">Date of Birth </Label>
                        <span className='text-gray-700 text-sm '>(20 or older)</span>
                    </div>

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
                <div className="flex justify-end">
                    <Button type="submit" >
                        Next Step
                    </Button>

                </div>
            </form>
        </>

    );
}
