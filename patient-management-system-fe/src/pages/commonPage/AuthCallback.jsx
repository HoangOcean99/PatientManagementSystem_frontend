import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabaseClient.js';
import axiosClient from '../../api/axiosClient.js';
import toast from 'react-hot-toast';

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("AuthCallback: Component mounted");


        const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!session) {
                    return;
                }
                try {
                    const res = await axiosClient.post('/auth/sync-user-google');
                    const user = res.data.user;
                    if (!user?.role) return;
                    switch (user.role) {
                        case 'admin': navigate('/admin/dashboard'); break;
                        case 'patient': navigate('/patient/dashboard'); break;
                        case 'receptionist': navigate('/receptionist/dashboard'); break;
                        case 'doctor': navigate('/doctor/dashboard'); break;
                        case 'accountant': navigate('/accountant/dashboard'); break;
                        case 'lab': navigate('/lab/queue'); break;
                    }
                    toast.success("Đăng nhập thành công!");
                } catch (err) {
                    console.error("Sync error:", err);
                    if (err.response?.status === 403) {
                        await supabase.auth.signOut();
                        toast.error(err.response.data.message || "Tài khoản của bạn đã bị cấm");
                        navigate('/login');
                    } else {
                        toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
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
