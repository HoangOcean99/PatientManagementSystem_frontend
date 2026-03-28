import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllPatients } from '../../api/patientApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';
import toast from 'react-hot-toast';
import { updateUserRoleApi, updateUserStatusApi } from '../../api/userApi';
import Swal from 'sweetalert2';
import Pagination from '../../components/common/Pagination';



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
const PatientRow = ({ patient, index, order, onEdit, onRoleChange, onStatusChange }) => {
    const status = patient.Users?.status || 'active';
    const isActive = status === 'active';
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
                    <div className="flex items-center gap-3 flex-shrink-0" onClick={e => e.stopPropagation()}>
                        <select
                            value="patient"
                            onChange={(e) => onRoleChange(patient.Users?.user_id || patient.user_id, e.target.value)}
                            className="bg-gray-50 hover:bg-white border border-gray-200 text-gray-700 font-medium text-[11px] rounded-lg p-1.5 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm transition-all outline-none"
                        >
                            <option value="patient">Bệnh nhân</option>
                            <option value="doctor">Bác sĩ</option>
                            <option value="admin">Quản trị viên</option>
                            <option value="receptionist">Lễ tân</option>
                            <option value="accountant">Kế toán</option>
                        </select>
                        {onStatusChange && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onStatusChange(patient.Users?.user_id || patient.user_id, isActive ? 'inactive' : 'active'); }}
                                className={`hidden md:inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all active:scale-95 border ${isActive
                                    ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white'
                                    : 'bg-green-50 text-green-700 border-green-100 hover:bg-green-600 hover:text-white'
                                    }`}
                            >
                                <i className={`fa-solid ${isActive ? 'fa-user-slash' : 'fa-user-check'}`}></i>
                                {isActive ? 'Chặn' : 'Kích hoạt'}
                            </button>
                        )}
                        {isActive && (
                            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Hoạt động
                            </span>
                        )}
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

    const handleRoleChange = async (userId, newRole) => {
        const result = await Swal.fire({
            title: 'Thay đổi chức danh?',
            text: "Việc đổi chức danh có thể ảnh hưởng đến quyền truy cập của người dùng này trên hệ thống.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        });

        if (!result.isConfirmed) {
            refetch(); // force reset default UI select
            return;
        }

        try {
            await updateUserRoleApi(userId, newRole);
            toast.success('Cập nhật chức danh thành công');
            refetch();
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi cập nhật chức danh');
        }
    };

    const handleStatusChange = async (userId, newStatus) => {
        const isBanning = newStatus === 'inactive';
        const result = await Swal.fire({
            title: isBanning ? 'Chặn tài khoản?' : 'Kích hoạt tài khoản?',
            text: isBanning
                ? "Người dùng này sẽ không thể đăng nhập vào hệ thống sau khi bị chặn."
                : "Người dùng này sẽ có thể đăng nhập lại vào hệ thống.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: isBanning ? '#d33' : '#3085d6',
            cancelButtonColor: '#aaa',
            confirmButtonText: isBanning ? 'Chặn ngay' : 'Kích hoạt',
            cancelButtonText: 'Hủy'
        });

        if (!result.isConfirmed) return;

        try {
            await updateUserStatusApi(userId, newStatus);
            toast.success(isBanning ? 'Đã chặn tài khoản' : 'Đã kích hoạt tài khoản');
            refetch();
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi cập nhật trạng thái');
        }
    };

    const filtered = useMemo(() => {
        return patients.filter((p) => {
            const combined = `${p.patient_id} ${p.Users?.full_name || ''} ${p.Users?.phone_number || ''}`.toLowerCase();
            const matchSearch = searchTerm ? combined.includes(searchTerm.toLowerCase()) : true;
            return matchSearch;
        });
    }, [patients, searchTerm]);

    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    useEffect(() => setCurrentPage(1), [searchTerm]);

    const stats = useMemo(() => ({
        total: patients.length,
        male: patients.filter(p => p.Users?.gender === 'male').length,
        female: patients.filter(p => p.Users?.gender === 'female').length,
    }), [patients]);

    return (
        <div className="min-h-screen font-sans relative overflow-y-auto" style={{ width: '100%', background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
            {scrollbarStyles}

            {/* ─── Header ─── */}
            <div className="top-0 z-30 border-b border-blue-100/40" style={{ background: 'linear-gradient(180deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(20px) saturate(180%)' }}>
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-6">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                            Quản lý Hồ sơ Bệnh nhân
                        </h1>
                    </div>

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

                        <button
                            onClick={() => setCurrentPage(1)}
                            className="px-7 py-3 rounded-xl font-bold transition-all active:scale-95 whitespace-nowrap cursor-pointer text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
                            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
                        >
                            <i className="fa-solid fa-magnifying-glass mr-2 text-blue-200"></i>
                            Tìm kiếm
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── Content ─── */}
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
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
                            onClick={() => { setSearchTerm(''); refetch(); }}
                            className="mt-6 font-bold text-blue-600 hover:text-blue-700 px-5 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl cursor-pointer transition-colors"
                        >
                            <i className="fa-solid fa-rotate-left mr-2 text-sm"></i>
                            Xóa bộ lọc
                        </button>
                    </motion.div>
                ) : (
                    <>
                        <div className="flex flex-col gap-3 pb-12">
                            <AnimatePresence>
                                {paginated.map((patient, idx) => (
                                    <PatientRow
                                        key={patient.patient_id}
                                        patient={patient}
                                        index={idx}
                                        order={(currentPage - 1) * pageSize + idx + 1}
                                        onEdit={(p) => navigate(`/admin/patients/${p.patient_id}/edit`, { state: { patient: p } })}
                                        onRoleChange={handleRoleChange}
                                        onStatusChange={handleStatusChange}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center mt-10">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PatientListPage;
