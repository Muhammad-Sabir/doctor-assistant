import React, { useState, useEffect } from 'react';
import { CiEdit } from "react-icons/ci";

import { Input } from '@/components/ui/input';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';

export default function EditableTitle({ consultationId }) {

    const [title, setTitle] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const { data: consultationData, isFetching, isError, error } = useFetchQuery({
        url: `consultations/${consultationId}/`,
        queryKey: ['consultationDetails', consultationId],
        fetchFunction: fetchWithAuth,
        enabled: !!consultationId,
    });

    const updateTitleMutation = useCreateUpdateMutation({
        url: `consultations/${consultationId}/`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithAuth,
        onSuccessMessage: 'Consultation Tilte Successfully Updated',
        onErrorMessage: 'Failed to Update Consultation Title'
    });

    useEffect(() => {
        if (consultationData) {
            setTitle(consultationData.title);
        }
    }, [consultationData]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
        console.log(title)
        updateTitleMutation.mutate(JSON.stringify({ title }))
    };

    const toggleEditing = () => {
        setIsEditing((prev) => !prev);
    };

    return (
        <>
            {isFetching ? (
                <div className="text-primary-500 text-sm">Loading...</div>
            ) : isError ? (
                <div className="text-red-500">Error: {error.message}</div>
            ) : isEditing ? (
                <Input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    onBlur={handleBlur}
                    className="text-md font-semibold text-primary w-40 truncate block sm:w-94 lg:w-102 focus-visible:outline-0 focus-visible:ring-0 focus-visible:border-0"
                    autoFocus
                />
            ) : (
                <p
                    className="text-md font-semibold text-primary w-40 truncate block sm:w-94 lg:w-102"
                    onClick={toggleEditing}
                >
                    <CiEdit className='text-gray-500 inline -mt-1 mr-1' size={20} /> Title: {title}
                </p>
            )}
        </>
    )
}
