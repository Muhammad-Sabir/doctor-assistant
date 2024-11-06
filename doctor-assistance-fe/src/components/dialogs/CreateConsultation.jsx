import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSolidError } from "react-icons/bi";
import { FolderPlus } from 'lucide-react';

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchWithAuth } from '@/utils/fetchApis';
import { validateField, hasNoFieldErrors } from '@/utils/validations';

export default function CreateConsultation({ patientId }) {

    const navigate = useNavigate();

    const [inputErrors, setInputErrors] = useState({});
    const [inputValues, setInputValues] = useState({ consultation_title: '' });

    const createConsultationMutation = useCreateUpdateMutation({
        url: `consultations/`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithAuth,
        onSuccessMessage: 'Consultation Successfully Created',
        onErrorMessage: 'Failed to Create Consultation',
        onSuccess: (responseData) => {
            setTimeout(() => {
                navigate(`/doctor/consultation/${patientId}/${responseData.data.id}`);
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
        const { consultation_title } = inputValues;
        createConsultationMutation.mutate(JSON.stringify({ title: consultation_title, patient: patientId }))
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <span >
                    <FolderPlus className='text-green-500 mt-0.5 ml-1' size={18} />
                </span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Consultation</DialogTitle>
                    <DialogDescription>
                        Add Title for the consultation. Click Create when done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="consultation_title" className='text-gray-700 font-normal'>Name</Label>
                        <Input
                            id="consultation_title"
                            name='consultation_title'
                            type="text"
                            placeholder="Enter consultation title..."
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputValues.consultation_title}
                            className={inputErrors.consultation_title ? 'border-red-500' : ''}
                            required
                        />
                        {inputErrors.consultation_title && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.consultation_title}
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
