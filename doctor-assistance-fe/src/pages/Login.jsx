import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { BiSolidError } from "react-icons/bi";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import logo from '@/assets/images/svg/webLogo.svg';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchApi } from '@/utils/fetchApis';

export default function Login() {
    const [activeTab, setActiveTab] = useState('patient');
    const navigate = useNavigate();
    const [loginDetails, setLoginDetails] = useState({
        username: "",
        password: ""
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [inputErrors, setInputErrors] = useState({});

    const { mutate: login, isSuccess, isError, data, error } = useCreateUpdateMutation({
        url: 'user/login/',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        fetchFunction: fetchApi,
        onSuccessMessage: 'Logged in successfully.',
        onErrorMessage: 'Login failed'
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setLoginDetails(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleBlur = (e) => {
        const { id, value } = e.target;
        const errors = validateField(id, value, inputErrors);
        setInputErrors(errors);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const { username, password } = loginDetails;

        if (hasNoFieldErrors(inputErrors)) {
            login(JSON.stringify({username, password, role: activeTab}));
        }
    };

    useEffect(() => {
        if (isSuccess) {
            const { access, refresh, role, is_profile_completed } = data.data;
            const user = {
                access_token: access,
                refresh_token: refresh,
                role: role,
                is_profile_completed: is_profile_completed,
                username: loginDetails.username
            };
            localStorage.setItem('user', JSON.stringify(user));
            navigate(!is_profile_completed ? `/complete-profile/${role}` : `/${role}`);
        }

        if (isError && error.status === 400 && error.message === "Account is not verified.") {
            navigate('/verify-email');
        }

    }, [isSuccess, isError, data, navigate]);

    return (
        <>
            <div className="grid gap-2 text-center">
                <Link to={'/'}>
                    <img src={logo} alt="Logo" className="mx-auto mb-4 h-10 w-100" />
                </Link>
                <h1 className="text-3xl font-bold mb-2">Login</h1>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger className='mr-3' value="patient">Patient</TabsTrigger>
                        <TabsTrigger value="doctor">Doctor</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <form className="grid gap-4" onSubmit={handleLogin}>
                <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="Enter email or phone number"
                        value={loginDetails.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputErrors.username ? 'border-red-500' : ''}
                        required
                    />
                    {inputErrors.username && (
                        <div aria-live="assertive" className="flex text-red-500 text-sm">
                            <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.username}
                        </div>
                    )}
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <Link to="/forgot-password" className="ml-auto inline-block text-sm underline text-primary">
                            Forgot your password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            type={passwordVisible ? "text" : "password"}
                            placeholder="********"
                            value={loginDetails.password}
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
                <Button type="submit" className="w-full">Login</Button>
                <Button type="button" variant="outline" className="w-full">
                    <FcGoogle className="mr-2 text-xl" /> Login with Google
                </Button>
            </form>
            <div className="mt-4 text-center text-sm">
                Don&apos;t have an account? <Link to="/signup" className="underline text-primary">Sign up</Link>
            </div>
        </>
    );
}
