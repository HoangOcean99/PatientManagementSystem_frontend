import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';
import { getDoctorById } from '../../api/doctorApi';
import {
    getDoctorSchedule,
    addScheduleSlot,
    deleteScheduleSlot,
} from '../../api/scheduleApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

// ===== HELPERS =====
const formatTime = (t) => {
    if (!t) return '';
    return t.slice(0, 5); // "HH:MM:SS" → "HH:MM"
};

const formatDateLabel = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const tom = new Date(); tom.setDate(today.getDate() + 1);

    const isSameDay = (a, b) =>
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear();

    const dayLabel = isSameDay(d, today)
        ? 'Hôm nay'
        : isSameDay(d, tom)
            ? 'Ngày mai'
            : d.toLocaleDateString('vi-VN', { weekday: 'short' });

    const dateLabel = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    return { dayLabel, dateLabel };
};

// Tạo danh sách 7 ngày kể từ hôm nay
const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        days.push(d.toISOString().split('T')[0]); // YYYY-MM-DD
    }
    return days;
};

// ===== SUB-COMPONENT: Slot Management Panel (Admin) =====
const SlotManagementPanel = ({ doctorId }) => {
    const [slots, setSlots] = useState([]); // { slot_date, slots: [...] }
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedDate, setSelectedDate] = useState(getNext7Days()[0]);
    const [addForm, setAddForm] = useState({ startTime: '', endTime: '' });
    const [adding, setAdding] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchSlots = useCallback(async (date) => {
        try {
            setLoadingSlots(true);
            const res = await getDoctorSchedule(doctorId, date);
            const raw = res.data?.data || res.data || [];
            setSlots(Array.isArray(raw) ? raw : []);
        } catch (err) {
            console.error('Failed to fetch slots:', err);
            toast.error('Không thể tải lịch làm việc');
        } finally {
            setLoadingSlots(false);
        }
    }, [doctorId]);

    useEffect(() => {
        if (doctorId && selectedDate) {
            fetchSlots(selectedDate);
        }
    }, [doctorId, selectedDate, fetchSlots]);

    const handleAddSlot = async () => {
        if (!addForm.startTime || !addForm.endTime) {
            toast.error('Vui lòng nhập đủ giờ bắt đầu và kết thúc');
            return;
        }
        if (addForm.startTime >= addForm.endTime) {
            toast.error('Giờ kết thúc phải sau giờ bắt đầu');
            return;
        }
        try {
            setAdding(true);
            await addScheduleSlot(doctorId, selectedDate, addForm.startTime, addForm.endTime);
            toast.success('Thêm slot thành công');
            setAddForm({ startTime: '', endTime: '' });
            setShowAddForm(false);
            fetchSlots(selectedDate);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Thêm slot thất bại');
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteSlot = async (slotId) => {
        if (!window.confirm('Xác nhận xóa slot này?')) return;
        try {
            await deleteScheduleSlot(doctorId, slotId);
            toast.success('Đã xóa slot');
            fetchSlots(selectedDate);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Xóa slot thất bại');
        }
    };

    const days = getNext7Days();

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-5 text-white">
                <h3 className="text-base font-extrabold flex items-center gap-2">
                    <i className="fa-regular fa-calendar-check"></i>
                    Quản lý Lịch Làm Việc
                </h3>
                <p className="text-gray-400 text-xs mt-1">Thêm / Xóa slot theo từng ngày</p>
            </div>

            {/* Day Selector */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {days.map((day) => {
                        const { dayLabel, dateLabel } = formatDateLabel(day);
                        const isSelected = day === selectedDate;
                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDate(day)}
                                className={`flex-shrink-0 px-3 py-2.5 rounded-xl text-center min-w-[72px] transition-all border text-xs font-bold ${isSelected
                                    ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                                    }`}
                            >
                                <div className="opacity-70">{dayLabel}</div>
                                <div className="font-extrabold">{dateLabel}</div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Slots List */}
            <div className="p-4">
                {loadingSlots ? (
                    <div className="flex justify-center py-6 opacity-50">
                        <LoadingSpinner />
                    </div>
                ) : slots.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                        <i className="fa-regular fa-clock text-3xl mb-2 block"></i>
                        <p className="text-sm">Chưa có slot nào ngày này</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {slots.map((slot) => (
                            <div
                                key={slot.slot_id}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold transition-all ${slot.is_booked
                                    ? 'bg-orange-50 border-orange-200 text-orange-700'
                                    : 'bg-green-50 border-green-200 text-green-700'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <i className={`fa-regular fa-clock text-sm ${slot.is_booked ? 'text-orange-400' : 'text-green-500'}`}></i>
                                    <span>
                                        {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                                    </span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${slot.is_booked ? 'bg-orange-200 text-orange-800' : 'bg-green-200 text-green-800'
                                        }`}>
                                        {slot.is_booked ? 'Đã đặt' : 'Trống'}
                                    </span>
                                </div>
                                {!slot.is_booked && (
                                    <button
                                        onClick={() => handleDeleteSlot(slot.slot_id)}
                                        className="ml-2 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                                        title="Xóa slot"
                                    >
                                        <i className="fa-solid fa-trash text-xs"></i>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Slot */}
                <div className="mt-4">
                    {!showAddForm ? (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 text-sm font-bold transition-all flex items-center justify-center gap-2"
                        >
                            <i className="fa-solid fa-plus"></i>
                            Thêm slot mới
                        </button>
                    ) : (
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
                            <p className="text-xs font-extrabold text-blue-700 uppercase tracking-wide">
                                Thêm slot — {selectedDate}
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs text-gray-500 font-bold mb-1 block">Giờ bắt đầu</label>
                                    <input
                                        type="time"
                                        value={addForm.startTime}
                                        onChange={(e) => setAddForm((p) => ({ ...p, startTime: e.target.value }))}
                                        className="w-full px-3 py-2 border border-blue-200 rounded-xl text-sm font-bold bg-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 font-bold mb-1 block">Giờ kết thúc</label>
                                    <input
                                        type="time"
                                        value={addForm.endTime}
                                        onChange={(e) => setAddForm((p) => ({ ...p, endTime: e.target.value }))}
                                        className="w-full px-3 py-2 border border-blue-200 rounded-xl text-sm font-bold bg-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddSlot}
                                    disabled={adding}
                                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                                >
                                    {adding ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-check"></i>}
                                    {adding ? 'Đang thêm...' : 'Xác nhận'}
                                </button>
                                <button
                                    onClick={() => { setShowAddForm(false); setAddForm({ startTime: '', endTime: '' }); }}
                                    className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ===== SUB-COMPONENT: Patient Booking Panel =====
const BookingPanel = ({ doctorId }) => {
    const [days] = useState(getNext7Days());
    const [selectedDate, setSelectedDate] = useState(days[0]);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const fetchSlots = useCallback(async (date) => {
        try {
            setLoadingSlots(true);
            const res = await getDoctorSchedule(doctorId, date);
            const raw = res.data?.data || res.data || [];
            // Chỉ lấy slot còn trống
            setSlots((Array.isArray(raw) ? raw : []).filter((s) => !s.is_booked));
        } catch (err) {
            console.error('Failed to fetch slots:', err);
        } finally {
            setLoadingSlots(false);
        }
    }, [doctorId]);

    useEffect(() => {
        if (doctorId && selectedDate) {
            setSelectedSlot(null);
            fetchSlots(selectedDate);
        }
    }, [doctorId, selectedDate, fetchSlots]);

    return (
        <div className="sticky top-28 bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-tr from-blue-700 to-blue-500 p-6 text-white text-center">
                <h3 className="text-lg font-bold mb-1">Đặt lịch khám</h3>
                <p className="text-blue-100 text-xs mt-1">Chọn ngày và khung giờ phù hợp</p>
            </div>

            <div className="p-5">
                {/* Date Selector */}
                <h4 className="font-extrabold text-gray-700 mb-3 flex items-center gap-2 text-xs uppercase tracking-wider">
                    <i className="fa-regular fa-calendar text-blue-500"></i>
                    Chọn ngày
                </h4>
                <div className="flex gap-2 overflow-x-auto pb-3 custom-scrollbar mb-5">
                    {days.map((day) => {
                        const { dayLabel, dateLabel } = formatDateLabel(day);
                        const isSelected = day === selectedDate;
                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDate(day)}
                                className={`flex-shrink-0 px-3 py-2.5 rounded-xl border transition-all text-center min-w-[68px] ${isSelected
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200/50'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                    }`}
                            >
                                <div className="text-[10px] opacity-75 mb-0.5">{dayLabel}</div>
                                <div className="font-extrabold text-xs">{dateLabel}</div>
                            </button>
                        );
                    })}
                </div>

                {/* Time Slots */}
                <h4 className="font-extrabold text-gray-700 mb-3 flex items-center gap-2 text-xs uppercase tracking-wider">
                    <i className="fa-regular fa-clock text-blue-500"></i>
                    Khung giờ trống
                </h4>

                {loadingSlots ? (
                    <div className="flex justify-center py-4 opacity-50">
                        <LoadingSpinner />
                    </div>
                ) : slots.length === 0 ? (
                    <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-2xl mb-5">
                        <i className="fa-regular fa-calendar-xmark text-2xl mb-2 block"></i>
                        <p className="text-sm">Không còn slot trống ngày này</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        {slots.map((slot) => {
                            const label = `${formatTime(slot.start_time)}–${formatTime(slot.end_time)}`;
                            const isSelected = selectedSlot?.slot_id === slot.slot_id;
                            return (
                                <button
                                    key={slot.slot_id}
                                    onClick={() => setSelectedSlot(isSelected ? null : slot)}
                                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all ${isSelected
                                        ? 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-500 ring-offset-1'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50'
                                        }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* CTA */}
                <button
                    disabled={!selectedSlot}
                    className={`w-full py-4 rounded-xl font-extrabold text-sm transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 ${selectedSlot
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/30'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        }`}
                >
                    <i className={`fa-solid ${selectedSlot ? 'fa-calendar-check' : 'fa-calendar'}`}></i>
                    {selectedSlot
                        ? `Đặt ${formatTime(selectedSlot.start_time)} – ${formatTime(selectedSlot.end_time)}`
                        : 'Vui lòng chọn khung giờ'}
                </button>

                <p className="text-center text-[11px] text-gray-400 mt-4 flex items-center justify-center gap-1.5">
                    <i className="fa-solid fa-shield-halved"></i>
                    Bảo mật thông tin thanh toán & y tế
                </p>
            </div>
        </div>
    );
};

// ===== MAIN COMPONENT =====
const DoctorProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isAdminView = location.pathname.includes('/admin/');

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetch = async () => {
            try {
                setLoading(true);
                const res = await getDoctorById(id);
                setDoctor(res.data?.data || res.data);
            } catch (err) {
                console.error('Error fetching doctor:', err);
                toast.error('Không tìm thấy thông tin bác sĩ');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ width: '100vw' }}>
            <LoadingSpinner />
        </div>
    );

    if (!doctor) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center" style={{ width: '100vw' }}>
            <i className="fa-solid fa-user-doctor text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-bold text-gray-700">Không tìm thấy bác sĩ</h3>
            <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 font-bold hover:underline">
                Quay lại danh sách
            </button>
        </div>
    );

    // Map fields từ schema: Doctors join Users, Rooms, Departments
    const name = doctor.Users?.full_name || 'Chưa cập nhật tên';
    const avatar = doctor.Users?.avatar_url || 'https://i.pravatar.cc/150?img=11';
    const specialty = doctor.specialization || 'Chuyên khoa chung';
    const bio = doctor.bio || 'Bác sĩ chưa cập nhật phần giới thiệu.';
    const roomNumber = doctor.Rooms?.room_number || doctor.room_number || 'Chưa xếp';
    const department = doctor.Departments?.name || doctor.department_name || '';
    const isActive = doctor.Users?.status === 'active';
    const phone = doctor.Users?.phone_number || '';
    const email = doctor.Users?.email || '';

    return (
        <div className="min-h-screen bg-gray-50/50 pb-16 font-sans" style={{ width: '100vw' }}>
            {scrollbarStyles}

            {/* Top Nav */}
            <div className={`sticky top-0 z-40 backdrop-blur-md border-b border-gray-100 ${isAdminView ? 'bg-white/95' : 'bg-white/85'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-colors hover:bg-gray-100 px-3 py-1.5 rounded-xl"
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>Quay lại</span>
                    </button>

                    {isAdminView && (
                        <button
                            onClick={() => navigate(`/admin/doctors/${id}`)}
                            className="bg-gray-800 text-white hover:bg-black px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 active:scale-95"
                        >
                            <i className="fa-solid fa-pen-to-square"></i>
                            Mở Form Chỉnh Sửa
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                    {/* ===== LEFT: Doctor Info ===== */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Profile Hero Card */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
                            {isAdminView && !isActive && (
                                <div className="absolute top-6 right-[-45px] bg-red-500 text-white text-[12px] font-bold px-12 py-1 rotate-45 shadow-sm text-center">
                                    TẠM NGƯNG
                                </div>
                            )}

                            {/* Avatar */}
                            <div className="relative mx-auto md:mx-0 flex-shrink-0">
                                <img
                                    src={avatar}
                                    alt={name}
                                    className="w-36 h-36 md:w-48 md:h-48 rounded-[2rem] object-cover shadow-lg border-4 border-white bg-gray-50"
                                />
                                <div className={`absolute -bottom-3 -right-2 text-xs font-bold px-3 py-1 rounded-full border-[3px] border-white shadow-sm flex items-center gap-1.5 ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                    {isActive ? 'Hoạt động' : 'Tạm ngưng'}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 w-full text-center md:text-left">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg text-sm">
                                        {specialty}
                                    </span>
                                    {department && (
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 font-bold rounded-lg text-xs">
                                            {department}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-5">
                                    Bs. {name}
                                </h1>

                                {/* Meta chips */}
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                        <i className="fa-solid fa-house-medical text-blue-500"></i>
                                        <span className="font-medium">Phòng {roomNumber}</span>
                                    </div>
                                    {phone && (
                                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                            <i className="fa-solid fa-phone text-green-500"></i>
                                            <span className="font-medium">{phone}</span>
                                        </div>
                                    )}
                                    {email && (
                                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                            <i className="fa-solid fa-envelope text-orange-400"></i>
                                            <span className="font-medium">{email}</span>
                                        </div>
                                    )}
                                    {!isAdminView && (
                                        <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-2 rounded-xl font-bold border border-yellow-100">
                                            <i className="fa-solid fa-star text-yellow-500"></i>
                                            <span>5.0 (100 đánh giá)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Bio */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <i className="fa-solid fa-address-card text-sm"></i>
                                    </span>
                                    Giới thiệu chuyên môn
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                                    {bio}
                                </p>
                            </div>

                            {/* Room & Department Info */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <i className="fa-solid fa-hospital text-sm"></i>
                                    </span>
                                    Thông tin phòng khám
                                </h3>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-center gap-3">
                                        <i className="fa-solid fa-door-open text-indigo-400 w-4"></i>
                                        <span className="text-gray-500">Phòng:</span>
                                        <span className="font-bold text-gray-800">
                                            {roomNumber}
                                        </span>
                                    </li>
                                    {department && (
                                        <li className="flex items-center gap-3">
                                            <i className="fa-solid fa-building-columns text-indigo-400 w-4"></i>
                                            <span className="text-gray-500">Khoa:</span>
                                            <span className="font-bold text-gray-800">{department}</span>
                                        </li>
                                    )}
                                    <li className="flex items-center gap-3">
                                        <i className="fa-solid fa-stethoscope text-indigo-400 w-4"></i>
                                        <span className="text-gray-500">Chuyên khoa:</span>
                                        <span className="font-bold text-gray-800">{specialty}</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <i className={`fa-solid fa-circle text-[10px] w-4 ${isActive ? 'text-green-500' : 'text-gray-400'}`}></i>
                                        <span className="text-gray-500">Trạng thái:</span>
                                        <span className={`font-bold ${isActive ? 'text-green-700' : 'text-gray-500'}`}>
                                            {isActive ? 'Đang hoạt động' : 'Tạm ngưng'}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ===== RIGHT: Booking / Slot Management ===== */}
                    <div className="lg:col-span-1">
                        {isAdminView ? (
                            <SlotManagementPanel doctorId={id} />
                        ) : (
                            <BookingPanel doctorId={id} />
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DoctorProfilePage;
