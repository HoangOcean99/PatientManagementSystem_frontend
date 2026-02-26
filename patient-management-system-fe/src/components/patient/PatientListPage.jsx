import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllPatients } from '../../api/patientApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';
import toast from 'react-hot-toast';

/* ─── Color palette: Fruit Aegeo ─── */
const GENDER_MAP = {
    male: { label: 'Nam', icon: 'fa-mars', accent: '#0ea5e9', bg: 'bg-sky-50', text: 'text-sky-600', dot: 'bg-sky-400' },
    female: { label: 'Nữ', icon: 'fa-venus', accent: '#f472b6', bg: 'bg-pink-50', text: 'text-pink-500', dot: 'bg-pink-400' },
    other: { label: 'Khác', icon: 'fa-genderless', accent: '#fbbf24', bg: 'bg-amber-50', text: 'text-amber-500', dot: 'bg-amber-400' },
};

const AVATAR_GRADIENTS = [
    'from-teal-400 to-cyan-500',
    'from-sky-400 to-blue-500',
    'from-emerald-400 to-teal-500',
    'from-cyan-400 to-sky-500',
    'from-blue-400 to-indigo-500',
    'from-teal-300 to-emerald-500',
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
const PatientRow = ({ patient, index, order }) => {
    const g = GENDER_MAP[patient.gender] || GENDER_MAP.other;
    const age = calcAge(patient.dob);
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
        >
            {/* Card */}
            <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-teal-200/60 transition-all duration-500 cursor-pointer overflow-hidden">
                {/* Left accent bar */}
                <div className="absolute left-0 top-4 bottom-4 w-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ backgroundColor: g.accent }}></div>

                <div className="p-5 pl-6 flex items-center gap-5">
                    {/* Order number */}
                    <div className="hidden sm:flex flex-shrink-0 w-8 text-right">
                        <span className="text-[13px] font-bold text-gray-300 group-hover:text-teal-400 transition-colors tabular-nums">
                            {String(order).padStart(2, '0')}
                        </span>
                    </div>

                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        {avatar ? (
                            <img src={avatar} alt={name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-sm" />
                        ) : (
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-teal-500/15 group-hover:shadow-teal-500/30 group-hover:scale-105 transition-all duration-300`}>
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
                            <h3 className="text-[15px] font-bold text-gray-800 truncate group-hover:text-teal-700 transition-colors duration-300">
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
                                <i className="fa-regular fa-calendar text-[10px] text-teal-400"></i>
                                {formatDate(patient.dob)}
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

                    {/* Status + Arrow */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {patient.Users?.status === 'active' && (
                            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Hoạt động
                            </span>
                        )}
                        <div className="w-9 h-9 rounded-xl bg-gray-50/80 group-hover:bg-teal-50 flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5">
                            <i className="fa-solid fa-arrow-right text-xs text-gray-300 group-hover:text-teal-500 transition-colors"></i>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

/* ─── Main Page ─── */
const PatientListPage = () => {
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
            const matchGender = genderFilter ? p.gender === genderFilter : true;
            return matchSearch && matchGender;
        });
    }, [patients, searchTerm, genderFilter]);

    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    useEffect(() => setCurrentPage(1), [searchTerm, genderFilter]);

    const stats = useMemo(() => ({
        total: patients.length,
        male: patients.filter(p => p.gender === 'male').length,
        female: patients.filter(p => p.gender === 'female').length,
    }), [patients]);

    return (
        <div className="min-h-screen font-sans relative" style={{ width: '100vw', background: 'linear-gradient(160deg, #f0fdfa 0%, #f8fafc 30%, #fdf4ff 60%, #ecfdf5 100%)' }}>
            {scrollbarStyles}

            {/* ─── Decorative Elements ─── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {/* Soft organic blobs */}
                <div className="absolute -top-24 right-0 w-[600px] h-[600px] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #99f6e4 0%, transparent 70%)' }}></div>
                <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #a5f3fc 0%, transparent 70%)' }}></div>
                <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #fbcfe8 0%, transparent 70%)' }}></div>
                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, #0d9488 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
            </div>

            {/* ─── Header ─── */}
            <div className="sticky top-0 z-30 border-b border-teal-100/40" style={{ background: 'linear-gradient(180deg, rgba(240,253,250,0.95) 0%, rgba(255,255,255,0.85) 100%)', backdropFilter: 'blur(20px) saturate(180%)' }}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-6">
                    {/* Title area */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 mb-4">
                            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
                            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Hệ thống Y tế</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: '#134e4a' }}>
                            Quản lý Hồ sơ Bệnh nhân
                        </h1>
                        <p className="text-sm md:text-base text-teal-600/60 max-w-lg mx-auto">
                            Tra cứu, theo dõi và quản lý thông tin sức khoẻ toàn diện
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative p-1.5 rounded-2xl bg-white/60 border border-teal-100/50 shadow-lg shadow-teal-500/[0.03] flex flex-col md:flex-row gap-2">
                        <div className="flex-1 relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <i className="fa-solid fa-magnifying-glass text-teal-300 group-focus-within:text-teal-500 transition-colors"></i>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-11 pr-4 py-3 border-0 rounded-xl bg-transparent focus:bg-white focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all placeholder-gray-400 font-medium text-gray-700"
                                placeholder="Tìm theo tên, mã bệnh nhân hoặc SĐT..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="w-full md:w-52 relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fa-solid fa-sliders text-teal-300 group-focus-within:text-teal-500 transition-colors"></i>
                            </div>
                            <select
                                className="block w-full pl-10 pr-8 py-3 border-0 rounded-xl bg-transparent focus:bg-white focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all font-medium appearance-none cursor-pointer text-gray-700 hover:bg-white/80"
                                value={genderFilter}
                                onChange={(e) => setGenderFilter(e.target.value)}
                            >
                                <option value="">Tất cả giới tính</option>
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>

                        <button
                            onClick={() => setCurrentPage(1)}
                            className="px-7 py-3 rounded-xl font-bold transition-all active:scale-95 whitespace-nowrap cursor-pointer text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30"
                            style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' }}
                        >
                            <i className="fa-solid fa-magnifying-glass mr-2 text-teal-200"></i>
                            Tìm kiếm
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
                                { label: 'Tổng', value: stats.total, color: 'bg-teal-400' },
                                { label: 'Nam', value: stats.male, color: 'bg-sky-400' },
                                { label: 'Nữ', value: stats.female, color: 'bg-pink-400' },
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
                    <div className="flex flex-col justify-center items-center h-48 gap-3">
                        <LoadingSpinner />
                        <span className="text-sm text-teal-500/60 font-medium">Đang tải dữ liệu...</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border border-teal-100/30 shadow-sm"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-5">
                            <i className="fa-solid fa-hospital-user text-3xl text-teal-300"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Không tìm thấy bệnh nhân nào</h3>
                        <p className="text-gray-400 mt-2 text-sm">Vui lòng thử lại với từ khóa hoặc bộ lọc khác</p>
                        <button
                            onClick={() => { setSearchTerm(''); setGenderFilter(''); refetch(); }}
                            className="mt-6 font-bold text-teal-600 hover:text-teal-700 px-5 py-2 bg-teal-50 hover:bg-teal-100 rounded-xl cursor-pointer transition-colors"
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
                                                        ? 'text-white shadow-lg shadow-teal-500/25'
                                                        : 'text-gray-500 hover:bg-white/80'
                                                    }`}
                                                style={currentPage === item ? { background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' } : {}}
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
