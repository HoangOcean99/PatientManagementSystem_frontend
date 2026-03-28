import React, { lazy } from 'react';
import PublicRoute from "../components/security/PublicRoute";
const DoctorListingPage = lazy(() => import('../pages/adminPage/DoctorListingPage'));
const AuthCallback = lazy(() => import('../pages/commonPage/AuthCallback'));
const ForgotPasswordPage = lazy(() => import('../pages/commonPage/ForgotPasswordPage'));
const LandingPage = lazy(() => import('../pages/commonPage/LandingPage'));
const LoginPage = lazy(() => import('../pages/commonPage/LoginPage'));
const RegisterKidPage = lazy(() => import('../pages/commonPage/RegisterKidPage'));

const commonRoutes = [
    {
        path: '/',
        element:
            <PublicRoute>
                <LandingPage />
            </PublicRoute>
    },
    {
        path: '/login',
        element:
            <PublicRoute>
                <LoginPage />
            </PublicRoute>
    },
    {
        path: '/register-kid',
        element:
            <PublicRoute>
                <RegisterKidPage />
            </PublicRoute>
    },
    {
        path: '/oauth-callback',
        element: <AuthCallback />
    },
    {
        path: '/forget-password',
        element:
            <PublicRoute>
                <ForgotPasswordPage />
            </PublicRoute>
    },
];

export default commonRoutes;