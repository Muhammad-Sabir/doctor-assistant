import {API_BASE_URL} from '@env'

const baseUrl = API_BASE_URL;

export const fetchApi = async (url, options = {}) => {

    console.log(`${baseUrl}/api/${url}`)
    const response = await fetch(`${baseUrl}/api/${url}`, options);

    if (response.status === 204) {
        return {
            data: null,
            status: response.status,
            statusText: response.statusText,
        };
    }

    const data = await response.json();

    if (!response.ok && response.status !== 201) {
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
        const response = await fetchApi(`user/token/refresh/`, {
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

export const fetchWithAuth = async (url, options = {}, user, setUser, router) => {

    let accessToken = user?.access_token; 
    let refreshToken = user?.refresh_token;

    if (accessToken) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`,
        };
    }

    try {
        const response = await fetchApi(url, options);
        return response;
    } catch (error) {
        if (error.status === 401) {
            console.log('Access token expired. Attempting to refresh...');

            try {
                const refreshResponse = await refreshAccessToken(refreshToken);
                if (refreshResponse.status === 200) {
                    const updatedAccessToken = refreshResponse.data.access;
                    const updatedUser = { ...user, access_token: updatedAccessToken };
                    setUser(updatedUser); 

                    options.headers['Authorization'] = `Bearer ${updatedAccessToken}`;
                    const retryResponse = await fetchApi(url, options);
                    return retryResponse;
                } else {
                    console.log('Failed to refresh access token.');
                }
            } catch (refreshError) {
                console.log('Error after refreshing token:', refreshError);
                setUser(null);
                router.replace('/login');
                throw refreshError;
            }
        } else {
            console.log(`API returned an error: ${error.status}`);
            throw error;
        }
    }
};

