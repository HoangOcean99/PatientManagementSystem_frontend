import { Outlet, useLocation } from "react-router-dom";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import { ItemsAdminSideBar } from "../../components/sidebar/ItemsAdminSideBar";
import { ItemsDoctorSideBar } from "../../components/sidebar/ItemsDoctorSideBar";
import { ItemsPatientSideBar } from "../../components/sidebar/ItemsPatientSideBar";
import { ItemsLabSideBar } from "../../components/sidebar/ItemsLabSideBar";


export default function MainPage() {
    const location = useLocation();
    let items = '';

    if (location.pathname.startsWith("/admin")) {
        items = ItemsAdminSideBar;
    } else if (location.pathname.startsWith("/doctor")) {
        items = ItemsDoctorSideBar;
    } else if (location.pathname.startsWith("/patient")) {
        items = ItemsPatientSideBar;
    } else if (location.pathname.startsWith("/lab")) {
        items = ItemsLabSideBar;
    }

    return (
        <div className="flex flex-col h-screen bg-white" style={{ width: '100vw' }}>
            <Header />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar items={items} />

                <Outlet />
            </div>
        </div>
    );
}