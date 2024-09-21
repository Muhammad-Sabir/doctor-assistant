import { getErrorMessage } from "@/utils/errors";
import { fetchWithAuth } from "@/utils/fetchApis";

export const useDeleteMutation = ({
    url,
    onSuccessMessage,
    onErrorMessage,
    headers = {},
    onSuccess = () => {},
    onError = () => {}
}) => {
    return useMutation({
        mutationFn: async () => {
            try {
                const fullUrl = typeof url === 'function' ? url(body) : url;
                console.log(`Sending request to ${fullUrl} with body:`, body);
                const response = await fetchWithAuth(url, {
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
            toast.success(onSuccessMessage);
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
