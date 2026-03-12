import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../../../supabaseClient';
import { getPatientById, updatePatient } from '../../api/patientApi';
import LoadingSpinner from "../../components/common/LoadingSpinner";
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';

const GENDER_MAP = {
    male: { label: 'Nam', icon: 'fa-mars', color: 'text-blue-600', bg: 'bg-blue-50' },
    female: { label: 'Nữ', icon: 'fa-venus', color: 'text-rose-600', bg: 'bg-rose-50' },
    other: { label: 'Khác', icon: 'fa-genderless', color: 'text-indigo-600', bg: 'bg-indigo-50' },
};

const GENDER_OPTIONS = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' },
];

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

const EditField = ({ label, value, onChange, type = 'text', placeholder, required }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-600">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
        />
    </div>
);

const UserProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({});
    const [userId, setUserId] = useState(null);

    const loadProfile = async () => {
        try {
            const { data: authData } = await supabase.auth.getUser();
            const uid = authData?.user?.id;
            setUserId(uid);
            const res = await getPatientById(uid);
            const data = res.data?.data || res.data || null;
            setProfile(data);
        } catch (err) {
            console.error('Failed to load profile:', err);
            toast.error('Không thể tải thông tin cá nhân');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadProfile(); }, []);

    const startEdit = () => {
        const user = profile?.Users || {};
        setForm({
            full_name: user.full_name || '',
            phone_number: user.phone_number || '',
            dob: profile?.dob || '',
            gender: profile?.gender || 'other',
            address: profile?.address || '',
            allergies: profile?.allergies || '',
            medical_history_summary: profile?.medical_history_summary || '',
        });
        setEditing(true);
    };

    const handleSave = async () => {
        if (!form.full_name?.trim()) {
            toast.error('Vui lòng nhập họ tên');
            return;
        }
        try {
            setSaving(true);
            await updatePatient(userId, form);
            toast.success('Cập nhật thành công!');
            setEditing(false);
            setLoading(true);
            await loadProfile();
        } catch (err) {
            console.error('Failed to update profile:', err);
            toast.error(err.response?.data?.message || 'Cập nhật thất bại');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setForm({});
    };

    if (loading) {
        return (
            <div className="flex-1 h-full flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
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
        <div className="flex-1 h-full overflow-y-auto w-full font-sans relative" style={{ background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
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
                                <div className="flex items-center gap-2">
                                    {!editing && (
                                        <button
                                            onClick={startEdit}
                                            className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all cursor-pointer active:scale-95 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5"
                                            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' }}
                                        >
                                            <i className="fa-solid fa-pen-to-square mr-1.5 text-xs"></i>
                                            Chỉnh sửa
                                        </button>
                                    )}
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
                    </div>

                    {/* Info / Edit */}
                    <AnimatePresence mode="wait">
                        {editing ? (
                            <motion.div
                                key="edit"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                className="bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden"
                            >
                                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2.5">
                                        <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm shadow-lg shadow-blue-500/25">
                                            <i className="fa-solid fa-pen"></i>
                                        </span>
                                        Chỉnh sửa hồ sơ
                                    </h3>
                                </div>
                                <div className="px-6 py-5 space-y-4">
                                    <EditField
                                        label="Họ và tên"
                                        value={form.full_name}
                                        onChange={(v) => setForm(p => ({ ...p, full_name: v }))}
                                        placeholder="Nguyễn Văn A"
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <EditField
                                            label="Ngày sinh"
                                            type="date"
                                            value={form.dob}
                                            onChange={(v) => setForm(p => ({ ...p, dob: v }))}
                                            required
                                        />
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-600">Giới tính</label>
                                            <select
                                                value={form.gender}
                                                onChange={(e) => setForm(p => ({ ...p, gender: e.target.value }))}
                                                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all cursor-pointer"
                                            >
                                                {GENDER_OPTIONS.map(g => (
                                                    <option key={g.value} value={g.value}>{g.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <EditField
                                        label="Số điện thoại"
                                        value={form.phone_number}
                                        onChange={(v) => setForm(p => ({ ...p, phone_number: v }))}
                                        placeholder="0901234567"
                                    />
                                    <EditField
                                        label="Địa chỉ"
                                        value={form.address}
                                        onChange={(v) => setForm(p => ({ ...p, address: v }))}
                                        placeholder="123 Nguyễn Văn Cừ, Q5, TP.HCM"
                                    />
                                    <EditField
                                        label="Dị ứng"
                                        value={form.allergies}
                                        onChange={(v) => setForm(p => ({ ...p, allergies: v }))}
                                        placeholder="VD: Dị ứng penicillin, hải sản..."
                                    />
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-600">Tiền sử bệnh</label>
                                        <textarea
                                            value={form.medical_history_summary || ''}
                                            onChange={(e) => setForm(p => ({ ...p, medical_history_summary: e.target.value }))}
                                            placeholder="VD: Hen suyễn từ nhỏ, đã phẫu thuật ruột thừa..."
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all resize-none"
                                        />
                                    </div>
                                </div>
                                <div className="px-6 pb-6 flex items-center gap-3 justify-end">
                                    <button
                                        onClick={handleCancel}
                                        className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95 cursor-pointer"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-6 py-2.5 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                                    >
                                        {saving ? (
                                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Đang lưu...</>
                                        ) : (
                                            <><i className="fa-solid fa-check"></i> Lưu thay đổi</>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="view"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden"
                            >
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
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default UserProfilePage;
