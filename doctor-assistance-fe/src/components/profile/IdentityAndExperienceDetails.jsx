import React from 'react';
import { BiSolidError } from "react-icons/bi";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const IdentityAndExperienceDetails = ({ inputValues, handleChange, handleBlur, inputErrors }) => {
    return (
        <div className='grid lg:grid-cols-2 mt-7 items-baseline'>

            <div className="grid gap-2 mb-5">
                <div className='flex items-center justify-start gap-2'>
                    <Label htmlFor="experience" className='text-gray-700 font-normal'>Experience</Label>
                    <span className='text-gray-700 text-sm '>(1 year or more )</span>
                </div>

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
            <div className='grid gap-2 lg:col-span-2 mt-2'>
                <Label className='text-gray-700 font-normal'>Gender</Label>
                <div className="flex items-center mt-1 ml-4">
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

export default IdentityAndExperienceDetails;
