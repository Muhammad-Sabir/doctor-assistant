import React, { useState, useEffect } from 'react';
import { BiSolidError } from "react-icons/bi";
import { AiTwotoneEdit } from 'react-icons/ai';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { validateField, hasNoFieldErrors, validateAllFields } from '@/utils/validations';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchWithAuth } from '@/utils/fetchApis';
import { relationshipOptions } from '@/assets/data/relationshipOptions';

const UpdateDependent = ({ selectedDependent }) => {
    
    const [inputErrors, setInputErrors] = useState({});
    const [dependent, setDependent] = useState(selectedDependent);

    const updateDependentMutation = useCreateUpdateMutation({
        url: `dependents/${dependent.id}/`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithAuth,
        onSuccessMessage: 'Dependent Successfully Updated',
        onErrorMessage: 'Dependent Update Failed',
        onSuccess: () => {
            setTimeout(() => {
                window.location.reload();
            }, 300);
        }
    });

    useEffect(() => {
        setDependent(selectedDependent);
    }, [selectedDependent]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDependent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleBlur = (e) => {
        const { id, value } = e.target;
        const errors = validateField(id, value, inputErrors);
        setInputErrors(errors);
    };

    const handleSelectChange = (value) => {
        setDependent((prev) => ({ ...prev, relationship: value }));
        const errors = validateField("relationship", value, inputErrors);
        setInputErrors(errors);
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        const errors = validateAllFields(dependent, inputErrors);
        setInputErrors(errors);

        if (hasNoFieldErrors(errors)) {
            const { name, date_of_birth, gender, relationship } = dependent;
            updateDependentMutation.mutate(JSON.stringify({ name, date_of_birth, gender, relationship }));
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <span onClick={() => setDependent(selectedDependent)}>
                    <AiTwotoneEdit size={16} className='mt-0.5 ml-1 text-primary' />
                </span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Dependent Details</DialogTitle>
                    <DialogDescription>
                        Update Details for Your Dependent. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className='text-gray-700 font-normal'>Name</Label>
                        <Input
                            id="name"
                            name='name'
                            type="text"
                            value={dependent.name}
                            placeholder="Enter dependent's name..."
                            onChange={handleChange}
                            onBlur={handleBlur}
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
                        <Label htmlFor="dependentbirthDate" className='text-gray-700 font-normal'>Date of Birth</Label>
                        <Input
                            id="dependentbirthDate"
                            name="date_of_birth"
                            type="date"
                            value={dependent.date_of_birth}
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
                                checked={dependent.gender === "M"}
                                onChange={handleChange}
                            />
                            <Label htmlFor="M" className='ml-2 font-normal'>Male</Label>
                            <input
                                type="radio"
                                id="F"
                                name="gender"
                                value="F"
                                checked={dependent.gender === "F"}
                                onChange={handleChange}
                                className='ml-6'
                            />
                            <Label htmlFor="F" className='ml-2 font-normal'>Female</Label>
                        </div>
                        <div className="grid gap-2 mt-0.5">
                        <Label htmlFor="relationship" className='text-gray-700 font-normal'>Relationship</Label>
                        <div className="text-gray-500">
                            <Select value={dependent.relationship} onValueChange={handleSelectChange}>
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
                        <Button type="button" onClick={handleSubmit}>Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateDependent;
