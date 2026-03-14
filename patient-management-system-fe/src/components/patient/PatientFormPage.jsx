import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getPatientById, createPatient, updatePatient } from '../../api/patientApi';
import LoadingSpinner from '../LoadingSpinner';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';

const GENDER_OPTIONS = [
    { value: 'male', label: 'Nam', icon: 'fa-mars', color: '#2563eb', bg: 'bg-blue-50', text: 'text-blue-600' },
    { value: 'female', label: 'Nữ', icon: 'fa-venus', color: '#e11d48', bg: 'bg-rose-50', text: 'text-rose-600' },
    { value: 'other', label: 'Khác', icon: 'fa-genderless', color: '#6366f1', bg: 'bg-indigo-50', text: 'text-indigo-600' },
];

const GenderDropdown = ({ value, onChange, error, onBlur }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const selected = GENDER_OPTIONS.find(o => o.value === value);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (opt) => {
        onChange(opt.value);
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            {/* Trigger */}
            <button
                type="button"
                onClick={() => { setOpen(prev => !prev); onBlur?.(); }}
                className={`w-full px-4 py-3 bg-white border ${error ? 'border-red-400 ring-2 ring-red-100' : open ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-300'} rounded-xl transition-all duration-300 text-left flex items-center gap-3 cursor-pointer group shadow-sm`}
            >
                <div className="flex-shrink-0 flex items-center justify-center">
                    {selected ? (
                        <div className={`w-8 h-8 rounded-lg ${selected.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                            <i className={`fa-solid ${selected.icon} text-sm ${selected.text}`}></i>
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            <i className="fa-solid fa-venus-mars text-sm text-gray-400"></i>
                        </div>
                    )}
                </div>
                <span className={`flex-1 font-medium ${selected ? 'text-gray-800' : 'text-gray-400'}`}>
                    {selected ? selected.label : '— Chọn giới tính —'}
                </span>
                <motion.i
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="fa-solid fa-chevron-down text-xs text-gray-400"
                ></motion.i>
            </button>

            {/* Dropdown panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute z-50 top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-[0_12px_40px_rgba(37,99,235,0.12)] overflow-hidden origin-top"
                    >
                        {GENDER_OPTIONS.map((opt, i) => {
                            const isActive = value === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleSelect(opt)}
                                    className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 cursor-pointer ${isActive ? `${opt.bg}` : 'hover:bg-gray-50/80'} ${i < GENDER_OPTIONS.length - 1 ? 'border-b border-gray-50' : ''}`}
                                >
                                    <div className={`w-9 h-9 rounded-lg ${opt.bg} flex items-center justify-center transition-transform duration-200 ${isActive ? 'scale-110 shadow-sm' : 'group-hover:scale-105'}`}>
                                        <i className={`fa-solid ${opt.icon} ${opt.text}`} style={{ fontSize: '15px' }}></i>
                                    </div>
                                    <span className={`flex-1 text-left font-semibold ${isActive ? 'text-gray-800' : 'text-gray-600'}`}>
                                        {opt.label}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-6 h-6 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: opt.color }}
                                        >
                                            <i className="fa-solid fa-check text-white text-[10px]"></i>
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

const PatientFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isEdit = Boolean(id);

    const [pageLoading, setPageLoading] = useState(isEdit);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm({ mode: 'onTouched' });

    const genderValue = watch('gender');

    useEffect(() => {
        if (!isEdit) return;

        const statePatient = location.state?.patient;
        if (statePatient) {
            reset({
                dob: statePatient.Users?.dob || statePatient.dob || '',
                gender: statePatient.Users?.gender || statePatient.gender || '',
                address: statePatient.Users?.address || statePatient.address || ''
            });
            setPageLoading(false);
            return;
        }

        const fetchPatient = async () => {
            try {
                setPageLoading(true);
                const res = await getPatientById(id);
                const p = res.data?.data || res.data;
                reset({
                    dob: p.Users?.dob || p.dob || '',
                    gender: p.Users?.gender || p.gender || '',
                    address: p.Users?.address || p.address || ''
                });
            } catch (err) {
                console.error('Fetch patient failed:', err);
                toast.error('Không tìm thấy thông tin bệnh nhân');
                navigate('/admin/patients');
            } finally {
                setPageLoading(false);
            }
        };
        fetchPatient();
    }, [id, isEdit, reset, navigate, location.state]);

    const onSubmit = async (data) => {
        try {
            if (isEdit) {
                await updatePatient(id, data);
                toast.success('Cập nhật bệnh nhân thành công!');
            } else {
                await createPatient(data);
                toast.success('Thêm bệnh nhân mới thành công!');
            }
            navigate('/admin/patients');
        } catch (err) {
            console.error('Submit failed:', err);
            const msg = err.response?.data?.message || (isEdit ? 'Lỗi khi cập nhật bệnh nhân' : 'Lỗi khi tạo bệnh nhân');
            toast.error(msg);
        }
    };

    if (pageLoading) {
        return (
            <div className="relative flex-1">
                {pageLoading && <LoadingSpinner />}
            </div>
        );
    }

    const inputBase = (hasError) =>
        `w-full px-4 py-3 bg-white border ${hasError ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'} rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all duration-300 text-gray-700 font-medium placeholder-gray-400 shadow-sm`;

    return (
        <div className="min-h-screen font-sans relative" style={{ width: '100vw', background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)' }}>
            {scrollbarStyles}

            {/* Header */}
            <div className="sticky top-0 z-30 border-b border-blue-100/40" style={{ background: 'linear-gradient(180deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,0.9) 100%)', backdropFilter: 'blur(20px) saturate(180%)' }}>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/patients')}
                            className="w-10 h-10 rounded-xl bg-white/70 hover:bg-white border border-gray-200/60 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-all shadow-sm cursor-pointer"
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 mb-1">
                                <div className={`w-2 h-2 rounded-full ${isEdit ? 'bg-amber-400' : 'bg-blue-500'} animate-pulse`}></div>
                                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: isEdit ? '#92400e' : '#1d4ed8' }}>
                                    {isEdit ? 'Chỉnh sửa' : 'Thêm mới'}
                                </span>
                            </div>
                            <h1 className="text-2xl font-extrabold text-gray-900">
                                {isEdit ? 'Chỉnh sửa bệnh nhân' : 'Thêm bệnh nhân mới'}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <motion.form
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden"
                >
                    {/* Form header */}
                    <div className="px-6 py-5 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2.5">
                            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm shadow-lg shadow-blue-500/25">
                                <i className="fa-solid fa-user-pen"></i>
                            </span>
                            Thông tin bệnh nhân
                        </h3>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Ngày sinh */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Ngày sinh <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <i className="fa-regular fa-calendar text-blue-400 text-sm"></i>
                                    </div>
                                    <input
                                        type="date"
                                        {...register('dob', {
                                            required: 'Vui lòng chọn ngày sinh',
                                            validate: (v) => {
                                                if (new Date(v) > new Date()) return 'Ngày sinh không được ở tương lai';
                                                return true;
                                            }
                                        })}
                                        className={`${inputBase(errors.dob)} pl-11`}
                                    />
                                </div>
                                {errors.dob && (
                                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                                        <i className="fa-solid fa-circle-exclamation text-[10px]"></i>
                                        {errors.dob.message}
                                    </p>
                                )}
                            </div>

                            {/* Giới tính */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Giới tính <span className="text-red-400">*</span>
                                </label>
                                <input type="hidden" {...register('gender', { required: 'Vui lòng chọn giới tính' })} />
                                <GenderDropdown
                                    value={genderValue}
                                    onChange={(val) => setValue('gender', val, { shouldValidate: true })}
                                    error={errors.gender}
                                    onBlur={() => { }}
                                />
                                {errors.gender && (
                                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                                        <i className="fa-solid fa-circle-exclamation text-[10px]"></i>
                                        {errors.gender.message}
                                    </p>
                                )}
                            </div>

                            {/* Địa chỉ — full width */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Địa chỉ
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3.5 left-0 pl-4 pointer-events-none">
                                        <i className="fa-solid fa-location-dot text-blue-400 text-sm"></i>
                                    </div>
                                    <textarea
                                        {...register('address')}
                                        rows="3"
                                        className={`${inputBase(false)} pl-11 resize-none`}
                                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                                    ></textarea>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 py-5 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/patients')}
                            className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95 cursor-pointer"
                        >
                            <i className="fa-solid fa-xmark mr-2"></i>
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-floppy-disk"></i>
                                    {isEdit ? 'Cập nhật' : 'Tạo bệnh nhân'}
                                </>
                            )}
                        </button>
                    </div>
                </motion.form>
            </div>
        </div>
    );
};

export default PatientFormPage;
