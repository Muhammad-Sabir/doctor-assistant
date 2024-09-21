export const getErrorMessage = (error) => {
    let errorMessage = 'An unexpected error occurred';

    if (error.status === 401) {
        errorMessage = 'Unauthorized: Invalid credentials';
    } else if (error.response) {
        errorMessage = error.response.non_field_errors?.[0] || error.response.message || 'An error occurred';
    }

    return errorMessage;
};