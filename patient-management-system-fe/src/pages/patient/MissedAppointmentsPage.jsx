import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../../../supabaseClient';
import { getListAppointments } from '../../api/scheduleApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';

const STATUS_MAP = {
    missed: { label: 'Đã bỏ lỡ', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
    cancelled: { label: 'Đã hủy', color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' },
};

const MissedAppointmentsPage = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const { data: authData } = await supabase.auth.getUser();
                const userId = authData?.user?.id;
                const res = await getListAppointments({ patient_id: userId });
                const all = res.data?.data || res.data || [];
                const missed = all.filter(a =>
                    ['missed', 'cancelled'].includes(a.status)
                );
                setAppointments(missed);
            } catch (err) {
                console.error('Failed to load missed appointments:', err);
                toast.error('Không thể tải danh sách lịch hẹn đã lỡ');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const formatDate = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const filtered = appointments.filter(a => {
        const s = searchTerm.toLowerCase();
        if (!s) return true;
        const doctorName = a.Doctor?.User?.full_name || a.Doctor?.Users?.full_name || '';
        const specialization = a.Doctor?.specialization || '';
        return doctorName.toLowerCase().includes(s) || specialization.toLowerCase().includes(s);
    });

    return (
        <div className="flex-1 h-full overflow-y-auto w-full font-sans" style={{ background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
            {scrollbarStyles}

            {/* Header */}
            <div className="sticky top-0 z-30 border-b border-blue-100/40" style={{ background: 'linear-gradient(180deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(20px) saturate(180%)' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 mb-1">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Lịch hẹn</span>
                            </div>
                            <h1 className="text-2xl font-extrabold text-gray-900">Lịch hẹn đã lỡ</h1>
                            <p className="text-sm text-gray-500 mt-1">Danh sách các lịch hẹn đã bỏ lỡ hoặc bị hủy</p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all placeholder-gray-400 font-medium text-gray-700 shadow-sm"
                            placeholder="Tìm theo tên bác sĩ, chuyên khoa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                        <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                            <i className="fa-solid fa-calendar-check text-3xl text-emerald-300"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Không có lịch hẹn đã lỡ</h3>
                        <p className="text-gray-400 mt-2 text-sm">Bạn chưa bỏ lỡ lịch hẹn nào. Tuyệt vời!</p>
                    </motion.div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <AnimatePresence>
                            {filtered.map((appt, idx) => {
                                const st = STATUS_MAP[appt.status] || STATUS_MAP.missed;
                                return (
                                    <motion.div
                                        key={appt.appointment_id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.97 }}
                                        transition={{ delay: idx * 0.04, duration: 0.4 }}
                                        className="group cursor-pointer"
                                        onClick={() => navigate(`/patient/appointment/${appt.appointment_id}`)}
                                    >
                                        <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.08)] hover:border-red-200/60 transition-all duration-500 overflow-hidden p-5">
                                            <div className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                                                    <i className="fa-solid fa-calendar-xmark text-red-400"></i>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-[15px] font-bold text-gray-800 group-hover:text-red-700 transition-colors">
                                                            Bs. {appt.Doctor?.User?.full_name || appt.Doctor?.Users?.full_name || 'Không xác định'}
                                                        </h3>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${st.bg} ${st.color}`}>
                                                            {st.label}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                                                            <i className="fa-regular fa-calendar text-[10px] text-blue-400"></i>
                                                            {formatDate(appt.DoctorSlot?.slot_date || appt.Slot?.slot_date || appt.appointment_date)}
                                                        </span>
                                                        {appt.start_time && (
                                                            <>
                                                                <span className="w-px h-3 bg-gray-200"></span>
                                                                <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                                                                    <i className="fa-regular fa-clock text-[10px]"></i>
                                                                    {appt.DoctorSlot?.start_time || appt.start_time} — {appt.DoctorSlot?.end_time || appt.end_time || ''}
                                                                </span>
                                                            </>
                                                        )}
                                                        {appt.Doctor?.specialization && (
                                                            <>
                                                                <span className="w-px h-3 bg-gray-200"></span>
                                                                <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                                                                    <i className="fa-solid fa-stethoscope text-[10px]"></i>
                                                                    {appt.Doctor.specialization}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-red-50 flex items-center justify-center transition-all group-hover:translate-x-0.5">
                                                    <i className="fa-solid fa-chevron-right text-xs text-gray-300 group-hover:text-red-600 transition-colors"></i>
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

export default MissedAppointmentsPage;
