import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import logo from '@/assets/images/svg/webLogo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FcGoogle } from 'react-icons/fc';
import { useAuthContext } from '@/contexts/AuthContext';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { BiSolidError } from "react-icons/bi";
import { validateField } from '@/utils/validationRules';

export default function Login() {
    const [activeTab, setActiveTab] = useState('patient');
    const { login, user} = useAuthContext();
    const navigate = useNavigate();

    const [loginDetails, setLoginDetails] = useState({
        email: "",
        password: ""
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [inputErrors, setInputErrors] = useState({});

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

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginDetails;

        if (Object.keys(inputErrors).length > 0) {
            return;
        }

        await login(email, password, activeTab);
    };

    useEffect(() => {
        if (user) {
            navigate(user.role === 'doctor' ? '/doctor' : '/patient');
        }
    }, [user, navigate]);

    return (
        <>
            <div className="grid gap-2 text-center">
                <img src={logo} alt="Logo" className="mx-auto mb-4 h-10 w-100" />
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-balance text-muted-foreground">
                    Enter your email below to login to your account
                </p>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="patient">Patient</TabsTrigger>
                        <TabsTrigger value="doctor">Doctor</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <form className="grid gap-4" onSubmit={handleLogin}>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@gmail.com"
                        value={loginDetails.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputErrors.email ? 'border-red-500' : ''}
                        required
                    />
                    {inputErrors.email && (
                        <div aria-live="assertive" className="flex text-red-500 text-sm">
                            <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.email}
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
                <Button variant="outline" className="w-full">
                    <FcGoogle className="mr-2 text-xl" /> Login with Google
                </Button>
            </form>
            <div className="mt-4 text-center text-sm">
                Don&apos;t have an account? <Link to="/signup" className="underline text-primary">Sign up</Link>
            </div>
        </>
    );
}
