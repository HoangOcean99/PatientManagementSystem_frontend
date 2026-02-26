import AdminDashboard from '../pages/adminPage/AdminDashboard';
import AdminProfile from '../pages/adminPage/AdminProfile';
import RoleSelection from '../pages/adminPage/RoleSelection';
import ScheduleManagement from '../pages/adminPage/ScheduleManagement';
import ServiceDetail from '../pages/adminPage/ServiceDetail';
import ServiceManagement from '../pages/adminPage/ServiceManagement';
import UserManagement from '../pages/adminPage/UserManagement';
import UserProfileEdit from '../pages/adminPage/UserProfileEdit';
import UserProfileManagement from '../pages/adminPage/UserProfileManagement';


const adminRoutes = [
    { path: '/admin/dashboard', element: <AdminDashboard /> },

    { path: '/admin/role-selection', element: <RoleSelection /> },
    { path: '/admin/user-management/:role', element: <UserManagement /> },
    { path: '/admin/user-profile/:role/:id', element: <UserProfileManagement /> },
    { path: '/admin/user-profile-edit/:role/:id', element: <UserProfileEdit /> },

    { path: '/admin/schedule-management', element: <ScheduleManagement /> },

    { path: '/admin/service-management', element: <ServiceManagement /> },
    { path: '/admin/service-detail/:service', element: <ServiceDetail /> },

    { path: '/admin/admin-profile', element: <AdminProfile /> },
];

export default adminRoutes;