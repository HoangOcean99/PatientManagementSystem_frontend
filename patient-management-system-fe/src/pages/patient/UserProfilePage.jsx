import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../../../supabaseClient';
import { getPatientById } from '../../api/patientApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';

const GENDER_MAP = {
    male: { label: 'Nam', icon: 'fa-mars', color: 'text-blue-600', bg: 'bg-blue-50' },
    female: { label: 'Nữ', icon: 'fa-venus', color: 'text-rose-600', bg: 'bg-rose-50' },
    other: { label: 'Khác', icon: 'fa-genderless', color: 'text-indigo-600', bg: 'bg-indigo-50' },
};

const InfoRow = ({ icon, label, value, iconColor = 'text-blue-400' }) => (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
            <i className={`fa-solid ${icon} text-sm ${iconColor}`}></i>
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
            <p className="text-[15px] font-semibold text-gray-800 mt-0.5 break-words">{value || '—'}</p>
        </div>
    </div>
);

const UserProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { data: authData } = await supabase.auth.getUser();
                const userId = authData?.user?.id;
                //     return;
                // }
                const res = await getPatientById(userId);
                setProfile(res.data?.data || res.data || null);
            } catch (err) {
                console.error('Failed to load profile:', err);
                toast.error('Không thể tải thông tin cá nhân');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
                <LoadingSpinner />
            </div>
        );
    }

    const user = profile?.Users || {};
    const g = GENDER_MAP[profile?.gender] || GENDER_MAP.other;
    const initials = (user.full_name || '?').split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();

    const formatDate = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="min-h-screen font-sans relative" style={{ width: '100vw', background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
            {scrollbarStyles}

            {/* Header */}
            <div className="sticky top-0 z-30 border-b border-blue-100/40" style={{ background: 'linear-gradient(180deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(20px) saturate(180%)' }}>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/patient/dashboard')} className="w-10 h-10 rounded-xl bg-white/70 hover:bg-white border border-gray-200/60 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-all shadow-sm cursor-pointer">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 mb-1">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Hồ sơ</span>
                            </div>
                            <h1 className="text-2xl font-extrabold text-gray-900">Thông tin cá nhân</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>

                    {/* Avatar Card */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden mb-6">
                        <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                            <div className="absolute -bottom-10 left-6">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.full_name} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-lg" />
                                ) : (
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl ring-4 ring-white shadow-lg">
                                        {initials}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="pt-14 px-6 pb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{user.full_name || 'Chưa cập nhật'}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${g.bg} ${g.color}`}>
                                            <i className={`fa-solid ${g.icon} text-[10px]`}></i>
                                            {g.label}
                                        </span>
                                        {user.status === 'active' && (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Hoạt động
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/patient/change-password')}
                                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-blue-50 text-sm font-bold text-gray-600 hover:text-blue-600 transition-all cursor-pointer border border-gray-200/60 hover:border-blue-200"
                                >
                                    <i className="fa-solid fa-key mr-1.5 text-xs"></i>
                                    Đổi mật khẩu
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2.5">
                                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm shadow-lg shadow-blue-500/25">
                                    <i className="fa-solid fa-id-card"></i>
                                </span>
                                Chi tiết hồ sơ
                            </h3>
                        </div>
                        <div className="px-6 py-2">
                            <InfoRow icon="fa-user" label="Họ và tên" value={user.full_name} />
                            <InfoRow icon="fa-envelope" label="Email" value={user.email} iconColor="text-indigo-400" />
                            <InfoRow icon="fa-phone" label="Số điện thoại" value={user.phone_number} iconColor="text-sky-400" />
                            <InfoRow icon="fa-cake-candles" label="Ngày sinh" value={formatDate(profile?.dob)} iconColor="text-rose-400" />
                            <InfoRow icon="fa-venus-mars" label="Giới tính" value={g.label} iconColor="text-violet-400" />
                            <InfoRow icon="fa-location-dot" label="Địa chỉ" value={profile?.address} iconColor="text-amber-400" />
                            <InfoRow icon="fa-triangle-exclamation" label="Dị ứng" value={profile?.allergies} iconColor="text-red-400" />
                            <InfoRow icon="fa-notes-medical" label="Tiền sử bệnh" value={profile?.medical_history_summary} iconColor="text-emerald-400" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default UserProfilePage;
