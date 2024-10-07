import React, { useState, useEffect } from 'react';
import SearchField from '../shared/SearchFeild';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RiAddLine } from "react-icons/ri";

export default function AddAllergyDialog() {
    const [inputErrors, setInputErrors] = useState({});
    const [inputValues, setInputValues] = useState({ allergies: [] });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(inputValues);
    };

    const handleDialogOpenChange = () => {
        setIsDialogOpen(prev => {
            if (!prev) {
                setInputValues({ allergies: [] });
            }
            return !prev;
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
                <span className='mt-6 cursor-pointer flex text-xs font-medium text-primary underline justify-start items-center'>
                    <RiAddLine className='mr-2' />Add Allergies
                </span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Allergy</DialogTitle>
                    <DialogDescription>
                        Add Allergy for your patient.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                    <SearchField
                        placeholder="Allergy"
                        onSelect={(selectedAllergies) => setInputValues(prev => ({
                            ...prev,
                            allergies: selectedAllergies
                        }))}
                        inputValues={inputValues.allergies}
                        setInputError={setInputErrors}
                        inputErrors={inputErrors}
                        id="allergies"
                        labelClassName='text-gray-700 font-normal'
                        singleSelect={true}
                    />
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
