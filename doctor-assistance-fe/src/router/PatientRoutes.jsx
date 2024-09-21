import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import ProtectedRoute from '@/router/ProtectedRoutes';
import Home from '@/pages/patient/Home';
import Profile from '@/pages/patient/Profile';
import DashboardLayout from '@/layouts/DashboardLayout';

export default function PatientRoutes() {
    return (
        <ProtectedRoute permission='patient'>
            <DashboardLayout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/patient" replace />}/>
                </Routes>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

