import { fetchApi } from '@/utils/fetchApi';

export const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await fetchApi('token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });
        return response;
    } catch (error) {
        throw new Error('Token refresh failed');
    }
};
