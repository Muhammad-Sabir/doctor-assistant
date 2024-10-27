import { useQuery } from '@tanstack/react-query';

export const useFetchQuery = ({
    url,
    queryKey,
    fetchFunction,
    enabled = true,
}) => {
    return useQuery({
        queryKey,
        queryFn: async () => {
            try {
                console.log("sending request to url:", url);
                const response = await fetchFunction(url);
                return response.data;
            } catch (error) {
                console.error('Error fetching data:', error);
                throw error;
            }
        },
        enabled,
        onSuccess: (data) => {
            return data;
        },
        onError: (error) => {
            console.error(error.message); 
        },
    });
};
