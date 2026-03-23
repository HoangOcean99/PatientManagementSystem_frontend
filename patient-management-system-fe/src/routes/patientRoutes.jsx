import React, { lazy } from 'react';
const PatientDashboard = lazy(() => import('../pages/patient/PatientDashboard'));
const UserProfilePage = lazy(() => import('../pages/patient/UserProfilePage'));
const ExamHistoryPage = lazy(() => import('../pages/patient/ExamHistoryPage'));
const ExamDetailPage = lazy(() => import('../pages/patient/ExamDetailPage'));
const AppointmentDetail = lazy(() => import('../pages/patient/AppointmentDetail'));
const BookingAppointmentPage = lazy(() => import('../pages/patient/BookingAppointmentPage'));
const SelectSpecialtyPage = lazy(() => import('../pages/patient/SelectSpecialtyPage'));
const PaymentPage = lazy(() => import('../pages/patient/PaymentPage'));
const UnderMyCarePage = lazy(() => import('../pages/patient/UnderMyCarePage'));
const KeyCodePage = lazy(() => import('../pages/patient/KeyCodePage'));
const BillingPage = lazy(() => import('../pages/patient/BillingPage'));
const MedicalRecordsPage = lazy(() => import('../pages/patient/MedicalRecordsPage'));
const AppointmentDetailPage = lazy(() => import('../pages/patient/AppointmentDetailPage'));
import ProtectedRoute from '../components/security/ProtectedRoute';

const patientRoutes = [
    {
        path: '/patient/dashboard',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <PatientDashboard />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/profile',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <UserProfilePage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/exam-history',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <ExamHistoryPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/exam/:id',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <ExamDetailPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/appointment/:id',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <AppointmentDetail />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/booking',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <SelectSpecialtyPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/booking/details',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <BookingAppointmentPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/payment/:id',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <PaymentPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/under-my-care',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <UnderMyCarePage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/under-my-care/key',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <KeyCodePage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/billing',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <BillingPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/medical-records',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <MedicalRecordsPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/patient/appointment/:id',
        element: (
            <ProtectedRoute allowedRoles={["patient"]}>
                <AppointmentDetailPage />
            </ProtectedRoute>
        )
    },
];

export default patientRoutes;