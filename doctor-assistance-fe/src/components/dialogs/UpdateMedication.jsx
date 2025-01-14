import React, { useState, useEffect } from 'react';
import { BiSolidError } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { AiTwotoneEdit } from 'react-icons/ai';

export default function UpdateMedication({ medicine, onUpdate }) {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [inputErrors, setInputErrors] = useState({});
    const [inputValues, setInputValues] = useState({ medicine_name: '', instruction: '' });

    useEffect(() => {
        if (medicine) {
            setInputValues({
                medicine_name: medicine.medicine_name || '',
                instruction: medicine.instruction || '',
            });
        }
    }, [medicine]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const updatedErrors = validateField(name, value, inputErrors);
        setInputErrors(updatedErrors);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!hasNoFieldErrors(inputErrors)) {
            return;
        }
        onUpdate({
            medicine_name: inputValues.medicine_name.trim(),
            instruction: inputValues.instruction.trim(),
        });
        setIsDialogOpen(false);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <span>
                    <AiTwotoneEdit size={16} className="actionButton mt-0.5 ml-1 text-gray-500" />
                </span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Medication</DialogTitle>
                    <DialogDescription>Update the medication details for the patient.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="medication_name" className='font-normal text-gray-700'>Name</Label>
                        <Input
                            id="medicine_name"
                            name='medicine_name'
                            type="text"
                            placeholder="Enter medication name..."
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputValues.medicine_name}
                            className={inputErrors.medicine_name ? 'border-red-500' : ''}
                            required
                        />
                        {inputErrors.medicine_name && (
                            <div aria-live="assertive" className="flex text-sm text-red-500">
                                <BiSolidError color='red' className="mt-1 mr-1" /> {inputErrors.medicine_name}
                            </div>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="instruction" className='font-normal text-gray-700'>Instruction</Label>
                        <Input
                            id="instruction"
                            name='instruction'
                            type="text"
                            placeholder="Enter instruction..."
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputValues.instruction}
                            className={inputErrors.instruction ? 'border-red-500' : ''}
                            required
                        />
                        {inputErrors.instruction && (
                            <div aria-live="assertive" className="flex text-sm text-red-500">
                                <BiSolidError color='red' className="mt-1 mr-1" /> {inputErrors.instruction}
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
