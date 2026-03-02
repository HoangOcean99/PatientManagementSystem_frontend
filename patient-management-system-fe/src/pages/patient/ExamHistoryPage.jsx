import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../../../supabaseClient';
import axiosClient from '../../api/axiosClient';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';

const ExamHistoryPage = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const { data: authData } = await supabase.auth.getUser();
                const userId = authData?.user?.id;
                // if (!userId) { navigate('/login'); return; }
                const res = await axiosClient.get('/medical-records', { params: { patient_id: userId } });
                setRecords(res.data?.data || []);
            } catch (err) {
                console.error('Failed to load exam history:', err);
                toast.error('Không thể tải lịch sử khám');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [navigate]);

    const filtered = records.filter(r => {
        const s = searchTerm.toLowerCase();
        return !s || (r.diagnosis || '').toLowerCase().includes(s) || (r.symptoms || '').toLowerCase().includes(s);
    });

    const formatDate = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="min-h-screen font-sans relative" style={{ width: '100vw', background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
            {scrollbarStyles}

            {/* Header */}
            <div className="sticky top-0 z-30 border-b border-blue-100/40" style={{ background: 'linear-gradient(180deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(20px) saturate(180%)' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4 mb-5">
                        <button onClick={() => navigate('/patient/dashboard')} className="w-10 h-10 rounded-xl bg-white/70 hover:bg-white border border-gray-200/60 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-all shadow-sm cursor-pointer">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 mb-1">
                                <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider">Hồ sơ y tế</span>
                            </div>
                            <h1 className="text-2xl font-extrabold text-gray-900">Lịch sử khám bệnh</h1>
                        </div>
                    </div>
                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all placeholder-gray-400 font-medium text-gray-700 shadow-sm"
                            placeholder="Tìm theo chẩn đoán, triệu chứng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
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
                ) : filtered.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border border-blue-100/30 shadow-sm"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-5">
                            <i className="fa-solid fa-file-medical text-3xl text-violet-300"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Chưa có lịch sử khám</h3>
                        <p className="text-gray-400 mt-2 text-sm">Lịch sử khám bệnh sẽ hiển thị tại đây</p>
                    </motion.div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <AnimatePresence>
                            {filtered.map((record, idx) => (
                                <motion.div
                                    key={record.record_id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    transition={{ delay: idx * 0.04, duration: 0.4 }}
                                    className="group cursor-pointer"
                                    onClick={() => navigate(`/patient/exam/${record.record_id}`)}
                                >
                                    <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)] hover:border-blue-200/60 transition-all duration-500 overflow-hidden p-5">
                                        <div className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-violet-500 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                                                <i className="fa-solid fa-stethoscope text-violet-500"></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-[15px] font-bold text-gray-800 group-hover:text-blue-700 transition-colors truncate">
                                                    {record.diagnosis || 'Chưa có chẩn đoán'}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                                                        <i className="fa-regular fa-calendar text-[10px] text-blue-400"></i>
                                                        {formatDate(record.created_at)}
                                                    </span>
                                                    {record.symptoms && (
                                                        <>
                                                            <span className="w-px h-3 bg-gray-200"></span>
                                                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 truncate max-w-[200px]">
                                                                <i className="fa-solid fa-comment-medical text-[10px] text-rose-300"></i>
                                                                {record.symptoms}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center transition-all group-hover:translate-x-0.5">
                                                <i className="fa-solid fa-chevron-right text-xs text-gray-300 group-hover:text-blue-600 transition-colors"></i>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamHistoryPage;
