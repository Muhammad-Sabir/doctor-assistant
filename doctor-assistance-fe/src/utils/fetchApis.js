import { getAuthStatus } from '@/utils/auth';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchApi = async (url, options = {}) => {

    const response = await fetch(`${baseUrl}/${url}`, options);
    const data = await response.json();

    if (!response.ok) {
        const errorMessage = data?.non_field_errors?.[0] || data.message || 'An error occurred';
        const error = new Error(errorMessage);
        error.status = response.status;
        error.response = data;
        throw error;
    }

    return {
        data,
        status: response.status,
        statusText: response.statusText,
    };
};

const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await fetchApi(`${baseUrl}/token/refresh/`, {
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

export const fetchWithAuth = async (url, options = {}) => {
    const { user } = getAuthStatus();
    let accessToken = user.access_token;
    let refreshToken = user.refresh_token;

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
        return response;

    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
};
