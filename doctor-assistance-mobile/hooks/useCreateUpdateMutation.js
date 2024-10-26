import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner-native';

import { getErrorMessage } from '@/utils/errors';

export const useCreateUpdateMutation = ({
    url,
    method,
    fetchFunction,
    onSuccessMessage,
    onErrorMessage,
    headers = {},
    onSuccess = () => { },
    onError = () => { }
}) => {
    return useMutation({
        mutationFn: async (body) => {
            try {
                console.log(`Sending request to ${url} with body:`, body);
                const response = await fetchFunction(url, {
                    method,
                    headers: {
                        ...headers,
                    },
                    body: body,
                });
                console.log('Response:', response);
                return response;
            } catch (error) {
                throw error;
            }
        },
        onMutate: () => {
            toast.loading('Processing...', { id: `${url}-loading` });
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
