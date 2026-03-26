import React, { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { vi } from 'date-fns/locale';
import {
    getListAppointments,
    getAvailableDoctorSlots,
    rescheduleAppointment,
    updateAppointmentStatus,
    cancelAppointment,
} from '../../api/appointmentApi';

const toYMD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const parseYMD = (s) => {
    if (!s) return null;
    const parts = String(s).split('-').map(Number);
    const [y, m, d] = parts;
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
};

const slotTimeKey = (t) => (t != null ? String(t).slice(0, 5) : '');

const Dashboard = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [selectedApt, setSelectedApt] = useState(null); // Lưu dữ liệu của đơn đang chọn
    const [showModal, setShowModal] = useState(false);    // Trạng thái hiển thị modal
    const [isEditing, setIsEditing] = useState(false);       // Trạng thái Xem hay Sửa
    /** Toàn bộ slot trống theo khoa (getAvailableDoctorSlots) — đổi lịch: Ngày → Giờ → Bác sĩ */
    const [rescheduleSlots, setRescheduleSlots] = useState([]);
    const [rescheduleSlotsLoading, setRescheduleSlotsLoading] = useState(false);
    const [editFormData, setEditFormData] = useState({
        date: '',
        startTime: '',
        slotId: '',
        doctorId: '',
    });

    // State lưu danh sách metadata để hiển thị trong menu lọc
    const [departments, setDepartments] = useState([]);
    const [services, setServices] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [statuses, setStatuses] = useState([]);

    // Quản lý dropdown lọc nào đang mở
    const [activeFilter, setActiveFilter] = useState(null);

    const [filters, setFilters] = useState({
        patientName: '',
        department: '',
        service: '',
        doctor: '',
        status: ''
    });

    // 1. Logic Lọc dữ liệu - filteredData dùng để hiển thị trên Table
    const filteredData = appointments.filter(apt => {
        return (
            (apt.Patients?.Users?.full_name || "").toLowerCase().includes(filters.patientName.toLowerCase()) &&
            (apt.ClinicServices?.Departments?.name || "").includes(filters.department) &&
            (apt.ClinicServices?.name || "").includes(filters.service) &&
            (apt.Doctors?.Users?.full_name || "").includes(filters.doctor) &&
            (apt.status || "").includes(filters.status)
        );
    });

    // 2. Cập nhật danh sách gợi ý trong menu lọc khi dữ liệu thay đổi (Cascading Filter)
    useEffect(() => {
        if (appointments.length > 0) {
            // Lọc danh sách dựa trên dữ liệu đang hiển thị (filteredData)
            const getUnique = (arr, path) => {
                const values = arr.map(item => path.split('.').reduce((obj, key) => obj?.[key], item));
                return [...new Set(values)].filter(Boolean);
            };
            setDepartments(getUnique(filteredData, 'ClinicServices.Departments.name'));
            setDoctors(getUnique(filteredData, 'Doctors.Users.full_name'));
            setServices(getUnique(filteredData, 'ClinicServices.name'));
            setStatuses(getUnique(filteredData, 'status'));
        }
    }, [appointments, filters]);

    // 3. Gọi API lấy dữ liệu theo ngày
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const yyyy = selectedDate.getFullYear();
                const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const dd = String(selectedDate.getDate()).padStart(2, '0');
                const dateString = `${yyyy}-${mm}-${dd}`;

                const response = await getListAppointments({ date: dateString });
                const responseData = response.data?.data || response?.data || response || [];
                console.log(responseData);
                setAppointments(Array.isArray(responseData) ? responseData : []);
            } catch (error) {
                console.error("Lỗi fetch:", error);
                setAppointments([]);
            }
        };
        fetchAppointments();
    }, [selectedDate]);

    const stats = {
        checkIn: appointments?.filter(apt => apt?.status === 'checked_in' || apt?.status === 'CHECKEDIN').length || 0,
        today: appointments?.length || 0,
        completed: appointments?.filter(apt => apt?.status === 'completed').length || 0
    };

    const formatDateToVN = (date) => {
        const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        return `${days[date.getDay()]}, ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    const toggleFilter = (col) => setActiveFilter(activeFilter === col ? null : col);

    const handleCheckIn = async (id) => {
        try {
            // 1. Giả sử cậu gọi API ở đây (cậu có thể viết hàm này trong appointmentApi.js)
            // await updateStatus(id, 'checkined'); 
            const response = await updateAppointmentStatus(id, { status: 'checked_in' });
            // 2. Cập nhật giao diện ngay lập tức mà không cần load lại trang
            setAppointments(prev =>
                prev.map(item => item.appointment_id === id ? { ...item, status: 'checked_in' } : item)
            );

            setShowModal(false); // Đóng hộp thoại
            alert("Bệnh nhân đã Check-in thành công!");
        } catch (error) {
            alert("Có lỗi xảy ra khi Check-in");
        }
    };

    const canCancelAppointment = (status) => {
        const normalizedStatus = String(status || '').toLowerCase();
        return normalizedStatus === 'pending' || normalizedStatus === 'confirmed';
    };

    const canRescheduleAppointment = (status) => {
        const normalizedStatus = String(status || '').toLowerCase();
        const allowedStatuses = ['pending', 'cancel', 'cancelled', 'confirmed', 'completed'];
        return allowedStatuses.includes(normalizedStatus);
    };

    const getStatusClassName = (status) => {
        const normalizedStatus = String(status || '').toLowerCase();
        const statusColorMap = {
            pending: 'bg-amber-100 text-amber-700',
            confirmed: 'bg-emerald-100 text-emerald-700',
            checked_in: 'bg-blue-100 text-blue-700',
            checkin: 'bg-blue-100 text-blue-700',
            checkedin: 'bg-blue-100 text-blue-700',
            completed: 'bg-violet-100 text-violet-700',
            cancelled: 'bg-rose-100 text-rose-700',
            no_show: 'bg-slate-200 text-slate-700',
            in_progress: 'bg-cyan-100 text-cyan-700',
        };

        return statusColorMap[normalizedStatus] || 'bg-gray-100 text-gray-700';
    };

    const handleCancelAppointment = async () => {
        if (!selectedApt?.appointment_id) return;
        if (!canCancelAppointment(selectedApt.status)) {
            alert('Chỉ lịch hẹn ở trạng thái pending hoặc confirmed mới có thể hủy.');
            return;
        }

        const confirmed = window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này không?');
        if (!confirmed) return;

        try {
            await cancelAppointment(selectedApt.appointment_id);

            setAppointments((prev) =>
                prev.map((item) =>
                    item.appointment_id === selectedApt.appointment_id
                        ? { ...item, status: 'cancelled' }
                        : item
                )
            );
            setSelectedApt((prev) => (prev ? { ...prev, status: 'cancelled' } : prev));
            alert('Hủy lịch hẹn thành công!');
        } catch (error) {
            alert(error?.response?.data?.message || 'Có lỗi xảy ra khi hủy lịch hẹn.');
        }
    };

    const rescheduleIncludeDates = useMemo(() => {
        const keys = [...new Set(rescheduleSlots.map((s) => s.slot_date).filter(Boolean))].sort();
        return keys.map((k) => parseYMD(k)).filter(Boolean);
    }, [rescheduleSlots]);

    const slotsTheoNgay = useMemo(
        () => rescheduleSlots.filter((s) => s.slot_date === editFormData.date),
        [rescheduleSlots, editFormData.date]
    );

    const uniqueStartTimes = useMemo(() => {
        const set = new Set(slotsTheoNgay.map((s) => slotTimeKey(s.start_time)));
        return [...set].sort();
    }, [slotsTheoNgay]);

    const doctorsForSelectedTime = useMemo(() => {
        if (!editFormData.startTime) return [];
        return slotsTheoNgay.filter((s) => slotTimeKey(s.start_time) === editFormData.startTime);
    }, [slotsTheoNgay, editFormData.startTime]);

    const loadRescheduleSlots = async () => {
        const deptId = selectedApt?.ClinicServices?.Departments?.department_id;
        if (deptId == null || deptId === '') {
            alert('Không xác định được chuyên khoa của lịch hẹn.');
            return;
        }
        setRescheduleSlotsLoading(true);
        setRescheduleSlots([]);
        try {
            const response = await getAvailableDoctorSlots(deptId);
            const allSlots = Array.isArray(response?.data) ? response.data : [];
            setRescheduleSlots(allSlots);
            const dates = [...new Set(allSlots.map((s) => s.slot_date).filter(Boolean))].sort();
            if (dates.length > 0) {
                setEditFormData({
                    date: dates[0],
                    startTime: '',
                    slotId: '',
                    doctorId: '',
                });
            } else {
                setEditFormData({ date: '', startTime: '', slotId: '', doctorId: '' });
            }
        } catch (error) {
            console.error('Lỗi tải slot trống:', error);
            setRescheduleSlots([]);
            setEditFormData({ date: '', startTime: '', slotId: '', doctorId: '' });
            alert(error.response?.data?.message || 'Không tải được lịch trống của khoa.');
        } finally {
            setRescheduleSlotsLoading(false);
        }
    };

    const startEditing = () => {
        if (!canRescheduleAppointment(selectedApt?.status)) {
            alert('Chỉ lịch hẹn ở trạng thái pending, cancel/cancelled, confirmed hoặc completed mới được đặt lại lịch.');
            return;
        }
        setIsEditing(true);
        setEditFormData({ date: '', startTime: '', slotId: '', doctorId: '' });
        setRescheduleSlots([]);
        loadRescheduleSlots();
    };

    const resetReschedulePickerState = () => {
        setRescheduleSlots([]);
        setRescheduleSlotsLoading(false);
        setEditFormData({ date: '', startTime: '', slotId: '', doctorId: '' });
    };

    const handleRescheduleCalendarChange = (date) => {
        if (!date) return;
        const ymd = toYMD(date);
        setEditFormData((prev) => ({
            ...prev,
            date: ymd,
            startTime: '',
            slotId: '',
            doctorId: '',
        }));
    };

    const handlePickStartTime = (timeKey) => {
        setEditFormData((prev) => ({
            ...prev,
            startTime: timeKey,
            slotId: '',
            doctorId: '',
        }));
    };

    const handlePickDoctorSlot = (slot) => {
        setEditFormData((prev) => ({
            ...prev,
            slotId: String(slot.slot_id),
            doctorId: slot.doctor_id != null ? String(slot.doctor_id) : '',
        }));
    };

    // 3. Khi nhấn "Lưu lịch mới" (Sử dụng API rescheduleAppointment mới)
    const refreshAppointmentsForDate = async () => {
        const yyyy = selectedDate.getFullYear();
        const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const dd = String(selectedDate.getDate()).padStart(2, '0');
        const dateString = `${yyyy}-${mm}-${dd}`;
        try {
            const response = await getListAppointments({ date: dateString });
            const responseData = response.data?.data || response?.data || response || [];
            setAppointments(Array.isArray(responseData) ? responseData : []);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSaveReschedule = async () => {
        if (!editFormData.slotId) {
            return alert('Vui lòng chọn ngày, khung giờ và bác sĩ.');
        }

        try {
            await rescheduleAppointment(selectedApt.appointment_id, {
                new_slot_id: editFormData.slotId,
                doctor_id: editFormData.doctorId || undefined,
            });

            alert("Đổi lịch và bác sĩ thành công!");
            setIsEditing(false);
            resetReschedulePickerState();
            setShowModal(false);
            await refreshAppointmentsForDate();
        } catch (error) {
            alert(error.response?.data?.message || "Lỗi khi đổi lịch");
        }
    };

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Tổng quan Hoạt động</h1>
                <div className="relative">
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        locale={vi}
                        dateFormat="dd/MM/yyyy"
                        popperPlacement="bottom-end"
                        portalId="root-portal"
                        customInput={
                            <div className="bg-white px-4 py-2 rounded-lg border shadow-sm flex items-center gap-2 cursor-pointer hover:bg-gray-50">
                                <i className="fa-regular fa-calendar text-blue-600"></i>
                                <span className="text-sm font-medium">{formatDateToVN(selectedDate)}</span>
                            </div>
                        }
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-sm font-bold">BỆNH NHÂN CHECK-IN</p>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-4xl font-bold">{stats.checkIn}</span>
                        <div className="bg-blue-50 w-12 h-12 flex items-center justify-center rounded-full text-blue-600 text-xl"><i className="fa-solid fa-user"></i></div>
                    </div>
                </div>
                <div className="bg-pink-50/50 p-6 rounded-xl border border-pink-100 shadow-sm">
                    <p className="text-gray-500 text-sm font-bold">TỔNG LỊCH HẸN HÔM NAY</p>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-4xl font-bold">{stats.today}</span>
                        <div className="bg-pink-100 w-12 h-12 flex items-center justify-center rounded-full text-pink-600 text-xl"><i className="fa-solid fa-calendar-check"></i></div>
                    </div>
                </div>
                <div className="bg-teal-50/50 p-6 rounded-xl border border-teal-100 shadow-sm">
                    <p className="text-gray-500 text-sm font-bold">TỔNG LỊCH HẸN ĐÃ HOÀN TẤT</p>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-4xl font-bold">{stats.completed}</span>
                        <div className="bg-teal-100 w-12 h-12 flex items-center justify-center rounded-full text-teal-600 text-xl"><i className="fa-solid fa-stethoscope"></i></div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-visible">
                <div className="p-6 flex justify-between items-center border-b">
                    <h2 className="text-lg font-bold">Lịch hẹn Chuyên khoa Sắp tới</h2>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 text-gray-600" onClick={() => setFilters({ patientName: '', department: '', service: '', doctor: '', status: '' })}>
                            Xóa tất cả lọc
                        </button>
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[11px] text-gray-500 uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4">Giờ hẹn</th>

                            {/* Filter Bệnh Nhân */}
                            <th className="px-6 py-4 relative">
                                <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600" onClick={() => toggleFilter('patient')}>
                                    BỆNH NHÂN <i className={`fa-solid fa-filter ${filters.patientName ? 'text-blue-600' : ''}`}></i>
                                </div>
                                {activeFilter === 'patient' && (
                                    <div className="absolute top-full left-4 z-20 mt-1 w-56 bg-white border rounded-lg shadow-xl p-2 normal-case font-normal">
                                        <input
                                            type="text" autoFocus placeholder="Tìm tên..."
                                            className="w-full border rounded px-2 py-1 outline-none focus:border-blue-500"
                                            value={filters.patientName}
                                            onChange={(e) => setFilters({ ...filters, patientName: e.target.value })}
                                        />
                                    </div>
                                )}
                            </th>

                            {/* Filter Chuyên Khoa */}
                            <th className="px-6 py-4 relative">
                                <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600" onClick={() => toggleFilter('dept')}>
                                    CHUYÊN KHOA <i className={`fa-solid fa-filter ${filters.department ? 'text-blue-600' : ''}`}></i>
                                </div>
                                {activeFilter === 'dept' && (
                                    <div className="absolute top-full left-4 z-20 mt-1 w-56 bg-white border rounded-lg shadow-xl p-2 normal-case font-normal">
                                        {departments.map(d => (
                                            <label key={d} className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded cursor-pointer">
                                                <input type="checkbox" checked={filters.department === d} onChange={() => setFilters({ ...filters, department: filters.department === d ? '' : d })} /> {d}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </th>

                            <th className="px-6 py-4 relative">
                                <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600" onClick={() => toggleFilter('service')}>
                                    DỊCH VỤ <i className={`fa-solid fa-filter ${filters.service ? 'text-blue-600' : ''}`}></i>
                                </div>
                                {activeFilter === 'service' && (
                                    <div className="absolute top-full left-4 z-20 mt-1 w-56 bg-white border rounded-lg shadow-xl p-2 normal-case font-normal">
                                        {services.map(s => (
                                            <label key={s} className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded cursor-pointer">
                                                <input type="checkbox" checked={filters.service === s} onChange={() => setFilters({ ...filters, service: filters.service === s ? '' : s })} /> {s}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </th>

                            <th className="px-6 py-4 relative">
                                <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600" onClick={() => toggleFilter('doctor')}>
                                    BÁC SĨ <i className={`fa-solid fa-filter ${filters.doctor ? 'text-blue-600' : ''}`}></i>
                                </div>
                                {activeFilter === 'doctor' && (
                                    <div className="absolute top-full left-4 z-20 mt-1 w-56 bg-white border rounded-lg shadow-xl p-2 normal-case font-normal">
                                        {doctors.map(doc => (
                                            <label key={doc} className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded cursor-pointer">
                                                <input type="checkbox" checked={filters.doctor === doc} onChange={() => setFilters({ ...filters, doctor: filters.doctor === doc ? '' : doc })} /> {doc}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </th>

                            <th className="px-6 py-4 relative">
                                <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600" onClick={() => toggleFilter('status')}>
                                    TRẠNG THÁI <i className={`fa-solid fa-filter ${filters.status ? 'text-blue-600' : ''}`}></i>
                                </div>
                                {activeFilter === 'status' && (
                                    <div className="absolute top-full left-4 z-20 mt-1 w-40 bg-white border rounded-lg shadow-xl p-2 normal-case font-normal">
                                        {statuses.map(s => (
                                            <button key={s} className={`block w-full text-left p-2 rounded hover:bg-blue-50 capitalize ${filters.status === s ? 'bg-blue-50 text-blue-600 font-bold' : ''}`}
                                                onClick={() => { setFilters({ ...filters, status: filters.status === s ? '' : s }); setActiveFilter(null); }}>
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </th>
                            <th className="px-6 py-4">Thao tác</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y text-sm">
                        {filteredData.length > 0 ? filteredData.map((apt, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-blue-600">{apt.DoctorSlots?.start_time?.slice(0, 5)}</td>
                                <td className="px-6 py-4 flex items-center gap-2 font-medium">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-400 text-xs shadow-inner">
                                        <i className="fa-solid fa-user"></i>
                                    </div>
                                    {apt.Patients?.Users?.full_name || "N/A"}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold border border-indigo-100 uppercase">
                                        {apt.ClinicServices?.Departments?.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{apt.ClinicServices?.name}</td>
                                <td className="px-6 py-4 font-medium">{apt.Doctors?.Users?.full_name}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusClassName(apt.status)}`}>
                                        {apt.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-400">
                                    <button
                                        className="hover:text-blue-600 mr-4 transition-all active:scale-90"
                                        title="Xem chi tiết đơn"
                                        onClick={() => {
                                            setSelectedApt(apt);
                                            setIsEditing(false);
                                            resetReschedulePickerState();
                                            setShowModal(true);
                                        }}
                                    >
                                        <i className="fa-regular fa-eye text-lg"></i>
                                    </button>
                                    <button className="hover:text-gray-800"><i className="fa-solid fa-ellipsis-vertical text-lg"></i></button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-400 italic">Không có dữ liệu phù hợp bộ lọc...</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && selectedApt && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
                        {/* Header: Đổi tiêu đề dựa theo trạng thái */}
                        <div className={`p-6 border-b flex justify-between items-center ${isEditing ? 'bg-indigo-50' : 'bg-gray-50'}`}>
                            <h3 className="text-xl font-bold text-gray-800">
                                {isEditing ? "Chỉnh sửa Lịch hẹn" : "Chi tiết Bệnh nhân"}
                            </h3>
                            <button onClick={() => {
                                setShowModal(false);
                                setIsEditing(false);
                                resetReschedulePickerState();
                            }} className="text-gray-400 hover:text-red-500 transition-colors">
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-8 space-y-5 text-sm overflow-y-auto flex-1">
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-gray-500 font-medium">Tên Bệnh nhân:</span>
                                <span className="font-bold text-gray-800 text-lg">{selectedApt.Patients?.Users?.full_name || "Chưa cập nhật"}</span>
                            </div>

                            {isEditing ? (
                                <div className="space-y-5 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 animate-in slide-in-from-bottom-2">
                                    <p className="text-xs text-indigo-800/80">
                                        Ưu tiên theo thời gian: chọn ngày có lịch trống → chọn khung giờ → chọn bác sĩ.
                                    </p>

                                    {/* Bước 1–2: Calendar — chỉ bật các ngày có trong availableSlots */}
                                    <div>
                                        <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">
                                            1. Chọn ngày
                                        </label>
                                        {rescheduleSlotsLoading ? (
                                            <p className="mt-2 text-gray-500 text-sm">Đang tải lịch trống…</p>
                                        ) : rescheduleIncludeDates.length === 0 ? (
                                            <p className="mt-2 text-amber-800 text-sm">
                                                Không còn khung giờ trống trong khoa này.
                                            </p>
                                        ) : (
                                            <div className="mt-2 flex justify-center">
                                                <DatePicker
                                                    selected={parseYMD(editFormData.date)}
                                                    onChange={handleRescheduleCalendarChange}
                                                    includeDates={rescheduleIncludeDates}
                                                    locale={vi}
                                                    dateFormat="dd/MM/yyyy"
                                                    popperPlacement="bottom"
                                                    portalId="root-portal"
                                                    inline
                                                    calendarClassName="!border-0 !shadow-none"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Bước 3: Khung giờ trong ngày đã chọn */}
                                    <div>
                                        <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">
                                            2. Chọn khung giờ
                                        </label>
                                        {!editFormData.date ? (
                                            <p className="mt-2 text-gray-400 text-sm">Chọn ngày ở bước 1.</p>
                                        ) : uniqueStartTimes.length === 0 ? (
                                            <p className="mt-2 text-gray-500 text-sm">Không có giờ trống trong ngày này.</p>
                                        ) : (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {uniqueStartTimes.map((t) => (
                                                    <button
                                                        key={t}
                                                        type="button"
                                                        onClick={() => handlePickStartTime(t)}
                                                        className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-colors ${editFormData.startTime === t
                                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                                            : 'bg-white border-gray-200 text-gray-800 hover:bg-indigo-50 hover:border-indigo-200'
                                                            }`}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Bước 4: Bác sĩ có slot trùng giờ T trong ngày D */}
                                    <div>
                                        <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">
                                            3. Chọn bác sĩ
                                        </label>
                                        {!editFormData.startTime ? (
                                            <p className="mt-2 text-gray-400 text-sm">Chọn khung giờ ở bước 2.</p>
                                        ) : doctorsForSelectedTime.length === 0 ? (
                                            <p className="mt-2 text-gray-500 text-sm">Không có bác sĩ cho khung giờ này.</p>
                                        ) : (
                                            <ul className="mt-2 space-y-2">
                                                {doctorsForSelectedTime.map((slot) => {
                                                    const picked = String(editFormData.slotId) === String(slot.slot_id);
                                                    const name = slot.Doctors?.Users?.full_name || 'Bác sĩ';
                                                    return (
                                                        <li key={slot.slot_id}>
                                                            <button
                                                                type="button"
                                                                onClick={() => handlePickDoctorSlot(slot)}
                                                                className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${picked
                                                                    ? 'border-indigo-600 bg-indigo-100 ring-2 ring-indigo-400'
                                                                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'
                                                                    }`}
                                                            >
                                                                <span className="font-semibold text-gray-900">BS. {name}</span>
                                                                <span className="block text-xs text-gray-500 mt-0.5">
                                                                    {slot.start_time} – {slot.end_time}
                                                                </span>
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* --- PHẦN GIAO DIỆN KHI CHỈ XEM --- */
                                <>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 font-medium">Bác sĩ:</span>
                                        <span className="font-semibold text-gray-700">{selectedApt.Doctors?.Users?.full_name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 font-medium">Thời gian Cuộc hẹn:</span>
                                        <span className="font-bold text-blue-600 italic">
                                            {selectedApt.DoctorSlots?.start_time?.slice(0, 5)} AM - {selectedApt.DoctorSlots?.slot_date}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 font-medium">Tiền cọc đã trả:</span>
                                        <span className="font-bold text-green-600">{selectedApt.deposit_paid?.toLocaleString()}đ</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t pt-4">
                                        <span className="text-gray-500 font-bold italic underline">Cần thu thêm:</span>
                                        <span className="font-black text-lg text-red-600">
                                            {(selectedApt.total_price - selectedApt.deposit_paid)?.toLocaleString()}đ
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer Button: Thay đổi dựa theo isEditing */}
                        <div className="p-6 bg-gray-50 flex gap-3">
                            {isEditing ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            resetReschedulePickerState();
                                        }}
                                        className="flex-1 bg-white border py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100"
                                    >
                                        Hủy bỏ
                                    </button>
                                    <button
                                        onClick={handleSaveReschedule}
                                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg"
                                    >
                                        Lưu lịch mới
                                    </button>
                                </>
                            ) : (
                                <>
                                    {canCancelAppointment(selectedApt.status) && (
                                        <button
                                            onClick={handleCancelAppointment}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold shadow-lg"
                                        >
                                            Hủy lịch hẹn
                                        </button>
                                    )}
                                    {canRescheduleAppointment(selectedApt.status) && (
                                        <button
                                            onClick={startEditing}
                                            className="flex-1 border-2 border-indigo-600 text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50"
                                        >
                                            Đổi lịch khám
                                        </button>
                                    )}
                                    {selectedApt.status === 'confirmed' && (
                                        <button
                                            onClick={() => handleCheckIn(selectedApt.appointment_id)}
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg"
                                        >
                                            Xác nhận Check-in
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </main>
    );
};

export default Dashboard;