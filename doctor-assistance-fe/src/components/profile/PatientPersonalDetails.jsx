import React from 'react';
import { BiSolidError } from "react-icons/bi";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


const PatientPersonalDetails = ({ inputValues, handleChange, handleBlur, inputErrors }) => {

    return (
        <div>
            <p className="text-sm mb-4 font-semibold text-primary">Personal Details:</p>

            <div className='grid lg:grid-cols-2 gap-5 items-baseline'>
                <div className="grid gap-2 mb-5">
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
                <div className="grid gap-2 mb-5">
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

            <div className='grid gap-2 mt-1'>
                <Label className='text-gray-700 font-normal'>Gender</Label>
                <div className="flex items-center">
                    <input
                        type="radio"
                        id="M"
                        name="gender"
                        value="M"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        checked={inputValues.gender === 'M'}
                    />
                    <Label htmlFor="M" className='ml-2 font-normal'>Male</Label>
                    <input
                        type="radio"
                        id="F"
                        name="gender"
                        value="F"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        className='ml-6'
                        checked={inputValues.gender === 'F'}
                    />
                    <Label htmlFor="F" className='ml-2 font-normal'>Female</Label>
                </div>
                {inputErrors.gender && (
                    <div aria-live="assertive" className="flex text-red-500 text-sm">
                        <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.gender}
                    </div>
                )}
            </div>
            
        </div>
    );
};

export default PatientPersonalDetails;
