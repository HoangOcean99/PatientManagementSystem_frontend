import * as Icons from "lucide-react";
import { X, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../../supabaseClient";

const SidebarItem = ({ icon, label, active = false, linkPage, onClick }) => {
    const IconComponent = Icons[icon];
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) onClick();
        if (linkPage) navigate(`${linkPage}`);
    };

    return (
        <div
            className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg transition-colors ${active
                ? "bg-sky-50 text-sky-600 font-semibold"
                : "text-gray-600 hover:bg-gray-50"
                }`}
            onClick={handleClick}
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

const Sidebar = ({ items, open, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Đăng xuất thất bại", error);
        }
    };

    const handleItemClick = () => {
        // Close the mobile drawer when an item is clicked
        if (onClose) onClose();
    };

    const sidebarContent = (
        <aside className="w-64 border-r border-gray-100 flex flex-col bg-white h-full">
            {/* Mobile close button */}
            <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-base">
                    <div className="bg-blue-600 p-1 rounded text-white">
                        <Icons.Activity size={16} />
                    </div>
                    MedSchedule
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                    aria-label="Đóng menu"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
                            onClick={handleItemClick}
                        />
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
                <div onClick={handleSignOut}>
                    <SidebarItem icon="LogOut" label="Đăng xuất" />
                </div>
            </div>
        </aside>
    );

    return (
        <>
            {/* Desktop: always visible */}
            <div className="hidden lg:flex h-full shrink-0">
                {sidebarContent}
            </div>

            {/* Mobile: Drawer overlay */}
            {open && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
                        onClick={onClose}
                    />
                    {/* Drawer panel */}
                    <div className="relative z-10 flex h-full">
                        {sidebarContent}
                    </div>
                </div>
            )}
        </>
    );
};

export { Menu };
export default Sidebar;