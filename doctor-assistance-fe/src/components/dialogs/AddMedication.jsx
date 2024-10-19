import React, { useState } from 'react';
import { BiSolidError } from "react-icons/bi";

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { validateField, hasNoFieldErrors } from '@/utils/validations';

export default function AddMedication() {

    const [inputErrors, setInputErrors] = useState({});
    const [inputValues, setInputValues] = useState({ name: '', dosage: '', frequency: '' });

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
        console.log(inputValues)
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='mr-3 actionButton'>Add New</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Medication</DialogTitle>
                    <DialogDescription>
                        Add Medication for the patient. Click Add when done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="medication_name" className='text-gray-700 font-normal'>Name</Label>
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
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.medication_name}
                            </div>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="medication_dosage" className='text-gray-700 font-normal'>Dosage</Label>
                        <Input
                            id="medication_dosage"
                            name='dosage'
                            type="text"
                            placeholder="Enter medication dosage..."
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputValues.dosage}
                            className={inputErrors.medication_dosage ? 'border-red-500' : ''}
                            required
                        />
                        {inputErrors.medication_dosage && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.medication_dosage}
                            </div>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="medication_frequency" className='text-gray-700 font-normal'>Freuqency</Label>
                        <Input
                            id="medication_frequency"
                            name='frequency'
                            type="text"
                            placeholder="Enter medication Frequency..."
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputValues.frequency}
                            className={inputErrors.medication_frequency ? 'border-red-500' : ''}
                            required
                        />
                        {inputErrors.medication_frequency && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.medication_frequency}
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
