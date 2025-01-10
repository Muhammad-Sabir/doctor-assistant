import React, { useEffect, useState } from 'react';
import { BiSolidError } from "react-icons/bi";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { AiTwotoneEdit } from 'react-icons/ai';

export default function UpdateMedication({ medication }) {

    const [inputErrors, setInputErrors] = useState({});
    const [inputValues, setInputValues] = useState({ name: '', instruction: '' });

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
        console.log(inputValues);
    };

    useEffect(() => {
        setInputValues({ name: medication.name, instruction: medication.instruction });
    }, [medication]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <span>
                    <AiTwotoneEdit size={16} className='actionButton mt-0.5 ml-1 text-gray-500' />
                </span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Medication</DialogTitle>
                    <DialogDescription>
                        Update Medication for patient
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="medication_name" className='font-normal text-gray-700'>Name</Label>
                        <Input
                            id="medication_name"
                            name='name'
                            type="text"
                            placeholder="Enter medication name..."
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputValues.name}
                            className={inputErrors.medication_name ? 'border-red-500' : ''}
                            required
                        />
                        {inputErrors.medication_name && (
                            <div aria-live="assertive" className="flex text-sm text-red-500">
                                <BiSolidError color='red' className="mt-1 mr-1" /> {inputErrors.medication_name}
                            </div>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="medication_instruction" className='font-normal text-gray-700'>Instruction</Label>
                        <Input
                            id="medication_instruction"
                            name='instruction'
                            type="text"
                            placeholder="Enter medication instruction..."
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputValues.instruction}
                            className={inputErrors.medication_instruction ? 'border-red-500' : ''}
                            required
                        />
                        {inputErrors.medication_instruction && (
                            <div aria-live="assertive" className="flex text-sm text-red-500">
                                <BiSolidError color='red' className="mt-1 mr-1" /> {inputErrors.medication_instruction}
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Update</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
