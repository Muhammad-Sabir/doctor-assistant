import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Pressable, Dimensions } from 'react-native';
import { StarIcon, X, TriangleAlert, Pencil } from 'lucide-react-native';

import { useAuth } from '@/contexts/AuthContext';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { useQueryClient } from '@tanstack/react-query';

export default function UpdateReview({ doctorName, review }) {

    const { fetchWithUserAuth } = useAuth();
    const queryClient = useQueryClient();
    const screenWidth = Dimensions.get('window').width;

    const [inputValues, setInputValues] = useState({ comment: '', rating: 0 });
    const [hoverRating, setHoverRating] = useState(0);
    const [inputErrors, setInputErrors] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);

    const updateReviewMutation = useCreateUpdateMutation({
        url: `reviews/${review.id}/`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithUserAuth,
        onSuccessMessage: 'Review Successfully Updated',
        onErrorMessage: 'Failed to Update Review',
        onSuccess: () => {
            queryClient.invalidateQueries(['myReviews', review]);
        },
    });

    const setReview = () =>{
        setInputValues({ comment: review.comment, rating: review.rating });
    }

    useEffect(() => {
        setReview();
    }, [review]);

    const handleStarClick = (ratingValue) => {
        setInputValues((prevValues) => {
            const newRating = prevValues.rating === ratingValue ? 0 : ratingValue;
            const errors = validateField('rating', newRating, inputErrors);
            setInputErrors(errors);
            return { ...prevValues, rating: newRating };
        });
    };

    const handleBlur = (id, value) => {
        const errors = validateField(id, value, inputErrors);
        setInputErrors(errors);
    };

    const handleChange = (id, value) => {
        setInputValues((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = () => {
        if (!hasNoFieldErrors(inputErrors)) {
            return;
        }

        const { rating, comment } = inputValues;
        updateReviewMutation.mutate(JSON.stringify({ doctor: review.doctorId, comment, rating }));

        setIsModalVisible(false);
    };

    return (
        <View>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <Pencil color='grey' size={15} />
            </TouchableOpacity>

            <Modal animationType="slide" transparent={true} visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(false);
                }}
            >
                <View className='flex-1 relative items-center justify-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                    <View className="bg-white rounded-md p-5" style={{ width: screenWidth * 0.91 }} >

                        <View className='flex flex-row justify-between'>
                            <Text className="text-xl font-bold text-primary mb-1">Update Review</Text>
                            <Pressable onPress={() => {
                                setIsModalVisible(false);
                                setReview();
                                setInputErrors({});
                            }}>
                                <X size={24} color="grey" />
                            </Pressable>
                        </View>

                        <Text className="text-md text-gray-500 mb-4">Update Review for {doctorName}</Text>

                        <View className='mb-3 mt-3'>
                            <Text className="text-gray-700 text-base mb-2">Rating</Text>
                            <View className="flex-row mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <TouchableOpacity key={star}
                                        onPress={() => handleStarClick(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        <StarIcon size={24} style={{
                                            marginHorizontal: 4,
                                            color: inputValues.rating >= star || hoverRating >= star ? '#F59E0B' : '#D1D5DB',
                                        }}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {inputErrors.rating && (
                                <View className="flex flex-row items-center text-red-500 text-sm gap-2">
                                    <TriangleAlert size={13} color="red" />
                                    <Text className='text-sm text-red-500'>{inputErrors.rating} </Text>
                                </View>
                            )}
                        </View>

                        <View className='mb-3'>
                            <Text className="text-gray-700 text-base mb-2">Comment</Text>
                            <TextInput
                                value={inputValues.comment}
                                onChangeText={(value) => handleChange("comment", value)}
                                onBlur={() => handleBlur("comment", inputValues.comment)}
                                placeholder="Write your review..."
                                className={`border p-2 rounded-lg mb-2 ${inputErrors.comment ? 'border-red-500' : 'border-gray-300'}`}
                                multiline numberOfLines={4} textAlignVertical="top"
                            />
                            {inputErrors.comment && (
                                <View className="flex flex-row items-center text-red-500 text-sm gap-2">
                                    <TriangleAlert size={13} color="red" />
                                    <Text className='text-sm text-red-500'>{inputErrors.comment} </Text>
                                </View>
                            )}
                        </View>

                        <View className="flex-row justify-end mt-4">
                            <TouchableOpacity
                                onPress={() => {
                                    setIsModalVisible(false);
                                    setReview();
                                    setInputErrors({});
                                }}
                                className="mr-4 bg-gray-200 px-4 py-2 rounded-md"
                            >
                                <Text className="text-gray-700">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSubmit} className="bg-primary px-4 py-2 rounded-md">
                                <Text className="text-white font-bold">Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
