import DoctorDashboardPage from "../pages/doctorPage/DoctorDashboardPage";
import DoctorSchedulePage from "../pages/doctorPage/DoctorSchedulePage";
import DoctorProfileSettingsPage from "../pages/doctorPage/DoctorProfileSettingsPage";
import PatientDetailPage from "../pages/doctorPage/PatientDetailPage";
import ExaminationPage from "../pages/doctorPage/ExaminationPage";

const doctorRoutes = [
    { path: '/doctor/dashboard', element: <DoctorDashboardPage /> },
    { path: '/doctor/schedule', element: <DoctorSchedulePage /> },
    { path: '/doctor/profile', element: <DoctorProfileSettingsPage /> },
    { path: '/doctor/patient/:patientId', element: <PatientDetailPage /> },
    { path: '/doctor/examine/:appointmentId', element: <ExaminationPage /> },
];

export default doctorRoutes;