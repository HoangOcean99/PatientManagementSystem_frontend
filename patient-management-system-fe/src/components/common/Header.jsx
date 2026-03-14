import { Search, Bell, Activity } from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';
import { supabase } from '../../../supabaseClient.js';
import { getUserById } from '../../api/userApi.js';
import toast from 'react-hot-toast';


const Header = () => {
    const [avatar, setAvatar] = useState(null);
    const fetchData = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session.user.id;
            const res = await getUserById(userId);
            setAvatar(res.data.data.avatar_url);
        } catch (error) {
            toast.error('Tải dữ liệu thất bại')
        }

    }
    useEffect(() => {
        fetchData();
    }, [])

    return (
        <header className="h-16 border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 bg-white z-10" style={{ width: '100vw' }}>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
                <div className="bg-blue-600 p-1 rounded text-white"><Activity size={20} /></div>
                MedSchedule
            </div>

            <div className="flex gap-6 items-center">
                <div className="flex items-center gap-2 cursor-pointer">
                    <img
                        src={avatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-full border border-gray-100 object-cover"
                    />
                </div>
            </div>
        </header>
    );
}
export default Header;