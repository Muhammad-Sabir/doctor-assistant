import React, { useState, useEffect } from 'react';
import logo from '@/assets/images/svg/webLogo.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateField } from '@/utils/validationRules';
import { BiSolidError } from 'react-icons/bi';
import { useCustomMutation } from '@/hooks/useCustomMutation';
import { fetchApi } from '@/utils/fetchApi';

export default function VerifyEmail() {
    const [email, setEmail] = useState('');
    const [inputErrors, setInputErrors] = useState({});

    const sendVerificationEmail = useCustomMutation({
        url: 'send-verify-email/',
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
        if (Object.keys(inputErrors).length === 0) {
            if (email) {
                sendVerificationEmail.mutate({ email });
                sessionStorage.removeItem('email');
            }
        }
    };

    return (
        <div className="grid gap-2 text-center">
            <img src={logo} alt="Logo" className="mx-auto mb-4 h-10 w-auto" />
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
