import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosClient from '../../api/axiosClient';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';

const Section = ({ icon, title, iconGradient, children }) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden mb-5">
        <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2.5">
                <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${iconGradient} flex items-center justify-center text-white text-sm shadow-lg`}>
                    <i className={`fa-solid ${icon}`}></i>
                </span>
                {title}
            </h3>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

const LAB_STATUS = {
    ordered: { label: 'Đã yêu cầu', color: 'text-amber-700', bg: 'bg-amber-50' },
    processing: { label: 'Đang xử lý', color: 'text-blue-700', bg: 'bg-blue-50' },
    completed: { label: 'Hoàn thành', color: 'text-emerald-700', bg: 'bg-emerald-50' },
};

const ExamDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await axiosClient.get(`/medical-records/${id}`);
                setRecord(res.data?.data || null);
            } catch (err) {
                console.error('Failed to load exam detail:', err);
                toast.error('Không thể tải chi tiết khám');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="relative flex-1">
                <LoadingSpinner />
            </div>
        );
    }

    if (!record) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
                <div className="text-center">
                    <i className="fa-solid fa-file-circle-xmark text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500 font-medium">Không tìm thấy hồ sơ</p>
                    <button onClick={() => navigate('/patient/exam-history')} className="mt-4 text-blue-600 font-bold hover:underline cursor-pointer">← Quay lại</button>
                </div>
            </div>
        );
    }

    const formatDate = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const prescriptions = record.Prescriptions || [];
    const labOrders = record.LabOrders || [];

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50/30">
            {scrollbarStyles}

            {/* Header */}
            <div className="sticky top-0 z-30 border-b border-blue-100/40" style={{ background: 'linear-gradient(180deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(20px) saturate(180%)' }}>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/patient/exam-history')} className="w-10 h-10 rounded-xl bg-white/70 hover:bg-white border border-gray-200/60 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-all shadow-sm cursor-pointer">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 mb-1">
                                <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider">Chi tiết</span>
                            </div>
                            <h1 className="text-2xl font-extrabold text-gray-900">Kết quả khám bệnh</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

                    {/* Diagnosis */}
                    <Section icon="fa-stethoscope" title="Chẩn đoán" iconGradient="from-violet-500 to-purple-600">
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Chẩn đoán</p>
                                <p className="text-gray-800 font-semibold">{record.diagnosis || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Triệu chứng</p>
                                <p className="text-gray-700">{record.symptoms || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Ghi chú bác sĩ</p>
                                <p className="text-gray-700">{record.doctor_notes || '—'}</p>
                            </div>
                            <div className="flex items-center gap-3 pt-2 text-xs text-gray-400">
                                <span className="inline-flex items-center gap-1.5">
                                    <i className="fa-regular fa-calendar text-blue-400"></i>
                                    {formatDate(record.created_at)}
                                </span>
                            </div>
                        </div>
                    </Section>

                    {/* Prescriptions */}
                    <Section icon="fa-pills" title={`Đơn thuốc (${prescriptions.length})`} iconGradient="from-blue-500 to-indigo-600">
                        {prescriptions.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-4">Không có đơn thuốc</p>
                        ) : (
                            <div className="space-y-3">
                                {prescriptions.map((p, i) => (
                                    <div key={p.prescription_id || i} className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/50 border border-blue-100/50">
                                        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <i className="fa-solid fa-capsules text-blue-600 text-sm"></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-800 text-sm">{p.medication_name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Liều: {p.dosage}</p>
                                            {p.instructions && <p className="text-xs text-gray-400 mt-0.5">{p.instructions}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Section>

                    {/* Lab Orders */}
                    <Section icon="fa-flask" title={`Xét nghiệm (${labOrders.length})`} iconGradient="from-emerald-500 to-teal-600">
                        {labOrders.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-4">Không có xét nghiệm</p>
                        ) : (
                            <div className="space-y-3">
                                {labOrders.map((lab, i) => {
                                    const st = LAB_STATUS[lab.status] || LAB_STATUS.ordered;
                                    return (
                                        <div key={lab.lab_order_id || i} className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100/50">
                                            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                <i className="fa-solid fa-vial text-emerald-600 text-sm"></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-gray-800 text-sm">{lab.test_name}</p>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${st.bg} ${st.color}`}>{st.label}</span>
                                                </div>
                                                {lab.result_summary && <p className="text-xs text-gray-500 mt-0.5">{lab.result_summary}</p>}
                                                {lab.result_file_url && (
                                                    <a href={lab.result_file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-flex items-center gap-1">
                                                        <i className="fa-solid fa-file-arrow-down text-[10px]"></i> Tải kết quả
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Section>
                </motion.div>
            </div>
        </main>
    );
};

export default ExamDetailPage;
