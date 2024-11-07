import React, { useState } from 'react';
import { BiSolidError } from "react-icons/bi";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchWithAuth } from '@/utils/fetchApis';
import { validateField, hasNoFieldErrors, validateAllFields } from '@/utils/validations';
import { relationshipOptions } from '@/assets/data/relationshipOptions';

export default function AddDependent() {
    const [inputErrors, setInputErrors] = useState({});
    const [inputValues, setInputValues] = useState({ name: '', dependentbirthDate: '', gender: 'M', relationship: '' });

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

    const handleSelectChange = (value) => {
        setInputValues((prev) => ({ ...prev, relationship: value }));
        const errors = validateField("relationship", value, inputErrors);
        setInputErrors(errors);
    };

    const handleBlur = (e) => {
        const { id, value } = e.target;
        const errors = validateField(id, value, inputErrors);
        setInputErrors(errors);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const errors = validateAllFields(inputValues, inputErrors);
        setInputErrors(errors);

        if (hasNoFieldErrors(errors)) {
            const { name, dependentbirthDate, gender, relationship } = inputValues;
            addDependentMutation.mutate(JSON.stringify({ name, date_of_birth: dependentbirthDate, gender, relationship }));
        }    
    };

    const handleDialogClose = () => {
        setInputValues({ name: '', dependentbirthDate: '', gender: 'M', relationship: '' });
        setInputErrors({});
    };

    return (
        <Dialog onOpenChange={handleDialogClose}>
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
                            name="dependentbirthDate"
                            type="date"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputValues.dependentbirthDate}
                            className={`${inputErrors.dependentbirthDate ? 'border-red-500' : ''}`}
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

                    <div className="grid gap-2 mt-0.5">
                        <Label htmlFor="relationship" className='text-gray-700 font-normal'>Relationship</Label>
                        <div className="text-gray-500">
                            <Select onValueChange={handleSelectChange}>
                                <SelectTrigger id="relationship" className={`${inputErrors.relationship ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="Select dependent relationship (dependent is the)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {relationshipOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {inputErrors.relationship && (
                                <div aria-live="assertive" className="flex text-red-500 text-sm mt-2">
                                    <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.relationship}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
