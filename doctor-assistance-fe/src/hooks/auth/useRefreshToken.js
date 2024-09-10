import { useCustomMutation } from "../useCustomMutation";
import { fetchApi } from "@/utils/fetchApi";

export const useRefreshToken = () => {
    return useCustomMutation({
        url: 'token/refresh/',
        fetchFunction: fetchApi, 
        onSuccessMessage: 'Token refresh successful',
        onErrorMessage: 'Token refresh failed',
        onSuccess: (data) => {
            return data;
        },
    });
};
