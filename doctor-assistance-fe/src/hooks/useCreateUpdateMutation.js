import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

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
                const fullUrl = typeof url === 'function' ? url(body) : url;
                console.log(`Sending request to ${fullUrl} with body:`, body);
                const response = await fetchFunction(fullUrl, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        ...headers,
                    },
                    body: JSON.stringify(body),
                });
                console.log('Response:', response);
                return response;
            } catch (error) {
                console.error('Request failed:', error);
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
