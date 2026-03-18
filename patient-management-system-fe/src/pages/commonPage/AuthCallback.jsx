import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabaseClient.js';
import axiosClient from '../../api/axiosClient.js';
import toast from 'react-hot-toast';

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    const res = await axiosClient.post('/auth/sync-user-google');
                    const user = res.data.user;
                    switch (user.role) {
                        case 'admin': navigate('/admin/doctors'); break;
                        case 'receptionist': navigate('/'); break;
                        case 'doctor': navigate('/doctor/dashboard'); break;
                        case 'accountant': navigate('/accountant/dashboard'); break;
                        case 'patient': navigate('/'); break;
                    }
                    toast.success("Đăng nhập thành công!");
                }
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return (
        <div className="mx-auto w-full bg-[#f0f7ff] flex items-center justify-center p-6" style={{ width: '100vw', height: '100vh ' }}>
            <p style={{ textAlign: 'center', width: '100vw' }}>Đang xử lý đăng nhập...</p>;
        </div>
    )
}
