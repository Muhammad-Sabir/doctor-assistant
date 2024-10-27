import { useAuth } from '@/contexts/AuthContext';
import { fetchApi } from '@/utils/fetchApis';
import { useRouter } from 'expo-router';

const useFetchWithAuth = () => {
    const { user, setUser } = useAuth();
    const router = useRouter();

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

    const fetchWithAuth = async (url, options = {}) => {
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

    return { fetchWithAuth };
};

export default useFetchWithAuth;
