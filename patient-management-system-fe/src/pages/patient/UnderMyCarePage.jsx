import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getDependents, addDependent } from '../../api/patientApi';
import LoadingSpinner from "../../components/common/LoadingSpinner";
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';

const RELATION_MAP = {
    father: 'Cha',
    mother: 'Mẹ',
    guardian: 'Người giám hộ',
    other: 'Khác',
};

const GENDER_OPTIONS = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' },
];

const RELATIONSHIP_OPTIONS = [
    { value: 'father', label: 'Cha' },
    { value: 'mother', label: 'Mẹ' },
    { value: 'guardian', label: 'Người giám hộ' },
    { value: 'other', label: 'Khác' },
];

const INITIAL_FORM = {
    username: '',
    full_name: '',
    dob: '',
    gender: 'male',
    address: '',
    allergies: '',
    medical_history_summary: '',
    relationship: 'father',
    is_minor: true,
};

const InputField = ({ label, field, value, error, onChange, type = 'text', placeholder, required }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-600">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={placeholder}
            className={`w-full h-11 px-4 rounded-xl border bg-white text-sm text-gray-800 outline-none transition-all ${error ? 'border-red-300 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'}`}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
);

const UnderMyCarePage = () => {
    const navigate = useNavigate();
    const [dependents, setDependents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});

    const loadDependents = async () => {
        try {
            const res = await getDependents();
            setDependents(res.data?.data || res.data || []);
        } catch (err) {
            console.error('Failed to load dependents:', err);
            toast.error('Không thể tải danh sách người phụ thuộc');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadDependents(); }, []);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validate = () => {
        const errs = {};
        if (!form.full_name.trim()) errs.full_name = 'Vui lòng nhập họ tên';
        if (!form.dob) errs.dob = 'Vui lòng chọn ngày sinh';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            setSubmitting(true);
            const payload = { ...form };
            if (!payload.address) delete payload.address;
            if (!payload.allergies) delete payload.allergies;
            if (!payload.medical_history_summary) delete payload.medical_history_summary;

            await addDependent(payload);
            toast.success('ứngười phụ thuộc thành công!');
            setForm(INITIAL_FORM);
            setShowForm(false);
            setLoading(true);
            await loadDependents();
        } catch (err) {
            console.error('Failed to add dependent:', err);
            toast.error(err.response?.data?.message || 'Thêm thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex-1 h-full overflow-y-auto w-full font-sans relative" style={{ background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
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
                        <div className="flex items-center gap-2">
                         
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
                        <p className="text-gray-400 mt-2 text-sm max-w-sm mx-auto">Thêm con em hoặc người thân vào danh sách quản lý</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-6 font-bold text-emerald-600 hover:text-emerald-700 px-5 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl cursor-pointer transition-colors"
                        >
                            <i className="fa-solid fa-user-plus mr-2 text-sm"></i>
                            Thêm người phụ thuộc
                        </button>
                    </motion.div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <AnimatePresence>
                            {dependents.map((dep, idx) => {
                                const child = dep.Users || dep.ChildUser || {};
                                const patient = child.Patients?.[0] || child.Patients || {};
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
                                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md font-medium">
                                                            {RELATION_MAP[dep.relationship] || dep.relationship}
                                                        </span>
                                                        {patient.gender && (
                                                            <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md font-medium">
                                                                {patient.gender === 'male' ? 'Nam' : patient.gender === 'female' ? 'Nữ' : 'Khác'}
                                                            </span>
                                                        )}
                                                        {patient.dob && (
                                                            <span className="text-xs text-gray-400">
                                                                <i className="fa-regular fa-calendar mr-1 text-[10px]"></i>
                                                                {new Date(patient.dob).toLocaleDateString('vi-VN')}
                                                            </span>
                                                        )}
                                                        {dep.can_manage && (
                                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                                Quản lý
                                                            </span>
                                                        )}
                                                        {child.is_minor && (
                                                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                                                                Trẻ em
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

            {/* Add Dependent Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        >
                            {/* Modal Header */}
                            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-extrabold text-gray-900">Thêm người phụ thuộc</h2>
                                        <p className="text-sm text-gray-400 mt-1">Điền thông tin để tạo hồ sơ mới</p>
                                    </div>
                                    <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all cursor-pointer">
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="px-6 py-5 space-y-4">
                                <InputField label="Tài khoản (Tùy chọn)" field="username" value={form.username} error={errors.username} onChange={handleChange} placeholder="user123" />

                                <InputField label="Họ và tên" field="full_name" value={form.full_name} error={errors.full_name} onChange={handleChange} placeholder="Nguyễn Văn B" required />

                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Ngày sinh" field="dob" value={form.dob} error={errors.dob} onChange={handleChange} type="date" required />
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-600">Giới tính</label>
                                        <select
                                            value={form.gender}
                                            onChange={(e) => handleChange('gender', e.target.value)}
                                            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all cursor-pointer"
                                        >
                                            {GENDER_OPTIONS.map(g => (
                                                <option key={g.value} value={g.value}>{g.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-600">Mối quan hệ</label>
                                    <select
                                        value={form.relationship}
                                        onChange={(e) => handleChange('relationship', e.target.value)}
                                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all cursor-pointer"
                                    >
                                        {RELATIONSHIP_OPTIONS.map(r => (
                                            <option key={r.value} value={r.value}>{r.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                    <input
                                        type="checkbox"
                                        id="is_minor"
                                        checked={form.is_minor}
                                        onChange={(e) => handleChange('is_minor', e.target.checked)}
                                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                                    />
                                    <label htmlFor="is_minor" className="text-sm font-medium text-gray-700 cursor-pointer">
                                        Người này là trẻ vị thành niên (dưới 18 tuổi)
                                    </label>
                                </div>

                                <InputField label="Địa chỉ" field="address" value={form.address} error={errors.address} onChange={handleChange} placeholder="123 Nguyễn Văn Cừ, Q5, TP.HCM" />

                                <InputField label="Dị ứng" field="allergies" value={form.allergies} error={errors.allergies} onChange={handleChange} placeholder="VD: Dị ứng penicillin, hải sản..." />

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-600">Tiền sử bệnh</label>
                                    <textarea
                                        value={form.medical_history_summary}
                                        onChange={(e) => handleChange('medical_history_summary', e.target.value)}
                                        placeholder="VD: Hen suyễn từ nhỏ, đã phẫu thuật ruột thừa..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all resize-none"
                                    />
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 pb-6 flex items-center gap-3 justify-end">
                                <button
                                    onClick={() => { setShowForm(false); setForm(INITIAL_FORM); setErrors({}); }}
                                    className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95 cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="px-6 py-2.5 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                                >
                                    {submitting ? (
                                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Đang lưu...</>
                                    ) : (
                                        <><i className="fa-solid fa-check"></i> Thêm</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UnderMyCarePage;
