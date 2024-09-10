import { fetchApi } from '@/utils/fetchApi';
import { refreshAccessToken } from './refreshAccessToken';

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

            // Refresh the token
            const refreshResponse = await refreshAccessToken(refreshToken);

            // Update localStorage with the new access token
            const updatedAccessToken = refreshResponse.data.access;
            const updatedUser = { ...user, access_token: updatedAccessToken };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Retry the request with the new access token
            options.headers['Authorization'] = `Bearer ${updatedAccessToken}`;
            response = await fetchApi(url, options);
        }

        return response.data;

    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
};
