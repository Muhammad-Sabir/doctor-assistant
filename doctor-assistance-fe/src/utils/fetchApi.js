export const fetchApi = async (url, options = {}) => {
  const response = await fetch(`http://localhost:8000/api/user/${url}`, options);
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
