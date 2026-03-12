import ProtectedRoute from '../components/security/ProtectedRoute';
import AdminDashboard from '../pages/adminPage/AdminDashboard';
import AdminProfile from '../pages/adminPage/AdminProfile';
import ClinicServiceDetail from '../pages/adminPage/ClinicServiceDetail';
import ClinicServicesManagement from '../pages/adminPage/ClinicServicesManagement';
import DepartmentManagement from '../pages/adminPage/DepartmentManagement';
import RoleSelection from '../pages/adminPage/RoleSelection';
import ScheduleManagement from '../pages/adminPage/ScheduleManagement';
import UserManagement from '../pages/adminPage/UserManagement';
import UserProfileEdit from '../pages/adminPage/UserProfileEdit';
import UserProfileManagement from '../pages/adminPage/UserProfileManagement';

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
];

export default adminRoutes;