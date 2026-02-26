import DoctorDetailsAdminPage from '../pages/admin/DoctorDetailsAdminPage';
import PatientListPage from '../components/patient/PatientListPage';
import PatientFormPage from '../components/patient/PatientFormPage';
import DoctorListingPage from '../pages/doctor/DoctorListingPage';
import DoctorProfilePage from '../pages/doctor/DoctorProfilePage';

const adminRoutes = [
    { path: '/admin/doctors', element: <DoctorListingPage /> },
    { path: '/admin/doctors/preview/:id', element: <DoctorProfilePage /> },
    { path: '/admin/doctors/:id', element: <DoctorDetailsAdminPage /> },
    { path: '/admin/doctors/:id/edit', element: <DoctorDetailsAdminPage /> },
    { path: '/admin/patients', element: <PatientListPage /> },
    { path: '/admin/patients/create', element: <PatientFormPage /> },
    { path: '/admin/patients/:id/edit', element: <PatientFormPage /> }
];

export default adminRoutes;