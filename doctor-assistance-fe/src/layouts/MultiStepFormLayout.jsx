import React, { useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';

import logo from '@/assets/images/svg/webLogo.svg';
import authImage from "@/assets/images/webp/authImage.webp";
import { getAuthStatus } from '@/utils/auth';

export default function MultiStepFormLayout({ children }) {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    useEffect(() => {
        const { isAuthenticated, user } = getAuthStatus();

        const isDoctorWithCompleteProfile = () => {
            return user.role === 'doctor' && user.is_profile_completed;
        };

        if (!isAuthenticated) {
            navigate('/login');
        } else if (isDoctorWithCompleteProfile()) {
            navigate(`/${user.role}`);
        }
    }, [navigate]);

    return (
        <>
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
                        <div className="grid gap-2 text-center">
                            <Link to={'/'}>
                                <img src={logo} alt="Logo" className="mx-auto mb-4 h-10 w-100" />
                            </Link>
                            <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
                            <p className="text-balance text-muted-foreground mb-2 -mt-2">
                                Enter your complete information to continue
                            </p>
                        </div>

                        {children}
                        <div className="text-center text-sm">
                            <p>
                                Thinking of logging out?
                                <Button
                                    onClick={handleLogout}
                                    variant='link'
                                    className="bg-transparent cursor-pointer p-1 underline text-primary ml-1"
                                >
                                    Click Here
                                </Button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
