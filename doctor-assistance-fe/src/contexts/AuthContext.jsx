import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = async (email, password, role) => {
        const toastId = toast.loading('Logging in...');
        let name = 'Test User'
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            if ((email === 'doctor@gmail.com' && password === 'doctor08' && role === 'doctor') ||
                (email === 'patient@gmail.com' && password === 'patient08' && role === 'patient')) {
                setUser({ name, email, role, isAuthenticated: true });
                toast.dismiss(toastId);
                toast.success(`Logged in as ${email}`, {
                    style: {
                        backgroundColor: '#ffffff'
                    }
                });
            } else {
                setUser(null);
                toast.dismiss(toastId);
                toast.error('Login failed. Please check your credentials.');
            }
        } catch (error) {
            setUser(null);
            toast.dismiss(toastId);
            toast.error(`An error occurred: ${error.message}`);
        }
    };

    const register = async (name, email, password, phoneNumber, role) => {
        const regToastId = toast.loading('Registering...');
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            if ((email === 'doctor@gmail.com' && password === 'doctor08' && role === 'doctor') ||
                (email === 'patient@gmail.com' && password === 'patient08' && role === 'patient')) {
                setUser({ name, email, role, isAuthenticated: true });
                toast.dismiss(regToastId);
                toast.success(`Signed in as ${email}`, {
                    style: {
                        backgroundColor: '#ffffff'
                    }
                });
            } else {
                setUser(null);
                toast.dismiss(regToastId);
                toast.error('Signup failed. Please check your credentials.');
            }
        } catch (error) {
            setUser(null);
            toast.dismiss(regToastId);
            toast.error(`An error occurred: ${error.message}`);
        }
    };

    const logout = async () => {
        try {
            const logoutToastId = toast.loading('Logging out...');
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setUser(null);
            toast.dismiss(logoutToastId);
            toast.info('You have been logged out');
        } catch (error) {
            toast.error(`An error occurred: ${error.message}`);
        }

    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthContextProvider");
    }
    return context;
};
