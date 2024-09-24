import React, { useState, useEffect } from 'react';
import { BiSolidError } from 'react-icons/bi';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import logo from '@/assets/images/svg/webLogo.svg';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchApi } from '@/utils/fetchApis';

export default function VerifyEmail() {
    const [email, setEmail] = useState('');
    const [inputErrors, setInputErrors] = useState({});

    const sendVerificationEmail = useCreateUpdateMutation({
        url: 'user/send-verify-email/',
        method: 'POST',
        fetchFunction: fetchApi,
        onSuccessMessage: 'Verification email sent.',
        onErrorMessage: 'Failed to send verification email',
    });

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleEmailChange = (e) => {
        const { value } = e.target;
        setEmail(value);
        const errors = validateField('email', value, inputErrors);
        setInputErrors(errors);
    };

    const handleResendEmail = (e) => {
        e.preventDefault();

        if (hasNoFieldErrors(inputErrors)) {
            sendVerificationEmail.mutate({ email });
            sessionStorage.removeItem('email');
        }
    };

    return (
        <div className="grid gap-2 text-center">
            <Link to={'/'}>
                <img src={logo} alt="Logo" className="mx-auto mb-4 h-10 w-100" />
            </Link>
            <h1 className="text-3xl font-bold">Verify Your Email</h1>
            <p className="text-gray-600 mb-6">
                {email ? "We have sent a verification link to:" : "Please enter your email address to receive a verification link:"}
            </p>
            <form className="grid gap-4" onSubmit={handleResendEmail}>
                <div className="grid gap-2">
                    <div className="relative">
                        <Input
                            id="email"
                            type="email"
                            placeholder={email ? "" : "Enter your email"}
                            value={email}
                            onChange={handleEmailChange}
                            className={`${inputErrors.email ? 'border-red-500' : ''}`}
                            required
                        />
                        {inputErrors.email && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm mb-4 mt-2">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.email}
                            </div>
                        )}
                    </div>
                </div>
                <Button
                    type="submit"
                    className="w-full"
                >
                    Resend Verification Email
                </Button>
            </form>
        </div>
    );
}
