import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllPatients } from '../../api/patientApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';
import toast from 'react-hot-toast';

/* ─── Gender Filter Options ─── */
const FILTER_OPTIONS = [
    { value: '', label: 'Tất cả giới tính', icon: 'fa-sliders', color: '#2563eb', bg: 'bg-blue-50', text: 'text-blue-600' },
    { value: 'male', label: 'Nam', icon: 'fa-mars', color: '#2563eb', bg: 'bg-blue-50', text: 'text-blue-600' },
    { value: 'female', label: 'Nữ', icon: 'fa-venus', color: '#e11d48', bg: 'bg-rose-50', text: 'text-rose-600' },
    { value: 'other', label: 'Khác', icon: 'fa-genderless', color: '#6366f1', bg: 'bg-indigo-50', text: 'text-indigo-600' },
];

const GenderFilterDropdown = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const selected = FILTER_OPTIONS.find(o => o.value === value) || FILTER_OPTIONS[0];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="w-full md:w-52 relative">
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen(prev => !prev)}
                className={`w-full px-3 py-3 rounded-xl flex items-center gap-2.5 transition-all duration-300 cursor-pointer ${open ? 'bg-white ring-2 ring-blue-200 shadow-sm' : 'bg-transparent hover:bg-white/80'}`}
            >
                <div className={`w-7 h-7 rounded-lg ${selected.bg} flex items-center justify-center flex-shrink-0 transition-transform duration-300`}>
                    <i className={`fa-solid ${selected.icon} text-xs ${selected.text}`}></i>
                </div>
                <span className="flex-1 text-left font-semibold text-gray-800 text-sm truncate">
                    {selected.label}
                </span>
                <motion.i
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="fa-solid fa-chevron-down text-[10px] text-gray-400"
                ></motion.i>
            </button>

            {/* Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scaleY: 0.96 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: -6, scaleY: 0.96 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-gray-200 shadow-[0_12px_40px_rgba(37,99,235,0.12)] overflow-hidden origin-top"
                    >
                        {FILTER_OPTIONS.map((opt, i) => {
                            const isActive = value === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => { onChange(opt.value); setOpen(false); }}
                                    className={`w-full px-3.5 py-2.5 flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${isActive ? opt.bg : 'hover:bg-gray-50'} ${i < FILTER_OPTIONS.length - 1 ? 'border-b border-gray-100' : ''}`}
                                >
                                    <div className={`w-7 h-7 rounded-lg ${opt.bg} flex items-center justify-center ${isActive ? 'scale-110' : ''} transition-transform duration-200`}>
                                        <i className={`fa-solid ${opt.icon} text-xs ${opt.text}`}></i>
                                    </div>
                                    <span className={`flex-1 text-left text-sm font-semibold ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                                        {opt.label}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-5 h-5 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: opt.color }}
                                        >
                                            <i className="fa-solid fa-check text-white text-[8px]"></i>
                                        </motion.div>
                                    )}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ─── Color palette ─── */
const GENDER_MAP = {
    male: { label: 'Nam', icon: 'fa-mars', accent: '#2563eb', bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500' },
    female: { label: 'Nữ', icon: 'fa-venus', accent: '#e11d48', bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-500' },
    other: { label: 'Khác', icon: 'fa-genderless', accent: '#6366f1', bg: 'bg-indigo-50', text: 'text-indigo-600', dot: 'bg-indigo-500' },
};

const AVATAR_GRADIENTS = [
    'from-blue-500 to-indigo-600',
    'from-indigo-500 to-purple-600',
    'from-blue-400 to-blue-600',
    'from-sky-500 to-blue-600',
    'from-indigo-400 to-blue-600',
    'from-blue-500 to-purple-500',
];

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const calcAge = (dateStr) => {
    if (!dateStr) return null;
    const b = new Date(dateStr), t = new Date();
    let a = t.getFullYear() - b.getFullYear();
    if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--;
    return a;
};

/* ─── Patient Row Card ─── */
const PatientRow = ({ patient, index, order, onEdit }) => {
    const g = GENDER_MAP[patient.Users?.gender] || GENDER_MAP.other;
    const age = calcAge(patient.Users?.dob);
    const name = patient.Users?.full_name || 'Chưa cập nhật';
    const avatar = patient.Users?.avatar_url;
    const initials = name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
    const grad = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="group relative"
            onClick={() => onEdit(patient)}
        >
            {/* Card */}
            <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)] hover:border-blue-200/60 transition-all duration-500 cursor-pointer overflow-hidden">
                {/* Left accent bar */}
                <div className="absolute left-0 top-4 bottom-4 w-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ backgroundColor: g.accent }}></div>

                <div className="p-5 pl-6 flex items-center gap-5">
                    {/* Order number */}
                    <div className="hidden sm:flex flex-shrink-0 w-8 text-right">
                        <span className="text-[13px] font-bold text-gray-300 group-hover:text-blue-500 transition-colors tabular-nums">
                            {String(order).padStart(2, '0')}
                        </span>
                    </div>

                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        {avatar ? (
                            <img src={avatar} alt={name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-sm" />
                        ) : (
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/15 group-hover:shadow-blue-500/30 group-hover:scale-105 transition-all duration-300`}>
                                {initials}
                            </div>
                        )}
                        <div className={`absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-md ${g.bg} flex items-center justify-center ring-[2px] ring-white`}>
                            <i className={`fa-solid ${g.icon} text-[8px] ${g.text}`}></i>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-1.5">
                            <h3 className="text-[15px] font-bold text-gray-800 truncate group-hover:text-blue-700 transition-colors duration-300">
                                {name}
                            </h3>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md ${g.bg} ${g.text}`}>
                                {g.label}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                                <i className="fa-solid fa-fingerprint text-[10px]"></i>
                                <span className="font-mono">{String(patient.patient_id).slice(0, 8)}</span>
                            </span>
                            <span className="w-px h-3 bg-gray-200"></span>
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                                <i className="fa-regular fa-calendar text-[10px] text-blue-400"></i>
                                {formatDate(patient.Users?.dob)}
                            </span>
                            {age !== null && (
                                <>
                                    <span className="w-px h-3 bg-gray-200"></span>
                                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                                        <i className="fa-solid fa-heart-pulse text-[10px] text-rose-300"></i>
                                        {age} tuổi
                                    </span>
                                </>
                            )}
                            {patient.Users?.phone_number && (
                                <>
                                    <span className="w-px h-3 bg-gray-200 hidden sm:block"></span>
                                    <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-500">
                                        <i className="fa-solid fa-phone text-[10px] text-emerald-400"></i>
                                        {patient.Users.phone_number}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Status + Edit */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {patient.Users?.status === 'active' && (
                            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Hoạt động
                            </span>
                        )}
                        <div
                            className="w-9 h-9 rounded-xl bg-gray-50/80 group-hover:bg-blue-50 flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5 cursor-pointer"
                            title="Chỉnh sửa"
                        >
                            <i className="fa-solid fa-pen-to-square text-xs text-gray-300 group-hover:text-blue-600 transition-colors"></i>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

/* ─── Main Page ─── */
const PatientListPage = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                setLoading(true);
                const res = await getAllPatients();
                if (!cancelled) setPatients(res.data?.data || []);
            } catch (err) {
                if (!cancelled) {
                    console.error('Failed to fetch patients:', err);
                    toast.error('Không thể tải danh sách bệnh nhân.');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    const refetch = async () => {
        try {
            setLoading(true);
            const res = await getAllPatients();
            setPatients(res.data?.data || []);
        } catch (err) {
            console.error('Failed to fetch patients:', err);
            toast.error('Không thể tải danh sách bệnh nhân.');
        } finally {
            setLoading(false);
        }
    };

    const filtered = useMemo(() => {
        return patients.filter((p) => {
            const combined = `${p.patient_id} ${p.Users?.full_name || ''} ${p.Users?.phone_number || ''}`.toLowerCase();
            const matchSearch = searchTerm ? combined.includes(searchTerm.toLowerCase()) : true;
            const matchGender = genderFilter ? p.Users?.gender === genderFilter : true;
            return matchSearch && matchGender;
        });
    }, [patients, searchTerm, genderFilter]);

    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    useEffect(() => setCurrentPage(1), [searchTerm, genderFilter]);

    const stats = useMemo(() => ({
        total: patients.length,
        male: patients.filter(p => p.Users?.gender === 'male').length,
        female: patients.filter(p => p.Users?.gender === 'female').length,
    }), [patients]);

    return (
        <div className="min-h-screen font-sans relative" style={{ width: '100vw', background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
            {scrollbarStyles}

            {/* ─── Header ─── */}
            <div className="sticky top-0 z-30 border-b border-blue-100/40" style={{ background: 'linear-gradient(180deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(20px) saturate(180%)' }}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-6">
                    {/* Title area */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 mb-4">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Hệ thống Y tế</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                            Quản lý Hồ sơ Bệnh nhân
                        </h1>
                        <p className="text-sm md:text-base text-gray-500 max-w-lg mx-auto">
                            Tra cứu, theo dõi và quản lý thông tin sức khoẻ toàn diện
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative p-1.5 rounded-2xl bg-white/60 border border-gray-200/60 shadow-lg shadow-blue-500/[0.04] flex flex-col md:flex-row gap-2">
                        <div className="flex-1 relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <i className="fa-solid fa-magnifying-glass text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-11 pr-4 py-3 border-0 rounded-xl bg-transparent focus:bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all placeholder-gray-400 font-medium text-gray-700"
                                placeholder="Tìm theo tên, mã bệnh nhân hoặc SĐT..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <GenderFilterDropdown
                            value={genderFilter}
                            onChange={(val) => setGenderFilter(val)}
                        />

                        <button
                            onClick={() => setCurrentPage(1)}
                            className="px-7 py-3 rounded-xl font-bold transition-all active:scale-95 whitespace-nowrap cursor-pointer text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
                            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
                        >
                            <i className="fa-solid fa-magnifying-glass mr-2 text-blue-200"></i>
                            Tìm kiếm
                        </button>
                        <button
                            onClick={() => navigate('/admin/patients/create')}
                            className="px-7 py-3 rounded-xl font-bold transition-all active:scale-95 whitespace-nowrap cursor-pointer text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5"
                            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }}
                        >
                            <i className="fa-solid fa-user-plus mr-2"></i>
                            Thêm bệnh nhân
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── Content ─── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* Stats bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">
                            {loading ? 'Đang tải...' : `${filtered.length} bệnh nhân`}
                        </h2>
                        {!loading && searchTerm && (
                            <p className="text-xs text-gray-400 mt-0.5">Kết quả cho "{searchTerm}"</p>
                        )}
                    </div>
                    {!loading && patients.length > 0 && (
                        <div className="flex items-center gap-2">
                            {[
                                { label: 'Tổng', value: stats.total, color: 'bg-blue-500' },
                                { label: 'Nam', value: stats.male, color: 'bg-blue-400' },
                                { label: 'Nữ', value: stats.female, color: 'bg-rose-500' },
                            ].map(s => (
                                <div key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/70 border border-gray-100/80 shadow-sm">
                                    <div className={`w-2 h-2 rounded-full ${s.color}`}></div>
                                    <span className="text-xs font-bold text-gray-700">{s.value}</span>
                                    <span className="text-[10px] text-gray-400">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* List */}
                {loading ? (
                    <div className="relative flex-1">
                        {loading && <LoadingSpinner />}
                    </div>
                ) : filtered.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border border-blue-100/30 shadow-sm"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
                            <i className="fa-solid fa-hospital-user text-3xl text-blue-300"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Không tìm thấy bệnh nhân nào</h3>
                        <p className="text-gray-400 mt-2 text-sm">Vui lòng thử lại với từ khóa hoặc bộ lọc khác</p>
                        <button
                            onClick={() => { setSearchTerm(''); setGenderFilter(''); refetch(); }}
                            className="mt-6 font-bold text-blue-600 hover:text-blue-700 px-5 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl cursor-pointer transition-colors"
                        >
                            <i className="fa-solid fa-rotate-left mr-2 text-sm"></i>
                            Xóa bộ lọc
                        </button>
                    </motion.div>
                ) : (
                    <>
                        <div className="flex flex-col gap-3">
                            <AnimatePresence>
                                {paginated.map((patient, idx) => (
                                    <PatientRow
                                        key={patient.patient_id}
                                        patient={patient}
                                        index={idx}
                                        order={(currentPage - 1) * pageSize + idx + 1}
                                        onEdit={(p) => navigate(`/admin/patients/${p.patient_id}/edit`, { state: { patient: p } })}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-1.5 mt-10">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 rounded-xl hover:bg-white/80 flex items-center justify-center text-gray-400 transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    <i className="fa-solid fa-chevron-left text-sm"></i>
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page => {
                                        if (totalPages <= 7) return true;
                                        if (page === 1 || page === totalPages) return true;
                                        return Math.abs(page - currentPage) <= 1;
                                    })
                                    .reduce((acc, page, i, arr) => {
                                        if (i > 0 && page - arr[i - 1] > 1) acc.push('...');
                                        acc.push(page);
                                        return acc;
                                    }, [])
                                    .map((item, i) =>
                                        item === '...' ? (
                                            <span key={`d-${i}`} className="px-2 text-gray-300 text-sm">...</span>
                                        ) : (
                                            <button
                                                key={item}
                                                onClick={() => setCurrentPage(item)}
                                                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all cursor-pointer ${currentPage === item
                                                    ? 'text-white shadow-lg shadow-blue-500/25'
                                                    : 'text-gray-500 hover:bg-white/80'
                                                    }`}
                                                style={currentPage === item ? { background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' } : {}}
                                            >
                                                {item}
                                            </button>
                                        )
                                    )}

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 rounded-xl hover:bg-white/80 flex items-center justify-center text-gray-400 transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    <i className="fa-solid fa-chevron-right text-sm"></i>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PatientListPage;
