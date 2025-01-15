import React from 'react';
import { BiSolidError } from "react-icons/bi";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BasicDetails = ({ inputValues, handleChange, handleBlur, inputErrors }) => {
    return (
        <div className='mb-8'>
            <div className='grid lg:grid-cols-2 gap-5 mt-7 items-baseline'>
                <div className="grid gap-2 mb-2 lg:mb-5">
                    <Label htmlFor="name" className='text-gray-700 font-normal'>Name</Label>
                    <Input
                        id="name"
                        name='name'
                        type="text"
                        placeholder="Enter your full name (First and Last)"
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
                    <div className='flex items-center justify-start gap-2'>
                        <Label htmlFor="doctorBirthDate" className='text-gray-700 font-normal'>Date of Birth</Label>
                        <span className='text-gray-700 text-sm '>(20 or older )</span>
                    </div>
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
                <div className="grid gap-2 mb-2 lg:mb-5 -mt-3">
                    <Label htmlFor="registrationNo" className='text-gray-700 font-normal'>PMDC Registration No</Label>
                    <Input
                        id="registrationNo"
                        name="registrationNo"
                        type="text"
                        className='bg-gray-200 cursor-not-allowed'
                        placeholder="Enter your registration number..."
                        readOnly
                        value={inputValues.registrationNo || ''}
                    />
                </div>
            </div>
        </div>
    );
};

export default BasicDetails;
