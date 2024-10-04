import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import ProtectedRoute from '@/router/ProtectedRoutes';
import Home from '@/pages/doctor/Home';
import Profile from '@/pages/doctor/Profile';
import DashboardLayout from '@/layouts/DashboardLayout';

export default function DoctorRoutes() {
    return (
        <ProtectedRoute permission='doctor'>
            <DashboardLayout>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/doctor/home" replace />}/>
                </Routes>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

