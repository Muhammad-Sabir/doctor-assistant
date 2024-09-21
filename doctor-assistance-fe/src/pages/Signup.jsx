import React, { useState } from 'react';
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

export default function SignUp() {
  const [activeTab, setActiveTab] = useState('patient');
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
    phoneNo: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [inputErrors, setInputErrors] = useState({});

  const signupMutation = useCreateUpdateMutation({
    url: 'user/register/',
    method: 'POST',
    fetchFunction: fetchApi,
    onSuccessMessage: 'A verification email has been sent to your email address.',
    onErrorMessage: 'Signup failed',
    onSuccess: () => {
      navigate('/verify-email');
    }
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    const errors = validateField(id, value, inputErrors);
    setInputErrors(errors);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { email, password, phoneNo } = userDetails;

    if (hasNoFieldErrors(inputErrors)) {
      sessionStorage.setItem('email', email);
      signupMutation.mutate({ email, password, phone_number: phoneNo, role: activeTab });
    }
  };

  return (
    <>
      <div className="grid gap-2 text-center">
        <img src={logo} alt="Logo" className="mx-auto mb-4 h-10 w-100" />
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-balance text-muted-foreground mb-2">
          Enter your information to create an account
        </p>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className='mr-3' value="patient">Patient</TabsTrigger>
            <TabsTrigger value="doctor">Doctor</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <form className="grid gap-4" onSubmit={handleSignup}>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@gmail.com"
            value={userDetails.email}
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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={passwordVisible ? "text" : "password"}
              placeholder="********"
              value={userDetails.password}
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
          <Label htmlFor="phoneNo">Phone Number</Label>
          <Input
            id="phoneNo"
            type="text"
            placeholder="+92 000 0000000"
            value={userDetails.phoneNo}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputErrors.phoneNo ? 'border-red-500' : ''}
            required
          />
          {inputErrors.phoneNo && (
            <div aria-live="assertive" className="flex text-red-500 text-sm">
              <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.phoneNo}
            </div>
          )}
        </div>
        <Button type="submit" className="w-full">Sign Up</Button>
        <Button type="button" variant="outline" className="w-full">
          <FcGoogle className="mr-2 text-xl" /> Sign Up with Google
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="underline text-primary">
          Login
        </Link>
      </div>
    </>
  );
}