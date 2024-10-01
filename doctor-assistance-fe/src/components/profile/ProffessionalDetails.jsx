import React from 'react';
import { BiSolidError } from "react-icons/bi";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ProfessionalDetails = ({ inputValues, handleChange, handleBlur, inputErrors }) => {
    return (
        <div>
            <hr className="border-t mt-3 border-gray-300" />
            <p className="text-sm mb-4 mt-5 font-semibold text-primary">Professional Details:</p>

            <div className='grid lg:grid-cols-2 gap-5 mt-5 items-baseline'>
                <div className="grid gap-2 mb-5">
                    <Label htmlFor="registrationNo" className='text-gray-700 font-normal'>PMDC Registration No</Label>
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

                <div className="grid gap-2 mb-5">
                    <Label htmlFor="experience" className='text-gray-700 font-normal'>Experience (in years)</Label>
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
            </div>
        </div>
    );
};

export default ProfessionalDetails;
