import { Search, Bell, Activity } from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';
import { supabase } from '../../../supabaseClient.js';


const Header = () => {
    const [avatar, setAvatar] = useState(null);
    const fetchData = async () => {
        const { data: { session } } = await supabase.auth.getSession();

        const tempAvatar = session.user.user_metadata.picture;
        setAvatar(tempAvatar);
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