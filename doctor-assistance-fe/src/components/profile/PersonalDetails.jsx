import React from 'react';
import { BiSolidError } from "react-icons/bi";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PersonalDetails = ({ inputValues, handleChange, handleBlur, inputErrors }) => {
    return (
        <div className='mb-8'>
            <div className='grid lg:grid-cols-2 gap-5 mt-7 items-baseline'>
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
                    <Label htmlFor="doctorBirthDate" className='text-gray-700 font-normal'>Date of Birth</Label>
                    <Input
                        id="doctorBirthDate"
                        name="doctorBirthDate"
                        type="date"
                        placeholder="Enter your age..."
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={inputValues.doctorBirthDate}
                        className={`${inputErrors.doctorBirthDate ? 'border-red-500' : ''}`}
                        required
                    />
                    {inputErrors.doctorBirthDate && (
                        <div aria-live="assertive" className="flex text-red-500 text-sm">
                            <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.doctorBirthDate}
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
    );
};

export default PersonalDetails;
