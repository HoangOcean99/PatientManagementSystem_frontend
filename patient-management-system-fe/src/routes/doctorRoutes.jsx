import PatientDetailPage from "../pages/doctorPage/PatientDetailPage";
import ExaminationPage from "../pages/doctorPage/ExaminationPage";

const doctorRoutes = [
    { path: '/doctor/patient/:patientId', element: <PatientDetailPage /> },
    { path: '/doctor/examine/:appointmentId', element: <ExaminationPage /> },
];

export default doctorRoutes;