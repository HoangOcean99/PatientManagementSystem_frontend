import React, { lazy } from 'react';
import ProtectedRoute from '../components/security/ProtectedRoute';
const AdminDashboard = lazy(() => import('../pages/adminPage/AdminDashboard'));
const AdminProfile = lazy(() => import('../pages/adminPage/AdminProfile'));
const ClinicServiceDetail = lazy(() => import('../pages/adminPage/ClinicServiceDetail'));
const ClinicServicesManagement = lazy(() => import('../pages/adminPage/ClinicServicesManagement'));
const DepartmentManagement = lazy(() => import('../pages/adminPage/DepartmentManagement'));
const RoleSelection = lazy(() => import('../pages/adminPage/RoleSelection'));
const ScheduleManagement = lazy(() => import('../pages/adminPage/ScheduleManagement'));
const UserManagement = lazy(() => import('../pages/adminPage/UserManagement'));
const UserProfileEdit = lazy(() => import('../pages/adminPage/UserProfileEdit'));
const UserProfileManagement = lazy(() => import('../pages/adminPage/UserProfileManagement'));
const PatientListPage = lazy(() => import('../pages/adminPage/PatientListPage'));
const PatientFormPage = lazy(() => import('../pages/adminPage/PatientFormPage'));
const DoctorListingPage = lazy(() => import('../pages/adminPage/DoctorListingPage'));
const DoctorDetailsAdminPage = lazy(() => import('../pages/adminPage/DoctorDetailsAdminPage'));
const StaffListingPage = lazy(() => import('../pages/adminPage/StaffListingPage'));
const StaffDetailsPage = lazy(() => import('../pages/adminPage/StaffDetailsPage'));

const adminRoutes = [
    {
        path: '/admin/dashboard',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
            </ProtectedRoute>
        )
    },
    {
        path: '/admin/role-selection',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <RoleSelection />
            </ProtectedRoute>
        )
    },
    {
        path: '/admin/user-management/:role',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <UserManagement />
            </ProtectedRoute>
        )
    },
    {
        path: '/admin/user-profile/:role/:id',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <UserProfileManagement />
            </ProtectedRoute>
        )
    },
    {
        path: '/admin/user-profile-edit/:role/:id',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <UserProfileEdit />
            </ProtectedRoute>
        )
    },
    {
        path: '/admin/schedule-management',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <ScheduleManagement />
            </ProtectedRoute>
        )
    },
    {
        path: '/admin/department-management',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <DepartmentManagement />
            </ProtectedRoute>
        )
    },
    {
        path: '/admin/clinic-services-management/:department',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <ClinicServicesManagement />
            </ProtectedRoute>
        )
    },
    {
        path: '/admin/clinic-service-detail/:clinicServiceId',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <ClinicServiceDetail />
            </ProtectedRoute>
        )
    },
    {
        path: '/admin/admin-profile',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <AdminProfile />
            </ProtectedRoute>
        )
    },
    {
        path: '/admin/patients',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <PatientListPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/admin/patients/:id/edit',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <PatientFormPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/admin/doctors',
        element: <DoctorListingPage />
    },
    {
        path: '/admin/doctors/:id',
        element: <DoctorDetailsAdminPage />
    },
    {
        path: '/admin/staffs/:role',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <StaffListingPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/admin/staffs/:role/:id',
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                <StaffDetailsPage />
            </ProtectedRoute>
        )
    },

];

export default adminRoutes;