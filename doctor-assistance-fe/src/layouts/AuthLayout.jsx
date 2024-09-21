import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import authImage from "@/assets/images/webp/authImage.webp";
import { getAuthStatus } from '@/utils/auth';

export default function AuthLayout({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        const { isAuthenticated, user } = getAuthStatus();

        if (isAuthenticated) {
            navigate(user.role === 'doctor' && !user.is_profile_completed ? '/complete-profile' : `/${user.role}`);
        }
    }, [navigate]);

    return (
        <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh] p-3 lg:p-0">
            <div className="hidden bg-muted lg:block">
                <img
                    src={authImage}
                    alt="AuthImage"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    {children}
                </div>
            </div>
        </div>
    )
}
