import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { BiSolidError } from "react-icons/bi";

import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchWithAuth } from '@/utils/fetchApis';
import { validateField, hasNoFieldErrors } from '@/utils/validations';

export default function AddReview({ doctorId, doctorName }) {
    const [inputErrors, setInputErrors] = useState({});
    const [inputValues, setInputValues] = useState({ comment: '', rating: 0 });
    const [hoverRating, setHoverRating] = useState(0);

    const addReviewMutation = useCreateUpdateMutation({
        url: `reviews/`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithAuth,
        onSuccessMessage: 'Review Successfully Added',
        onErrorMessage: 'Failed to Add Review',
        onSuccess: () => {
            setTimeout(() => {
                window.location.reload();
            }, 300);
        },
    });

    const resetForm = () => {
        setInputValues({ comment: '', rating: 0 });
        setInputErrors({});
    };

    const handleStarClick = (ratingValue) => {
        setInputValues((prevValues) => {
            const newRating = prevValues.rating === ratingValue ? 0 : ratingValue;
            const errors = validateField('rating', newRating, inputErrors);
            setInputErrors(errors);
            return { ...prevValues, rating: newRating };
        });
    };


    const handleBlur = (e) => {
        const { id, value } = e.target;
        const errors = validateField(id, value, inputErrors);
        setInputErrors(errors);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setInputValues((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!hasNoFieldErrors(inputErrors)) {
            return;
        }

        const { rating, comment } = inputValues;
        addReviewMutation.mutate(JSON.stringify({ doctor: doctorId, comment, rating }));
    };

    return (
        <Dialog onOpenChange={(open) => !open && resetForm()}>
            <DialogTrigger asChild>
                <Button className="-mt-1">Add Review</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Review</DialogTitle>
                    <DialogDescription>
                        Add Review For {doctorName}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                    <div className="flex flex-col gap-2">
                        <p className='text-gray-700 text-sm font-normal'>Rating</p>
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar key={star} size={24}
                                    className={`cursor-pointer mx-1 ${inputValues.rating >= star || hoverRating >= star
                                        ? 'text-yellow-500' : 'text-gray-300'}`}
                                    onClick={() => handleStarClick(star)}
                                    onMouseEnter={() => setHoverRating(star)} 
                                    onMouseLeave={() => setHoverRating(0)} />
                            ))}
                        </div>
                        {inputErrors.rating && (
                            <div className="flex items-center text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1" /> {inputErrors.rating}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="comment" className='text-gray-700 font-normal'>Comment</Label>
                        <textarea
                            id="comment"
                            value={inputValues.comment}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`${inputErrors.comment ? 'border-red-500' : ''}`}
                            rows="4"
                            placeholder="Write your review..."
                        />
                        {inputErrors.comment && (
                            <div className="flex items-center text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1" /> {inputErrors.comment}
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
