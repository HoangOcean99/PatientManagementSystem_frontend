import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getDoctorSchedule, addScheduleSlot, deleteScheduleSlot } from '../../api/scheduleApi';
import LoadingSpinner from '../LoadingSpinner';

// ===== HELPERS =====
const formatTime = (t) => (t ? t.slice(0, 5) : '');

const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        days.push(d.toISOString().split('T')[0]); // YYYY-MM-DD
    }
    return days;
};

const formatDateLabel = (dateStr) => {
    if (!dateStr) return { dayLabel: '', dateLabel: '' };
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const tom   = new Date(); tom.setDate(today.getDate() + 1);
    const isSame = (a, b) =>
        a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
    const dayLabel  = isSame(d, today) ? 'Hôm nay' : isSame(d, tom) ? 'Ngày mai'
        : d.toLocaleDateString('vi-VN', { weekday: 'short' });
    const dateLabel = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    return { dayLabel, dateLabel };
};

// ===== COMPONENT =====
const DoctorScheduleManager = ({ doctorId }) => {
    const days = getNext7Days();
    const [selectedDate, setSelectedDate] = useState(days[0]);
    // slots: DoctorSlots[] — schema: slot_id, doctor_id, slot_date, start_time, end_time, is_booked
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    // Add form
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStartTime, setNewStartTime]   = useState('08:00');
    const [newEndTime,   setNewEndTime]     = useState('09:00');
    const [adding, setAdding] = useState(false);

    // ===== FETCH SLOTS từ API thực =====
    const fetchSlots = useCallback(async () => {
        if (!doctorId || !selectedDate) return;
        try {
            setLoading(true);
            const res  = await getDoctorSchedule(doctorId, selectedDate);
            const data = res.data?.data || res.data || [];
            setSlots(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch slots:', err);
            toast.error('Không thể tải lịch làm việc');
        } finally {
            setLoading(false);
        }
    }, [doctorId, selectedDate]);

    useEffect(() => {
        fetchSlots();
    }, [fetchSlots]);

    // ===== ADD SLOT =====
    const handleAddSlot = async () => {
        if (!newStartTime || !newEndTime) {
            toast.error('Vui lòng nhập đủ giờ bắt đầu và kết thúc');
            return;
        }
        if (newStartTime >= newEndTime) {
            toast.error('Giờ bắt đầu phải trước giờ kết thúc!');
            return;
        }
        try {
            setAdding(true);
            await addScheduleSlot(doctorId, selectedDate, newStartTime, newEndTime);
            toast.success('Thêm slot thành công!');
            setShowAddForm(false);
            setNewStartTime('08:00');
            setNewEndTime('09:00');
            fetchSlots(); // Reload
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi khi thêm slot.');
        } finally {
            setAdding(false);
        }
    };

    // ===== DELETE SLOT =====
    const handleDeleteSlot = async (slotId) => {
        if (!window.confirm('Bạn muốn xóa slot này?')) return;
        try {
            await deleteScheduleSlot(doctorId, slotId);
            toast.success('Xóa slot thành công!');
            fetchSlots();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi khi xóa slot.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm">
                        <i className="fa-solid fa-calendar-alt"></i>
                    </span>
                    Quản lý lịch làm việc (DoctorSlots)
                </h3>
            </div>

            {/* Date Selector — 7 ngày tới */}
            <div className="flex gap-2 overflow-x-auto pb-3 custom-scrollbar mb-6">
                {days.map((day) => {
                    const { dayLabel, dateLabel } = formatDateLabel(day);
                    const isSelected = day === selectedDate;
                    return (
                        <button
                            key={day}
                            onClick={() => { setSelectedDate(day); setShowAddForm(false); }}
                            className={`flex-shrink-0 px-4 py-3 rounded-xl border transition-all text-center min-w-[90px] ${
                                isSelected
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                        >
                            <div className="text-xs opacity-80 mb-1">{dayLabel}</div>
                            <div className="font-bold text-base whitespace-nowrap">{dateLabel}</div>
                        </button>
                    );
                })}
            </div>

            {/* Slots Area */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-5">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                        <i className="fa-regular fa-clock text-blue-500"></i>
                        Ca làm việc — {new Date(selectedDate + 'T00:00:00').toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })}
                    </h4>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        <i className={`fa-solid ${showAddForm ? 'fa-times' : 'fa-plus'}`}></i>
                        {showAddForm ? 'Hủy' : 'Thêm Slot Mới'}
                    </button>
                </div>

                {/* Add Form */}
                {showAddForm && (
                    <div className="bg-white p-4 rounded-xl border border-blue-100 mb-5 shadow-sm flex flex-wrap items-end gap-4">
                        <div className="flex-1 min-w-[120px]">
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
                                Giờ bắt đầu (start_time)
                            </label>
                            <input
                                type="time"
                                value={newStartTime}
                                onChange={(e) => setNewStartTime(e.target.value)}
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                            />
                        </div>
                        <div className="flex-1 min-w-[120px]">
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
                                Giờ kết thúc (end_time)
                            </label>
                            <input
                                type="time"
                                value={newEndTime}
                                onChange={(e) => setNewEndTime(e.target.value)}
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                            />
                        </div>
                        <button
                            onClick={handleAddSlot}
                            disabled={adding}
                            className="bg-blue-600 text-white px-6 py-2.5 h-[44px] rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-60 flex items-center gap-2"
                        >
                            {adding && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                            {adding ? 'Đang lưu...' : 'Lưu Slot'}
                        </button>
                    </div>
                )}

                {/* Slots List */}
                {loading ? (
                    <div className="flex justify-center py-10 opacity-60">
                        <LoadingSpinner />
                    </div>
                ) : slots.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <i className="fa-regular fa-calendar-xmark text-4xl mb-3 text-gray-300 block"></i>
                        <p className="text-sm">Chưa có slot khám nào ngày này.</p>
                        <p className="text-xs text-gray-300 mt-1">Nhấn "Thêm Slot Mới" để tạo ca làm việc</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {slots.map((slot) => (
                            <div
                                key={slot.slot_id}
                                className={`group border rounded-xl p-4 flex justify-between items-center transition-all hover:shadow-md ${
                                    slot.is_booked
                                        ? 'bg-orange-50 border-orange-200'
                                        : 'bg-white border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-900 font-extrabold text-base leading-none">
                                        {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                                    </span>
                                    <span className={`text-[11px] px-2 py-0.5 rounded-full inline-block w-max font-bold ${
                                        slot.is_booked
                                            ? 'text-orange-700 bg-orange-100'
                                            : 'text-green-700 bg-green-100'
                                    }`}>
                                        {slot.is_booked ? 'Đã đặt lịch' : 'Còn trống'}
                                    </span>
                                </div>

                                {/* Chỉ cho phép xóa slot chưa đặt */}
                                {!slot.is_booked && (
                                    <button
                                        className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition opacity-0 group-hover:opacity-100"
                                        onClick={() => handleDeleteSlot(slot.slot_id)}
                                        title="Xóa slot"
                                    >
                                        <i className="fa-solid fa-trash-can text-xs"></i>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorScheduleManager;
