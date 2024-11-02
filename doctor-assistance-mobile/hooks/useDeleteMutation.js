import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner-native';

import { getErrorMessage } from "@/utils/errors";

export const useDeleteMutation = ({
    url,
    onSuccessMessage,
    fetchFunction,
    onErrorMessage,
    headers = {},
    onSuccess = () => {},
    onError = () => {}
}) => {
    return useMutation({
        mutationFn: async () => {
            console.log(`Sending request to ${url}`);
            try {
                const response = await fetchFunction(url, {
                    method: 'DELETE',
                    headers: {
                        ...headers,
                    },
                });
                return response;
            } catch (error) {
                throw error;
            }
        },
        onMutate: () => {
            toast.loading('Deleting...', { id: `${url}-loading` });
        },
        onSuccess: (data) => {
            toast.dismiss(`${url}-loading`);
            toast.success(onSuccessMessage, {
                style: {
                    backgroundColor: '#ffffff'
                }
            });
            onSuccess(data);
        },
        onError: (error) => {
            toast.dismiss(`${url}-loading`);
            const errorMessage = getErrorMessage(error);
            toast.error(`${onErrorMessage}: ${errorMessage}`);
            onError(error);
        },
    });
};