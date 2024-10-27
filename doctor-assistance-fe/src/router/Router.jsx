import { createBrowserRouter } from 'react-router-dom';

import HomePage from '@/pages/HomePage';
import AuthLayout from '@/layouts/AuthLayout';
import ForgetPassword from '@/pages/ForgetPassword';
import Signup from '@/pages/Signup';
import Login from '@/pages/Login';
import ErrorPage from '@/pages/ErrorPage';
import DoctorRoutes from './DoctorRoutes';
import PatientRoutes from './PatientRoutes';
import VerifyEmail from '@/pages/VerifyEmail';
import EmailVerificationMessage from '@/pages/EmailVerificationMessage';
import ResetPassword from '@/pages/ResetPassword';
import CompleteProfileRoutes from './CompleteProfileRoutes';

const Router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/',
        element: <AuthLayout />, 
        children: [
            { path: 'signup', element: <Signup /> },
            { path: 'login', element: <Login /> },
            { path: 'reset-password/:reset_uid/:reset_token', element: <ResetPassword /> },
            { path: 'forgot-password', element: <ForgetPassword /> },
            { path: 'verify-email', element: <VerifyEmail /> },
            { path: 'verify-account/:verify_uid/:verify_token', element: <EmailVerificationMessage /> },
        ]
    },
    {
        path: '/complete-profile/*',
        element: <CompleteProfileRoutes />,
    },
    {
        path: '/doctor/*',
        element: <DoctorRoutes />,
    },
    {
        path: '/patient/*',
        element: <PatientRoutes/>
    },
    {
        path: '*',
        element: <ErrorPage />,
    },
]);

export default Router;
