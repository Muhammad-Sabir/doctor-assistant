import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { BiSolidError } from 'react-icons/bi';
import { AiTwotoneEdit } from "react-icons/ai";

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchWithAuth } from '@/utils/fetchApis';
import { validateField, hasNoFieldErrors } from '@/utils/validations';

export default function UpdateReview({ doctorName, review }) {
    const [inputErrors, setInputErrors] = useState({});
    const [inputValues, setInputValues] = useState({ comment: '', rating: 0 });
    const [hoverRating, setHoverRating] = useState(0);

    const updateReviewMutation = useCreateUpdateMutation({
        url: `reviews/${review.id}/`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithAuth,
        onSuccessMessage: 'Review Successfully Updated',
        onErrorMessage: 'Failed to Update Review',
        onSuccess: () => {
            setTimeout(() => {
                window.location.reload();
            }, 300);
        },
    });

    useEffect(() => {
        setInputValues({ comment: review.comment, rating: review.rating });
    }, [review]);

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
        updateReviewMutation.mutate(JSON.stringify({ doctor: review.doctorId, comment, rating })); 
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
            <span> 
                <AiTwotoneEdit size={16} className='mt-0.5 ml-1 text-gray-500'/>
            </span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Review</DialogTitle>
                    <DialogDescription>
                        Update Review for {doctorName}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                    <div className="flex flex-col gap-2">
                        <p className='text-gray-700 text-sm font-normal'>Rating</p>
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    size={24}
                                    className={`cursor-pointer mx-1 ${inputValues.rating >= star || hoverRating >= star
                                        ? 'text-yellow-500' : 'text-gray-300'}`}
                                    onClick={() => handleStarClick(star)}
                                    onMouseEnter={() => setHoverRating(star)} 
                                    onMouseLeave={() => setHoverRating(0)} 
                                />
                            ))}
                        </div>
                        {inputErrors.rating && (
                            <div className="flex items-center text-red-500 text-sm">
                                <BiSolidError color='red' className="mr-1" /> {inputErrors.rating}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="comment" className="text-gray-700 font-normal">Comment</Label>
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
                    <Button type="button" onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}