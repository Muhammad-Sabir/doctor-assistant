import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCustomMutation = ({
    url,
    method = 'POST',
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
            let errorMessage = 'An unexpected error occurred';
            if (error.status === 401) {
                errorMessage = 'Unauthorized: Invalid credentials';
            } else if (error.response) {
                errorMessage = error.response.non_field_errors?.[0] || error.response.message || 'An error occurred';
            }
            toast.error(`${onErrorMessage}: ${errorMessage}`);
            onError(error);
        },
    });
};
