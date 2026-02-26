import DoctorDetailsAdminPage from '../pages/admin/DoctorDetailsAdminPage';
import PatientListPage from '../components/patient/PatientListPage';
import DoctorListingPage from '../pages/doctor/DoctorListingPage';
import DoctorProfilePage from '../pages/doctor/DoctorProfilePage';

const adminRoutes = [
    { path: '/admin/doctors', element: <DoctorListingPage /> },
    { path: '/admin/doctors/preview/:id', element: <DoctorProfilePage /> },
    { path: '/admin/doctors/:id', element: <DoctorDetailsAdminPage /> },
    { path: '/admin/doctors/:id/edit', element: <DoctorDetailsAdminPage /> },
    { path: '/admin/patients', element: <PatientListPage /> }
];

export default adminRoutes;