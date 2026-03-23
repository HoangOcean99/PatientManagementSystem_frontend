import React, { lazy } from 'react';
const DoctorDashboardPage = lazy(() => import('../pages/doctorPage/DoctorDashboardPage'));
const DoctorSchedulePage = lazy(() => import('../pages/doctorPage/DoctorSchedulePage'));
const DoctorProfileSettingsPage = lazy(() => import('../pages/doctorPage/DoctorProfileSettingsPage'));
const PatientDetailPage = lazy(() => import('../pages/doctorPage/PatientDetailPage'));
const ExaminationPage = lazy(() => import('../pages/doctorPage/ExaminationPage'));
import ProtectedRoute from "../components/security/ProtectedRoute";

const doctorRoutes = [
    {
        path: '/doctor/dashboard',
        element: (
            <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorDashboardPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/doctor/schedule',
        element: (
            <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorSchedulePage />
            </ProtectedRoute>
        )
    },
    {
        path: '/doctor/profile',
        element: (
            <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorProfileSettingsPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/doctor/patient/:patientId',
        element: (
            <ProtectedRoute allowedRoles={["doctor"]}>
                <PatientDetailPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/doctor/examine/:appointmentId',
        element: (
            <ProtectedRoute allowedRoles={["doctor"]}>
                <ExaminationPage />
            </ProtectedRoute>
        )
    },
];

export default doctorRoutes;