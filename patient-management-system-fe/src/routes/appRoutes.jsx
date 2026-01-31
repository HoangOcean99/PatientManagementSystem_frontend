import accountantRoutes from "./accountantRoutes";
import adminRoutes from "./adminRoutes";
import commonRoutes from "./commonRoutes";
import doctorRoutes from "./doctorRoutes";
import patientRoutes from "./patientRoutes";

const mainRoutes = [
    ...doctorRoutes,
    ...patientRoutes,
    ...accountantRoutes,
    ...adminRoutes,
    ...accountantRoutes,
    ...commonRoutes
];

export default mainRoutes;