import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../../../supabaseClient';
import axiosClient from '../../api/axiosClient';
import LoadingSpinner from '../../components/LoadingSpinner';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';

const RELATION_MAP = {
    father: 'Cha',
    mother: 'Mẹ',
    guardian: 'Người giám hộ',
    other: 'Khác',
};

const UnderMyCarePage = () => {
    const navigate = useNavigate();
    const [dependents, setDependents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const { data: authData } = await supabase.auth.getUser();
                const userId = authData?.user?.id;
                // if (!userId) { navigate('/login'); return; }
                const res = await axiosClient.get('/family-relationships', { params: { parent_user_id: userId } });
                setDependents(res.data?.data || []);
            } catch (err) {
                console.error('Failed to load dependents:', err);
                toast.error('Không thể tải danh sách người phụ thuộc');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [navigate]);

    return (
        <div className="min-h-screen font-sans relative" style={{ width: '100vw', background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
            {scrollbarStyles}

            {/* Header */}
            <div className="sticky top-0 z-30 border-b border-blue-100/40" style={{ background: 'linear-gradient(180deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(20px) saturate(180%)' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/patient/dashboard')} className="w-10 h-10 rounded-xl bg-white/70 hover:bg-white border border-gray-200/60 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-all shadow-sm cursor-pointer">
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Gia đình</span>
                                </div>
                                <h1 className="text-2xl font-extrabold text-gray-900">Người phụ thuộc</h1>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/patient/under-my-care/key')}
                            className="px-5 py-2.5 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 text-sm"
                            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }}
                        >
                            <i className="fa-solid fa-key"></i>
                            Mã liên kết
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-48 gap-3">
                        <LoadingSpinner />
                        <span className="text-sm text-blue-500/60 font-medium">Đang tải dữ liệu...</span>
                    </div>
                ) : dependents.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border border-blue-100/30 shadow-sm"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
                            <i className="fa-solid fa-people-roof text-3xl text-blue-300"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Chưa có người phụ thuộc</h3>
                        <p className="text-gray-400 mt-2 text-sm max-w-sm mx-auto">Sử dụng mã liên kết để thêm con em vào danh sách quản lý</p>
                        <button
                            onClick={() => navigate('/patient/under-my-care/key')}
                            className="mt-6 font-bold text-blue-600 hover:text-blue-700 px-5 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl cursor-pointer transition-colors"
                        >
                            <i className="fa-solid fa-key mr-2 text-sm"></i>
                            Tạo mã liên kết
                        </button>
                    </motion.div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <AnimatePresence>
                            {dependents.map((dep, idx) => {
                                const child = dep.ChildUser || {};
                                const initials = (child.full_name || 'U').split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
                                return (
                                    <motion.div
                                        key={dep.relationship_id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.04, duration: 0.4 }}
                                        className="group"
                                    >
                                        <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)] hover:border-blue-200/60 transition-all duration-500 p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/15 flex-shrink-0">
                                                    {initials}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-[15px] font-bold text-gray-800">{child.full_name || 'Chưa cập nhật'}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md font-medium">
                                                            {RELATION_MAP[dep.relationship] || dep.relationship}
                                                        </span>
                                                        {dep.can_manage && (
                                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                                Quản lý
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnderMyCarePage;
