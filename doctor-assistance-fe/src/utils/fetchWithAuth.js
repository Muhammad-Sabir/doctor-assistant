import { fetchApi } from '@/utils/fetchApi';
import { useRefreshToken } from '@/hooks/auth/useRefreshToken';

export const fetchWithAuth = async (url, options = {}) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let accessToken = user.access_token; 
    const refreshToken = user.refresh_token;

    if (accessToken) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`,
        };
    }

    try {
        let response = await fetchApi(url, options);

        if (response.status === 401) {
            console.log('Access token expired. Attempting to refresh...');

            // Call the refresh token hook
            const refreshTokenMutation = useRefreshToken();
            const refreshResponse = await refreshTokenMutation.mutateAsync({ refresh: refreshToken });

            // Update localStorage with the new access token
            const updatedAccessToken = refreshResponse.data.access;
            const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
            updatedUser.access_token = updatedAccessToken;
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Update the Authorization header with the new access token
            options.headers['Authorization'] = `Bearer ${updatedAccessToken}`;
            response = await fetchApi(url, options);
        }

        return response.data;

    } catch (error) {
        throw error;
    }
};
