import LabQueuePage from "../pages/labPage/LabQueuePage";
import LabResultPage from "../pages/labPage/LabResultPage";
import LabProfilePage from "../pages/labPage/LabProfilePage";

const labRoutes = [
    { path: '/lab/queue', element: <LabQueuePage /> },
    { path: '/lab/result/:labOrderId', element: <LabResultPage /> },
    { path: '/lab/profile', element: <LabProfilePage /> },
];

export default labRoutes;
