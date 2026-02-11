import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabaseClient.js';
import axiosClient from '../../api/axiosClient.js';

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    const res = await axiosClient.post('/auth/sync-user-google');
                    const user = res.data.user;
                    if (user.role === 'admin') {
                        navigate('/dashboard-admin');
                    } else if (user.role === 'patient') {
                        navigate('/dashboard-patient');
                    } else if (user.role === 'receptionist') {
                        navigate('/dashboard-receptionist');
                    } else if (user.role === 'doctor') {
                        navigate('/dashboard-doctor');
                    } else if (user.role === 'accountant') {
                        navigate('/dashboard-accountant');
                    }
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
