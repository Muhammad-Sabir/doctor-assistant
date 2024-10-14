import React, { useState } from 'react';

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchWithAuth } from '@/utils/fetchApis';
import SearchField from '@/components/shared/SearchFeild';

export default function AddAllergy({ triggerElement, patientId }) {
    const [inputErrors, setInputErrors] = useState({});
    const [inputValues, setInputValues] = useState({ allergies: [] });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const addAllergyMutation = useCreateUpdateMutation({
        url: `patient-allergies/`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithAuth,
        onSuccessMessage: 'Allergy Successfully Added',
        onErrorMessage: 'Failed to Add Allergy',
        onSuccess: () => {
            setTimeout(() => {
                window.location.reload();
            }, 300);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(inputValues);
        addAllergyMutation.mutate(JSON.stringify({
            allergy: { name: inputValues.allergies[0].name },
            patient: patientId
        }))
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
                {triggerElement}
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
