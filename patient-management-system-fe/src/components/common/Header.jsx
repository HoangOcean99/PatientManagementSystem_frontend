import { Search, Bell, Activity, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient.js";
import { getUserById } from "../../api/userApi.js";
import toast from "react-hot-toast";

const Header = ({ onMenuClick }) => {
    const [avatar, setAvatar] = useState(null);

    const fetchData = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return;
            const userId = session.user.id;
            const res = await getUserById(userId);
            setAvatar(res?.data?.data?.avatar_url);
        } catch (error) {
            toast.error('Tải dữ liệu thất bại');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <header className="h-16 border-b border-gray-100 px-4 sm:px-6 flex items-center justify-between sticky top-0 bg-white z-30 w-full shrink-0">
            <div className="flex items-center gap-3">
                {/* Hamburger - mobile only */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                    aria-label="Mở menu"
                >
                    <Menu size={20} />
                </button>

                <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
                    <div className="bg-blue-600 p-1 rounded text-white">
                        <Activity size={20} />
                    </div>
                    <span className="hidden sm:inline">MedSchedule</span>
                </div>
            </div>

            <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2 cursor-pointer">
                    {avatar ? (
                        <img
                            src={avatar}
                            alt="avatar"
                            className="w-8 h-8 rounded-full border border-gray-100 object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 border border-gray-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                            ?
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
