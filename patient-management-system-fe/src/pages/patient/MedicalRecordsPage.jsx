import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../../../supabaseClient';
import { getMedicalRecords } from '../../api/patientApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';

const TABS = [
    { key: 'lab', label: 'Xét nghiệm' },
    { key: 'diagnosis', label: 'Chẩn đoán' },
];

// lab_status enum from DB: ordered | processing | completed
const LAB_STATUS = {
    ordered: { label: 'Đã yêu cầu', color: 'text-amber-700', bg: 'bg-amber-50' },
    processing: { label: 'Đang xử lý', color: 'text-blue-700', bg: 'bg-blue-50' },
    completed: { label: 'Hoàn thành', color: 'text-emerald-700', bg: 'bg-emerald-50' },
};

const MedicalRecordsPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('lab');
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const { data: authData } = await supabase.auth.getUser();
                const userId = authData?.user?.id;
                if (userId) {
                    const res = await getMedicalRecords(userId);
                    setRecords(res.data?.data || res.data || []);
                }
            } catch (err) {
                console.error('Failed to load medical records:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const formatDate = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const labReports = records.flatMap(r => r.LabOrders || []);
    const diagnoses = records;

    const renderLabReports = () => (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-800">Danh sách xét nghiệm</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50/50">
                            <th className="text-left px-6 py-3.5 font-semibold text-gray-500">Tên xét nghiệm</th>
                            <th className="text-left px-4 py-3.5 font-semibold text-gray-500">Ngày tạo</th>
                            <th className="text-left px-4 py-3.5 font-semibold text-gray-500">Trạng thái</th>
                            <th className="text-left px-4 py-3.5 font-semibold text-gray-500">Kết quả</th>
                            <th className="text-right px-6 py-3.5 font-semibold text-gray-500">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labReports.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500 font-medium">Bạn chưa có xét nghiệm nào.</td>
                            </tr>
                        )}
                        {labReports.map((lab) => {
                            const st = LAB_STATUS[lab.status] || LAB_STATUS.ordered;
                            return (
                                <tr key={lab.lab_order_id} className="border-b border-gray-50 hover:bg-sky-50/30 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-gray-800">{lab.test_name}</td>
                                    <td className="px-4 py-4 text-gray-600">{formatDate(lab.created_at)}</td>
                                    <td className="px-4 py-4">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${st.bg} ${st.color}`}>
                                            {st.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">{lab.result_summary || '—'}</td>
                                    <td className="px-6 py-4 text-right">
                                        {lab.result_file_url ? (
                                            <a href={lab.result_file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700">
                                                <i className="fa-solid fa-file-arrow-down text-[10px]"></i>
                                                Tải kết quả
                                            </a>
                                        ) : (
                                            <span className="text-xs text-gray-400">—</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderDiagnoses = () => (
        <div className="space-y-4">
            {diagnoses.length === 0 && (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 p-12 text-center shadow-sm">
                    <i className="fa-solid fa-file-medical text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500 font-medium">Bạn chưa có hồ sơ bệnh án nào.</p>
                </div>
            )}
            {diagnoses.map((diag) => (
                <div key={diag.record_id} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                                <i className="fa-solid fa-stethoscope text-violet-500 text-sm"></i>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{diag.Doctor?.User?.full_name || '—'}</p>
                                <p className="text-xs text-gray-400">{diag.Doctor?.specialization || '—'}</p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400">
                            <i className="fa-regular fa-calendar mr-1"></i>
                            {formatDate(diag.created_at)}
                        </span>
                    </div>
                    {diag.symptoms && (
                        <div className="bg-amber-50/50 rounded-xl p-3 mb-3 border border-amber-100/50">
                            <p className="text-xs text-amber-600 font-medium uppercase tracking-wide mb-0.5">Triệu chứng</p>
                            <p className="text-gray-700 text-sm">{diag.symptoms}</p>
                        </div>
                    )}
                    <div className="bg-gray-50 rounded-xl p-4 mb-3">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Chẩn đoán</p>
                        <p className="text-gray-800 font-semibold text-sm">{diag.diagnosis}</p>
                    </div>
                    {diag.doctor_notes && (
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Ghi chú bác sĩ</p>
                            <p className="text-gray-600 text-sm">{diag.doctor_notes}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex-1 h-full overflow-y-auto w-full font-sans" style={{ background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
            {scrollbarStyles}

            {/* Header */}
            <div className="sticky top-0 z-30 border-b border-blue-100/40" style={{ background: 'linear-gradient(180deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(20px) saturate(180%)' }}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="mb-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 mb-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Hồ sơ y tế</span>
                        </div>
                        <h1 className="text-2xl font-extrabold text-gray-900">Kết quả bệnh án</h1>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-gray-100 rounded-xl p-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${activeTab === tab.key
                                    ? 'bg-white text-gray-800 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-48 gap-3">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'lab' && renderLabReports()}
                        {activeTab === 'diagnosis' && renderDiagnoses()}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MedicalRecordsPage;
