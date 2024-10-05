import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import ProtectedRoute from '@/router/ProtectedRoutes';
import Home from '@/pages/doctor/Home';
import Profile from '@/pages/doctor/Profile';
import DashboardLayout from '@/layouts/DashboardLayout';
import ConsultationLayout from '@/layouts/ConsultationLayout';
import Consultation from '@/pages/doctor/Consultation';

export default function DoctorRoutes() {
    return (
        <ProtectedRoute permission="doctor">
            <Routes>
                <Route element={<DashboardLayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/doctor/home" replace />} />
                </Route>

                <Route element={<ConsultationLayout />}>
                    <Route path="consultation/:id" element={<Consultation/>} />
                </Route>

                <Route path="*" element={<Navigate to="/doctor/home" replace />} />
            </Routes>
        </ProtectedRoute>
    );
}
