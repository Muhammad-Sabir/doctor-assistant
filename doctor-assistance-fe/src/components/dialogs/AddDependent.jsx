import React, { useState } from 'react';
import { BiSolidError } from "react-icons/bi";

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchWithAuth } from '@/utils/fetchApis';
import { validateField, hasNoFieldErrors } from '@/utils/validations';

export default function AddDependent() {
    const [inputErrors, setInputErrors] = useState({});
    const [inputValues, setInputValues] = useState({ name: '', birthDate: '', gender: 'M' });

    const addDependentMutation = useCreateUpdateMutation({
        url: `dependents/`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithAuth,
        onSuccessMessage: 'Dependent Successfully Added',
        onErrorMessage: 'Failed to Add Dependent',
        onSuccess: () => {
            setTimeout(() => {
                window.location.reload();
            }, 300); 
        }
    });

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
        addDependentMutation.mutate(JSON.stringify({ name, date_of_birth: birthDate, gender }))
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className='flex justify-end mt-3'>
                    <Button type="submit" onSubmit={handleSubmit}>Add New</Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Dependent</DialogTitle>
                    <DialogDescription>
                        Add Details for your dependent. Click Add when done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className='text-gray-700 font-normal'>Name</Label>
                        <Input
                            id="name"
                            name='name'
                            type="text"
                            placeholder="Enter dependent's name..."
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
                    <div className="grid gap-2">
                        <Label htmlFor="dependentbirthDate" className='text-gray-700 font-normal'>Date of Birth</Label>
                        <Input
                            id="dependentbirthDate"
                            name="birthDate"
                            type="date"
                            value={inputErrors.birthDate}
                            className={`${inputErrors.dependentbirthDate ? 'border-red-500' : ''}`}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            required
                        />
                        {inputErrors.dependentbirthDate && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.dependentbirthDate}
                            </div>
                        )}
                    </div>
                    <div className='grid gap-2 mt-0.5'>
                        <Label className='text-gray-700 font-normal'>Gender</Label>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="M"
                                name="gender"
                                value="M"
                                checked={inputValues.gender === "M"}
                                onChange={handleChange}
                            />
                            <Label htmlFor="M" className='ml-2 font-normal'>Male</Label>
                            <input
                                type="radio"
                                id="F"
                                name="gender"
                                value="F"
                                checked={inputValues.gender === "F"}
                                onChange={handleChange}
                                className='ml-6'
                            />
                            <Label htmlFor="F" className='ml-2 font-normal'>Female</Label>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
