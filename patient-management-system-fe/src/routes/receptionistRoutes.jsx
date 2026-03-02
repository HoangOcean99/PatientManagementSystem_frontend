import Dashboard from "../pages/receptionistPage/Dashboard";
import Coordinator from "../pages/receptionistPage/Coordinator";
import ReceptionistProfile from "../pages/receptionistPage/receptionistProfile";
import QueuePatientDashboard from "../pages/receptionistPage/QueuePatientDashboard";
const receptionistRoutes = [
    { path: '/receptionist/dashboard', element: <Dashboard /> },
    { path: '/receptionist/coordinator', element: <Coordinator /> },
    { path: '/receptionist/profile', element: <ReceptionistProfile /> },
    { path: '/receptionist/queue-patient-dashboard', element: <QueuePatientDashboard /> },
];

export default receptionistRoutes;