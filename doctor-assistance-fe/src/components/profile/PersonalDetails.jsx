import React from 'react';
import { BiSolidError } from "react-icons/bi";
import { AiTwotoneEdit } from "react-icons/ai";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import authImage from "@/assets/images/webp/authImage.webp";

const PersonalDetails = ({ data, inputValues, handleChange, handleBlur, inputErrors }) => {

    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
    
    return (
        <div>
            <p className="text-sm mb-4 font-semibold text-primary">Personal Details:</p>

            <div className='flex items-start gap-5'>
                <div className="flex-shrink-0 grid gap-2">
                    <img
                        src={data && data.file_url ? `${baseUrl}/${data.file_url}` : authImage}
                        alt="Preview"
                        className="w-[152px] h-[152px] object-cover border border-gray-300 rounded-full"
                    />
                </div>
                <div className="flex-grow mt-20 grid gap-2">
                    <div className='flex items-center'>
                    <Label htmlFor="picture" className='text-gray-600 font-normal'>Edit Image</Label>
                    <AiTwotoneEdit size={15} className='mt-1 ml-1 text-gray-600'/>
                    </div>
                   
                    <Input
                        id="picture"
                        name="picture"
                        type="file"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`border ${inputErrors.picture ? 'border-red-500' : ''} max-w-52`}
                    />
                    {inputErrors.picture && (
                        <div aria-live="assertive" className="flex text-red-500 text-sm mt-1">
                            <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.picture}
                        </div>
                    )}
                </div>
            </div>

            <div className='md:flex mt-8 gap-5 items-baseline'>
                <div className="grid gap-2 mb-5 w-80">
                    <Label htmlFor="name" className='text-gray-700 font-normal'>Name</Label>
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
                    <Label htmlFor="birthDate" className='text-gray-700 font-normal'>Date of Birth</Label>
                    <Input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        placeholder="Enter your age..."
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={inputValues.birthDate}
                        className={`w-full border rounded-md p-2 ${inputErrors.birthDate ? 'border-red-500' : 'border-gray-300'}`}
                        required
                    />
                    {inputErrors.birthDate && (
                        <div aria-live="assertive" className="flex text-red-500 text-sm">
                            <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.birthDate}
                        </div>
                    )}
                </div>
            </div>
            
            <div className='grid gap-2 mb-3'>
                <Label className='text-gray-700 font-normal'>Gender</Label>
                <div>
                    <input
                        type="radio"
                        id="M"
                        name="gender"
                        value="M"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        checked={inputValues.gender === 'M'}
                    />
                    <Label htmlFor="M" className='ml-2 -mt-2 font-normal'>Male</Label>
                    <input
                        type="radio"
                        id="F"
                        name="gender"
                        value="F"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        className='ml-3'
                        checked={inputValues.gender === 'F'}
                    />
                    <Label htmlFor="F" className='ml-2 -mt-2 font-normal'>Female</Label>
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

export default PersonalDetails;

