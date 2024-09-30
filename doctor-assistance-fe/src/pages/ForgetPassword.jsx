import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiSolidError } from 'react-icons/bi';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import logo from '@/assets/images/svg/webLogo.svg';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchApi } from '@/utils/fetchApis';

export default function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [inputErrors, setInputErrors] = useState({});

    const forgotPassword = useCreateUpdateMutation({
        url: 'user/send-reset-password/',
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        fetchFunction: fetchApi,
        onSuccessMessage: 'Password reset email sent.',
        onErrorMessage: 'Failed to send reset email',
    });

    const handleEmailChange = (e) => {
        const { value } = e.target;
        setEmail(value);
        const errors = validateField('email', value, inputErrors);
        setInputErrors(errors);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (hasNoFieldErrors(inputErrors)) {
            forgotPassword.mutate(JSON.stringify({ email }));
        }
    };

    return (
        <div className="grid gap-2 text-center">
            <Link to={'/'}>
                <img src={logo} alt="Logo" className="mx-auto mb-4 h-10 w-100" />
            </Link>
            <h1 className="text-3xl font-bold">Forgot Password?</h1>
            <p className="text-gray-600 mb-6">
                Please enter your email address below to receive a password reset link
            </p>
            <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                    <div className="relative">
                        <Input
                            id="email"
                            type="text"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter your email"
                            className={`${inputErrors.email ? 'border-red-500' : ''}`}
                            required
                        />
                        {inputErrors.email && (
                            <div aria-live="assertive" className="flex text-red-500 text-sm mt-2">
                                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.email}
                            </div>
                        )}
                    </div>
                </div>
                <Button
                    type="submit"
                    className="w-full"
                >
                    Send Reset Link
                </Button>
            </form>
            <div className="mt-4 text-center text-sm">
                Back to Login?{" "}
                <Link to="/login" className="underline text-primary">
                    Login
                </Link>
            </div>
        </div>
    );
}
