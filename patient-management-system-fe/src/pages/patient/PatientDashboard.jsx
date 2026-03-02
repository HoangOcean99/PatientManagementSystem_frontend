import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../../../supabaseClient';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';

const NAV_CARDS = [
    {
        title: 'Người phụ thuộc',
        subtitle: 'Quản lý hồ sơ con em',
        icon: 'fa-solid fa-people-roof',
        path: '/patient/under-my-care',
        gradient: 'from-blue-500 to-indigo-600',
        shadow: 'shadow-blue-500/25',
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
    },
    {
        title: 'Hồ sơ cá nhân',
        subtitle: 'Xem và cập nhật thông tin',
        icon: 'fa-solid fa-user-circle',
        path: '/patient/profile',
        gradient: 'from-indigo-500 to-purple-600',
        shadow: 'shadow-indigo-500/25',
        iconBg: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
    },
    {
        title: 'Đặt lịch khám',
        subtitle: 'Đặt lịch hẹn với bác sĩ',
        icon: 'fa-solid fa-calendar-check',
        path: '/patient/booking',
        gradient: 'from-sky-500 to-blue-600',
        shadow: 'shadow-sky-500/25',
        iconBg: 'bg-sky-50',
        iconColor: 'text-sky-600',
    },
    {
        title: 'Lịch sử khám',
        subtitle: 'Xem lại kết quả khám bệnh',
        icon: 'fa-solid fa-clock-rotate-left',
        path: '/patient/exam-history',
        gradient: 'from-violet-500 to-purple-600',
        shadow: 'shadow-violet-500/25',
        iconBg: 'bg-violet-50',
        iconColor: 'text-violet-600',
    },
];

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const { data } = await supabase.auth.getUser();
                if (data?.user) {
                    setUser(data.user);
                }
            } catch (err) {
                console.error('Failed to get user:', err);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    if (loading) {
        return (
            <div className="relative flex-1">
                {loading && <LoadingSpinner />}
            </div>
        );
    }

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Chào buổi sáng';
        if (h < 18) return 'Chào buổi chiều';
        return 'Chào buổi tối';
    };

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50/30">
            {scrollbarStyles}

            {/* Header */}
            <div className="sticky top-0 z-30 border-b border-blue-100/40" style={{ background: 'linear-gradient(180deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(20px) saturate(180%)' }}>
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 mb-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Patient Portal</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                                {greeting()}, <span className="text-blue-600">{user?.user_metadata?.full_name || 'Bệnh nhân'}</span>
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">Chào mừng bạn đến hệ thống quản lý sức khoẻ</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">

                {/* Navigation Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {NAV_CARDS.map((card, idx) => (
                        <motion.div
                            key={card.path}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            onClick={() => navigate(card.path)}
                            className="group cursor-pointer"
                        >
                            <div className={`relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-lg hover:${card.shadow} transition-all duration-500 overflow-hidden p-6`}>
                                {/* Top gradient bar */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                                <div className="flex items-start gap-4">
                                    <div className={`w-14 h-14 rounded-2xl ${card.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                        <i className={`${card.icon} text-xl ${card.iconColor}`}></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                            {card.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-0.5">{card.subtitle}</p>
                                    </div>
                                    <div className="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center transition-all group-hover:translate-x-1">
                                        <i className="fa-solid fa-chevron-right text-xs text-gray-300 group-hover:text-blue-500 transition-colors"></i>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Info Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6"
                >
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2.5 mb-4">
                        <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm shadow-lg shadow-blue-500/25">
                            <i className="fa-solid fa-bell"></i>
                        </span>
                        Thông tin nhanh
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50/50 border border-blue-100/50">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <i className="fa-solid fa-calendar-day text-blue-600 text-sm"></i>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Lịch hẹn sắp tới</p>
                                <p className="text-lg font-bold text-gray-800">—</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/50">
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <i className="fa-solid fa-file-medical text-indigo-600 text-sm"></i>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Hồ sơ khám</p>
                                <p className="text-lg font-bold text-gray-800">—</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-violet-50/50 border border-violet-100/50">
                            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                                <i className="fa-solid fa-people-group text-violet-600 text-sm"></i>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Người phụ thuộc</p>
                                <p className="text-lg font-bold text-gray-800">—</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
};

export default PatientDashboard;
