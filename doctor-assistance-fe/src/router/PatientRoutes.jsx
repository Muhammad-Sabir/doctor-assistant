import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from '@/router/ProtectedRoutes';
import Home from '@/pages/patient/Home';
import Profile from '@/pages/patient/Profile';
import DashboardLayout from '@/layouts/DashboardLayout';
import DoctorsList from '@/pages/patient/DoctorsList';
import DoctorDetail from '@/pages/patient/DoctorDetail';
import HopsitalDetails from '@/pages/patient/HospitalDetails';
import DoctorSearchResults from '@/pages/patient/DoctorSearchResults';
import MyReviews from '@/pages/patient/MyReviews';
import Appointments from '@/pages/patient/Appointments';
import Prescription from '@/pages/patient/Prescription';
import Chats from '@/pages/patient/Chats';
import VideoCall from '@/pages/patient/VideoCall';
import { WebRTCProvider } from '@/context/WebRTCContext';
import Consultations from '@/pages/patient/Consultations';

export default function PatientRoutes() {
    return (
        <WebRTCProvider>
            <Routes>
                <Route element={<ProtectedRoute permission='patient' />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="home" element={<Home />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="doctors" element={<DoctorsList />} />
                        <Route path="doctor/:id" element={<DoctorDetail />} />
                        <Route path="doctors/search-results" element={<DoctorSearchResults />} />
                        <Route path="hospital/:id" element={<HopsitalDetails />} />
                        <Route path="reviews" element={<MyReviews />} />
                        <Route path="appointments" element={<Appointments />} />
                        <Route path="consultations" element={<Consultations />} />
                        <Route path="prescription/:consultationId" element={<Prescription />} />
                        <Route path="chats" element={<Chats />} />
                        <Route path="/consultation/video-call" element={<VideoCall />} />
                        <Route path="*" element={<Navigate to="/patient/home" replace />} />
                    </Route>
                </Route>
            </Routes>
        </WebRTCProvider>
    );
}
