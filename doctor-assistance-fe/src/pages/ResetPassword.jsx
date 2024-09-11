import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { BiSolidError } from "react-icons/bi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import logo from "@/assets/images/svg/webLogo.svg";
import { validateField } from '@/utils/validationRules';
import { useCustomMutation } from '@/hooks/useCustomMutation';
import { fetchApi } from '@/utils/fetchApi';

export default function ResetPassword() {
    const { reset_uid, reset_token } = useParams();
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });
    const [inputErrors, setInputErrors] = useState({});
    const [redirectMessage, setRedirectMessage] = useState('');

    const { mutate: resetPassword, isSuccess} = useCustomMutation({
        url: ({ uid, token }) => `user/reset-password-confirm/${uid}/${token}`,
        fetchFunction: fetchApi,
        onSuccessMessage: 'Password reset successfully.',
        onErrorMessage: 'Failed to reset password',
    });

    useEffect(() => {
        if (isSuccess) {
            setRedirectMessage('Password reset confirmed. Redirecting to login page in few seconds...');
            const timer = setTimeout(() => {
                navigate('/login');
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleBlur = (e) => {
        const { id, value } = e.target;
        const errors = validateField(id, value, inputErrors, formData.password);
        setInputErrors(errors);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setInputErrors({
                ...inputErrors,
                confirmPassword: 'Passwords do not match'
            });
            return;
        }

        if (Object.keys(inputErrors).length === 0) {
            resetPassword({
                uid: reset_uid,
                token: reset_token,
                password: formData.password
            });
        }
    };

    return (
        <>
            <div className="grid gap-2 text-center">
                <img src={logo} alt="Logo" className="mx-auto mb-4 h-10 w-100" />
                <h1 className="text-3xl font-bold">Reset Your Password</h1>
                <p className="text-balance text-muted-foreground">
                    Enter your new password and confirm it below.
                </p>
            </div>
            <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            type={passwordVisible ? "text" : "password"}
                            placeholder="********"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={inputErrors.password ? 'border-red-500' : ''}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                        >
                            {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </button>
                    </div>
                    {inputErrors.password && (
                        <div aria-live="assertive" className="flex text-red-500 text-sm">
                            <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.password}
                        </div>
                    )}
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                    </div>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={confirmPasswordVisible ? "text" : "password"}
                            placeholder="********"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={inputErrors.confirmPassword ? 'border-red-500' : ''}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                        >
                            {confirmPasswordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </button>
                    </div>
                    {inputErrors.confirmPassword && (
                        <div aria-live="assertive" className="flex text-red-500 text-sm">
                            <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.confirmPassword}
                        </div>
                    )}
                </div>
                <Button
                    type="submit"
                    className="w-full"
                >
                    Submit
                </Button>
            </form>
            {redirectMessage && (
                <p className="text-center text-green-500 mt-4">{redirectMessage}</p>
            )}
        </>
    );
}
