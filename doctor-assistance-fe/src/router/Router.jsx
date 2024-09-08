import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/home/HomePage';
import AuthLayout from '@/layouts/AuthLayout';
import ForgetPassword from '@/pages/ForgetPassword';
import Signup from '@/pages/Signup';
import Login from '@/pages/Login';
import ErrorPage from '@/pages/ErrorPage';
import DoctorRoutes from './DoctorRoutes';
import PatientRoutes from './PatientRoutes';

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
        path: 'forgot-password',
        element: <AuthLayout children={<ForgetPassword/>}/>,
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
