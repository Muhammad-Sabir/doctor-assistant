import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { BiErrorCircle } from "react-icons/bi";

import loadingSVG from '@/assets/images/svg/loading.svg';
import logo from '@/assets/images/svg/webLogo.svg';
import { fetchApi } from '@/utils/fetchApis';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';

export default function EmailVerificationMessage() {
    const { verify_uid, verify_token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');

    const { mutate: verifyAccount, isSuccess, isError } = useCreateUpdateMutation({
        url: () => `user/verify-account/${verify_uid}/${verify_token}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        fetchFunction: fetchApi,
        onSuccessMessage: 'Your account has been verified successfully.',
        onErrorMessage: 'Verification failed',
    });

    useEffect(() => {
        verifyAccount(JSON.stringify({uid: verify_uid, token: verify_token}));
    }, [verify_uid, verify_token, verifyAccount]);

    useEffect(() => {
        if (isSuccess) {
            setStatus('success');
            const timer = setTimeout(() => {
                navigate('/login');
            }, 4000);

            return () => clearTimeout(timer);
        }
        if (isError) {
            setStatus('error');
        }
    }, [isSuccess, isError, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
            <Link to={'/'}>
                <img src={logo} alt="Logo" className="mx-auto mb-4 h-10 w-100" />
            </Link>
            <div className="text-center">
                {status === 'loading' && (
                    <div className="flex flex-col items-center text-center">
                        <div className='mb-4'>
                            <img src={loadingSVG} alt="Loading" className="w-24 h-24" />
                        </div>
                        <h1 className="text-xl font-semibold mb-4 text-primary">Verifying your account...</h1>
                        <p className="text-gray-600">Please wait while we verify your account.</p>
                    </div>
                )}
                {status === 'success' && (
                    <div className="flex flex-col items-center text-center">
                        <div className='text-10xl mb-4'>
                            <IoCheckmarkDoneCircleOutline size={100} className="text-green-600" />
                        </div>
                        <h1 className="text-xl font-semibold mb-4 text-green-600">Account Verified Successfully!</h1>
                        <p className="text-gray-600">Your account has been successfully verified. You will be redirected to the login page shortly.</p>
                    </div>
                )}
                {status === 'error' && (
                    <div className="flex flex-col items-center text-center">
                        <div className='text-10xl mb-4'>
                            <BiErrorCircle size={100} className="text-red-700" />
                        </div>
                        <h1 className="text-xl font-semibold mb-4 text-red-700">Verification Failed!</h1>
                        <p className="text-gray-600">
                            There was an issue verifying your account.<br />
                            Your link might have expired or is incorrect. Please <Link to={"/verify-email"} className="text-blue-500 hover:underline">click here</Link> to request a new verification email.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
