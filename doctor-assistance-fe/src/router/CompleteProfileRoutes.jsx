import React from 'react';
import { Route, Routes } from 'react-router-dom';

import MultiStepFormLayout from '@/layouts/MultiStepFormLayout';
import CompleteProfileStep1 from '@/pages/doctor/CompleteProfileStep1';
import CompleteProfileStep2 from '@/pages/doctor/CompleteProfileStep2';
import CompleteProfileStep3 from '@/pages/doctor/CompleteProfileStep3';
import CompleteProfileStep4 from '@/pages/doctor/CompleteProfileStep4';
import CompleteProfile from '@/pages/patient/CompleteProfile';
import ErrorPage from '@/pages/ErrorPage';

export default function CompleteProfileRoutes() {
    return (
        <Routes>
            <Route element={<MultiStepFormLayout />}>
                <Route path="doctor" element={<CompleteProfileStep1 />} />
                <Route path="doctor/two" element={<CompleteProfileStep2 />} />
                <Route path="doctor/three" element={<CompleteProfileStep3 />} />
                <Route path="doctor/four" element={<CompleteProfileStep4 />} />
                <Route path="patient" element={<CompleteProfile />} />
            </Route>
            <Route path="*" element={<ErrorPage/>} />
        </Routes>
    );
}
