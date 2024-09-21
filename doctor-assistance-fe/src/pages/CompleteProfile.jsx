import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { BiSolidError } from "react-icons/bi";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import logo from '@/assets/images/svg/webLogo.svg';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { getAuthStatus } from '@/utils/auth';

export default function CompleteProfile() {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;
    const [inputErrors, setInputErrors] = useState({});
    const [inputValues, setInputValues] = useState({
        name: '',
        age: '',
        specialization: '',
        degree: '',
        registrationNo: '',
        experience: '',
        designation: ''
    });

    const nextStep = () => {
        setCurrentStep(prev => prev + 1);
    };
    
    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const stepNames = {
        1: 'Enter your Personal Info',
        2: 'Enter your Education Details',
        3: 'Enter your Professional Details',
    };
    
    const getStepName = (step) => {
        return stepNames[step] || 'Unknown Step';
    };

    const renderStepIndicator = () => {
        return (
            <div className='-mt-3'>
                <p className="text-sm font-semibold mb-2">Step {currentStep}: {getStepName(currentStep)}</p>
                <div className="flex gap-2">
                    {[...Array(totalSteps)].map((_, index) => {
                        const isCurrentStep = index + 1 === currentStep;
                        const isCompletedStep = index + 1 < currentStep;
                        const bgColor = isCompletedStep ? 'bg-accent' : isCurrentStep ? 'bg-primary' : 'bg-gray-300';
    
                        return (
                            <div
                                key={index}
                                className={`h-2 w-[33.33%] rounded ${bgColor}`}
                            ></div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setInputValues(prev => ({ ...prev, [id]: value }));
    };

    const handleBlur = (e) => {
        const { id, value } = e.target;
        const errors = validateField(id, value, inputErrors);
        setInputErrors(errors);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (hasNoFieldErrors(inputErrors)) {
            console.log("Form submitted successfully:", inputValues);

            let user = JSON.parse(localStorage.getItem('user'));
            user.is_profile_completed = true;
            localStorage.setItem('user', JSON.stringify(user));
            navigate(`/${user.role}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    useEffect(() => {
        const { isAuthenticated, user } = getAuthStatus();

        const isDoctorWithIncompleteProfile = () => {
            return user.role === 'doctor' && !user.is_profile_completed;
        };

        if (!isAuthenticated) {
            navigate('/login');   
        } else if (isDoctorWithIncompleteProfile()) {
            navigate(`/${user.role}`);
        }
    }, [navigate]);

    const renderFormFields = () => {
        if (currentStep === 1) {
            return (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="First Last"
                            value={inputValues.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={inputErrors.name ? 'border-red-500' : ''}
                            required
                        />
                        {inputErrors.name && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.name}
                            </div>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                            id="age"
                            type="number"
                            placeholder="24"
                            min={24}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={inputErrors.age ? 'border-red-500' : ''}
                            value={inputValues.age}
                            required
                        />
                        {inputErrors.age && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.age}
                            </div>
                        )}
                    </div>
                </>
            );
        }

        if (currentStep === 2) {
            return (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <select
                            id="specialization"
                            name="specialization"
                            value={inputValues.specialization}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="custom-select"
                        >
                            <option value="none">Select Specialization</option>
                            <option value="neurology">Neurology</option>
                            <option value="Orthopeadics">Orthopeadics</option>
                            <option value="Cardiology">Cardiology</option>
                            <option value="ENT">ENT</option>
                        </select>
                        {inputErrors.specialization && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.specialization}
                            </div>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="degree">Degree</Label>
                        <Input
                            id="degree"
                            type="text"
                            placeholder="MBBS(Uk), FCPS(Gynae), MS"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={inputErrors.degree ? 'border-red-500' : ''}
                            value={inputValues.degree}
                            required
                        />
                        {inputErrors.degree && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.degree}
                            </div>
                        )}
                    </div>
                </>
            );
        }

        if (currentStep === 3) {
            return (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="registrationNo">PMDC Registration No</Label>
                        <Input
                            id="registrationNo"
                            type="text"
                            placeholder="123456"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputValues.registrationNo}
                            className={inputErrors.registrationNo ? 'border-red-500' : ''}
                        />
                        {inputErrors.registrationNo && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.registrationNo}
                            </div>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input
                            id="experience"
                            type="number"
                            placeholder='1'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputValues.experience}
                            className={inputErrors.experience ? 'border-red-500' : ''}
                        />
                        {inputErrors.experience && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.experience}
                            </div>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="designation">Designation</Label>
                        <Input
                            id="designation"
                            type="text"
                            placeholder="Assoc. Professor"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputValues.designation}
                            className={inputErrors.designation ? 'border-red-500' : ''}
                        />
                        {inputErrors.designation && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.designation}
                            </div>
                        )}
                    </div>
                </>
            );
        }
    };

    return (
        <>
            <div className="grid gap-2 text-center">
                <img src={logo} alt="Logo" className="mx-auto mb-4 h-10 w-100" />
                <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
                <p className="text-balance text-muted-foreground mb-2 -mt-2">
                    Enter your complete information to continue
                </p>
            </div>

            {renderStepIndicator()}

            <form className="grid gap-4" onSubmit={handleSubmit}>
                {renderFormFields()}
                <div className="flex justify-end">
                    {currentStep > 1 && (
                        <div
                            onClick={prevStep}
                            className='cursor-pointer flex items-center text-sm mr-4 text-gray-400'
                        >
                            <FaArrowLeft className='mr-1 mt-1' size={10} /> Back
                        </div>
                    )}
                    {currentStep < totalSteps && (
                        <Button type="button" onClick={nextStep}>
                            Next Step
                        </Button>
                    )}
                    {currentStep === totalSteps && (
                        <Button type="submit">Submit</Button>
                    )}
                </div>
            </form>

            <div className="mt-4 text-center text-sm">
                <p>
                    Thinking of logging out?
                    <Button
                        onClick={handleLogout}
                        variant = 'link'
                        className="bg-transparent cursor-pointer p-1 underline text-primary ml-1"
                    >
                        Click Here
                    </Button>
                </p>
            </div>
        </>
    );
}
