import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import errorImage from "@/assets/images/webp/errorImage.webp";

export default function ErrorPage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleButtonClick = () => {
        if (user) {
            navigate(`/${user.role}`);
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="w-full h-screen flex justify-center items-center flex-col p-3 lg:p-0">
            <h1 className="text-3xl font-bold text-primary mb-1">Oops!</h1>
            <img
                src={errorImage}
                alt="ErrorImage"
                className="w-full max-w-[400px] h-auto object-contain"
            />
            <div className="text-center mt-5">
                <h1 className="text-3xl font-bold text-primary">Page Not Found</h1>
                <p className="text-sm mt-2 text-gray-500">The page you are looking for can't be found</p>
                <button
                    onClick={handleButtonClick}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                >
                    {user ? 'Go to Dashboard' : 'Go to Login'}
                </button>
            </div>
        </div>
    );
}