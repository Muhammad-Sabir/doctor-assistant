import { useEffect } from 'react';
import { toast } from 'sonner';

export const useGetRequestToasts = ({
    isFetching,
    isSuccess,
    isError,
    error,
    successMessage = 'Data fetched successfully!',
    loadingMessage = 'Loading...',
    errorMessage = 'Failed to fetch data',
}) => {
    useEffect(() => {
        let loadingToastId;
        
        if (isFetching) {
            loadingToastId = toast.loading(loadingMessage);
        } else if (isSuccess) {
            toast.dismiss(loadingToastId);
            toast.success(successMessage, {
                style: {
                    backgroundColor: '#ffffff'
                }
            });
        } else if (isError) {
            toast.dismiss(loadingToastId);
            toast.error(`${errorMessage}: ${error?.message || ''}`);
        }

        return () => {
            toast.dismiss(loadingToastId);
        };
    }, [isFetching, isSuccess, isError, error, successMessage, loadingMessage, errorMessage]);
};
