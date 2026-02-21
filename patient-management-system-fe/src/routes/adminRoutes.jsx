import DoctorDetailsAdminPage from '../pages/admin/DoctorDetailsAdminPage';
import DoctorListingPage from '../pages/doctor/DoctorListingPage';
import DoctorProfilePage from '../pages/doctor/DoctorProfilePage';

const adminRoutes = [
    { path: '/admin/doctors', element: <DoctorListingPage /> },
    { path: '/admin/doctors/preview/:id', element: <DoctorProfilePage /> },
    { path: '/admin/doctors/:id', element: <DoctorDetailsAdminPage /> },
    { path: '/admin/doctors/:id/edit', element: <DoctorDetailsAdminPage /> }
];

export default adminRoutes;