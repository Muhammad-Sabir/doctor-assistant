import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from '@/router/ProtectedRoutes';
import Home from '@/pages/doctor/Home';
import Profile from '@/pages/doctor/Profile';
import DashboardLayout from '@/layouts/DashboardLayout';
import ConsultationLayout from '@/layouts/ConsultationLayout';
import Consultation from '@/pages/doctor/Consultation';
import Appointments from '@/pages/doctor/Appointments';
import Chats from '@/pages/doctor/Chats';
import MyPatients from '@/pages/doctor/MyPatients';
import PatientDetails from '@/pages/doctor/PatientDetails';
export default function DoctorRoutes() {
    return (
        <Routes>
            <Route element={<ProtectedRoute permission="doctor" />}>
                <Route element={<DashboardLayout />}>
                    <Route path="home" element={<Home />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="patients" element={<MyPatients />} />
                    <Route path="patient/:id" element={<PatientDetails />} />
                    <Route path="appointments" element={<Appointments />} />
                    <Route path="chats" element={<Chats />} />
                    <Route path="*" element={<Navigate to="home" replace />} />
                </Route>

                <Route element={<ConsultationLayout />}>
                    <Route path="consultation/:patientId/:consultationId" element={<Consultation />} />
                </Route>
            </Route>
        </Routes>
    );
}
