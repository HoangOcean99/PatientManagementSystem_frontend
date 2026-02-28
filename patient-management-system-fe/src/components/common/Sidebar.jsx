import * as Icons from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "../../api/authApi";
import { supabase } from "../../../supabaseClient";

const SidebarItem = ({ icon, label, active = false, linkPage }) => {
    const IconComponent = Icons[icon];
    const navigate = useNavigate();


    return (
        <div
            className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg transition-colors ${active
                ? "bg-gray-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-50"
                }`}
            onClick={() => {
                if (linkPage) {
                    navigate(`/${linkPage}`);
                }
            }}
        >
            {IconComponent ? (
                <IconComponent size={18} />
            ) : (
                <div className="w-[18px]" />
            )}
            <span className="text-sm font-medium">{label}</span>
        </div>
    );
};

const Sidebar = ({ items }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            navigate('/login')
        } catch (error) {
            setErrorMessage("Đăng nhập Google thất bại");
        }
    }
    return (
        <aside className="w-64 border-r border-gray-100 flex flex-col p-4 bg-white">
            <nav className="flex-1 space-y-1">
                {items.map((item, index) => {
                    const isActive = item.matchPages?.some(page =>
                        location.pathname.startsWith(page)
                    );

                    return (
                        <SidebarItem
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            linkPage={item.linkPage}
                            active={isActive}
                        />
                    );
                })}
            </nav>

            <div className="pt-4 border-t border-gray-50" onClick={handleSignOut}>
                <SidebarItem icon={"LogOut"} label="Đăng xuất" />
            </div>
        </aside>
    );
};

export default Sidebar;