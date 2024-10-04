import { createBrowserRouter } from 'react-router-dom';

import HomePage from '@/pages/home/HomePage';
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
        path: 'signup',
        element: <AuthLayout children={<Signup/>}/>, 
    },
    {
        path: 'login',
        element: <AuthLayout children={<Login/>}/>,
    },
    {
        path: 'reset-password/:reset_uid/:reset_token',
        element: <AuthLayout children={<ResetPassword/>}/>,
    },
    {
        path: 'forgot-password',
        element: <AuthLayout children={<ForgetPassword/>}/>,
    },
    {
        path: 'verify-email',
        element: <AuthLayout children={<VerifyEmail/>}/>,
    },
    {
        path: 'verify-account/:verify_uid/:verify_token',
        element: <AuthLayout children={<EmailVerificationMessage/>}/>,
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
