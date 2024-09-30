import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSolidError } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { validateField, hasNoFieldErrors } from '@/utils/validations';
import StepIndicator from '@/components/shared/StepIndicator';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchWithAuth } from '@/utils/fetchApis';

export default function CompleteProfileStep4() {
    const navigate = useNavigate();
    const [inputValues, setInputValues] = useState({
        registrationNo: '',
        experience: '',
        picture: null,
    });
    const [inputErrors, setInputErrors] = useState({});

    const completeProfileMutation = useCreateUpdateMutation({
        url: 'doctors/',
        method: 'POST',
        fetchFunction: fetchWithAuth,
        onSuccessMessage: 'Profile Successfully Setup',
        onErrorMessage: 'Profile Setup Failed',
        onSuccess: () => {
            ['profileData', 'currentStep'].forEach(key => sessionStorage.removeItem(key));
            let user = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({ ...user, is_profile_completed: true }));
            navigate(`/${user.role}`)
        }
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'picture') {
            const file = files[0];
            setInputValues((prev) => ({ ...prev, picture: file || null }));
        } else {
            setInputValues((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleBlur = (e) => {
        const { id, value, files } = e.target;
        let inputValue = value;

        if (id === 'picture') {
            inputValue = files[0];
        }
        const errors = validateField(id, inputValue, inputErrors);
        setInputErrors(errors);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!hasNoFieldErrors(inputErrors)) {
            console.log(inputErrors);
            return;
        }

        const profileData = JSON.parse(sessionStorage.getItem('profileData'));
        const finalData = { ...profileData, ...inputValues };
        
        const getIds = (key) => finalData[key]?.map(item => item.id) || [];
        const specialityIds = getIds('specialities');
        const hospitalIds = getIds('hospitals');
        const diseasesIds = getIds('diseases');
        const degreesIds = getIds('degrees');

        const formData = new FormData();
        formData.append('name', finalData.name);
        formData.append('date_of_birth', finalData.birthDate);
        formData.append('date_of_experience', finalData.experience);
        formData.append('pmdc_no', finalData.registrationNo);
        formData.append('gender', finalData.gender);
        formData.append('image_file', finalData.picture);
        hospitalIds.forEach(id => { formData.append('hospitals', id); });
        specialityIds.forEach(id => { formData.append('specialities', id); });
        degreesIds.forEach(id => { formData.append('degrees', id); });
        diseasesIds.forEach(id => { formData.append('diseases', id); });

        completeProfileMutation.mutate(formData)
    };

    const handlePrev = () => {
        sessionStorage.setItem('currentStep', 3);
        navigate('/complete-profile/three');
    };

    return (
        <>
            <StepIndicator />
            <form onSubmit={handleSubmit}>
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
                </div>
                <div className='grid gap-2 mb-5'>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="picture">Upload Image</Label>
                        <Input
                            id="picture"
                            name="picture"
                            type="file"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={inputErrors.picture ? 'border-red-500' : ''}
                            required
                        />
                        {inputErrors.picture && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.picture}
                            </div>
                        )}
                    </div>
                </div>
                <div className="grid gap-2 mb-5">
                    <Label htmlFor="experience">Experience</Label>
                    <Input
                        id="experience"
                        name="experience"
                        type="date"
                        placeholder="Enter your experience..."
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={inputValues.experience || ''}
                        className={inputErrors.experience ? 'border-red-500' : ''}
                        required
                    />
                    {inputErrors.experience && (
                        <div aria-live="assertive" className="flex text-red-500 text-sm">
                            <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.experience}
                        </div>
                    )}
                </div>
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
