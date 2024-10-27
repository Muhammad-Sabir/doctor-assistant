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
