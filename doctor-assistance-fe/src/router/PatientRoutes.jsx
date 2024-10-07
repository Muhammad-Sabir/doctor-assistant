import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from '@/router/ProtectedRoutes';
import Home from '@/pages/patient/Home';
import Profile from '@/pages/patient/Profile';
import DashboardLayout from '@/layouts/DashboardLayout';

export default function PatientRoutes() {
    return (
        <Routes>
            <Route element={<ProtectedRoute permission='patient' />}>
                <Route element={<DashboardLayout />}>
                    <Route path="home" element={<Home />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/patient/home" replace />} />
                </Route>
            </Route>
        </Routes>
    );
}
