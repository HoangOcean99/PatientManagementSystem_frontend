import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { vi } from 'date-fns/locale';
import { getListAppointments } from '../../api/appointmentApi';
import { getListSchedulesByDoctorIdAndDate } from '../../api/scheduleApi';
import { getAvailableDoctorSlotsByDate } from '../../api/doctorApi';
import { rescheduleAppointment } from '../../api/appointmentApi';
import { updateAppointmentStatus } from '../../api/appointmentApi';

const Dashboard = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [selectedApt, setSelectedApt] = useState(null); // Lưu dữ liệu của đơn đang chọn
    const [showModal, setShowModal] = useState(false);    // Trạng thái hiển thị modal
    const [isEditing, setIsEditing] = useState(false);       // Trạng thái Xem hay Sửa
    const [rawSlots, setRawSlots] = useState([]);      // Kho lưu toàn bộ slot của khoa đó trong ngày
    const [availableDoctors, setAvailableDoctors] = useState([]); // Danh sách BS duy nhất lọc từ rawSlots; // Danh sách slot trống khi sửa
    const [availableSlots, setAvailableSlots] = useState([]);
    const [editFormData, setEditFormData] = useState({        // Dữ liệu tạm khi đang sửa
        slotId: '',
        date: ''
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

    // 1. Khi nhấn "Chỉnh sửa lịch"
    const startEditing = () => {
        console.log("Dữ liệu đơn đang chọn:", selectedApt);
        setEditFormData({
            slotId: selectedApt.slot_id,
            date: selectedApt.DoctorSlots?.slot_date
        });

        setIsEditing(true);
    };

    const handleDateChange = async (newDate) => {
        // 1. Reset các tầng dưới
        setEditFormData(prev => ({ ...prev, date: newDate, doctorId: '', slotId: '' }));
        setAvailableDoctors([]);
        setAvailableSlots([]);

        // 2. Lấy ID chuyên khoa từ đơn hiện tại
        const deptId = selectedApt.ClinicServices?.Departments?.department_id;
        if (!deptId) return;

        try {
            // 3. Gọi hàm API lấy tất cả slot của khoa trong ngày
            const response = await getAvailableDoctorSlotsByDate(deptId, newDate);
            console.log("Response:", response);
            const allSlots = response?.data || [];
            setRawSlots(allSlots);

            // 4. Lọc ra danh sách Bác sĩ duy nhất (Unique) từ dữ liệu slot trả về
            const uniqueDocs = [];
            const seenIds = new Set();
            allSlots.forEach(slot => {
                if (!seenIds.has(slot.doctor_id)) {
                    seenIds.add(slot.doctor_id);
                    uniqueDocs.push({
                        id: slot.doctor_id,
                        name: slot.Doctors?.Users?.full_name || "Bác sĩ chưa tên"
                    });
                }
            });
            setAvailableDoctors(uniqueDocs);
        } catch (error) {
            console.error("Lỗi lấy danh sách bác sĩ:", error);
        }
    };

    const handleDoctorChange = (drId) => {
        // 1. Cập nhật ID bác sĩ và reset slot cũ
        setEditFormData(prev => ({ ...prev, doctorId: drId, slotId: '' }));

        // 2. Lọc trong kho rawSlots lấy ra các slot của ông bác sĩ này
        const filteredSlots = rawSlots.filter(slot => String(slot.doctor_id) === String(drId));
        setAvailableSlots(filteredSlots);
    };

    // 3. Khi nhấn "Lưu lịch mới" (Sử dụng API rescheduleAppointment mới)
    const handleSaveReschedule = async () => {
        if (!editFormData.slotId) return alert("Vui lòng chọn khung giờ!");

        try {
            await rescheduleAppointment(selectedApt.appointment_id, {
                slot_id: editFormData.slotId,
                doctor_id: editFormData.doctorId // Cập nhật cả bác sĩ mới
            });

            alert("Đổi lịch và bác sĩ thành công!");
            setIsEditing(false);
            setShowModal(false);
            // fetchAppointments(); // Gọi lại hàm load danh sách chính nếu cần
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
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                        apt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        {apt.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-400">
                                    <button
                                        className="hover:text-blue-600 mr-4 transition-all active:scale-90"
                                        title="Xem chi tiết đơn"
                                        onClick={() => {
                                            setSelectedApt(apt); // Bước 1: Bỏ dữ liệu hàng này vào "túi"
                                            setShowModal(true);   // Bước 2: Bật cái Box hiện lên
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
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Header: Đổi tiêu đề dựa theo trạng thái */}
                        <div className={`p-6 border-b flex justify-between items-center ${isEditing ? 'bg-indigo-50' : 'bg-gray-50'}`}>
                            <h3 className="text-xl font-bold text-gray-800">
                                {isEditing ? "Chỉnh sửa Lịch hẹn" : "Chi tiết Bệnh nhân"}
                            </h3>
                            <button onClick={() => { setShowModal(false); setIsEditing(false); }} className="text-gray-400 hover:text-red-500 transition-colors">
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-8 space-y-5 text-sm">
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-gray-500 font-medium">Tên Bệnh nhân:</span>
                                <span className="font-bold text-gray-800 text-lg">{selectedApt.Patients?.Users?.full_name || "Chưa cập nhật"}</span>
                            </div>

                            {isEditing ? (
                                /* --- GIAO DIỆN CHỈNH SỬA 3 TẦNG: NGÀY -> BÁC SĨ -> GIỜ --- */
                                <div className="space-y-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 animate-in slide-in-from-bottom-2">

                                    {/* TẦNG 1: CHỌN NGÀY */}
                                    <div>
                                        <label className="text-[10px] font-bold text-indigo-600 uppercase italic">1. Chọn ngày khám mới:</label>
                                        <input
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full border p-2 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-indigo-400"
                                            value={editFormData.date}
                                            onChange={(e) => handleDateChange(e.target.value)}
                                        />
                                    </div>

                                    {/* TẦNG 2: CHỌN BÁC SĨ (Chỉ mở khi đã chọn ngày) */}
                                    <div>
                                        <label className="text-[10px] font-bold text-indigo-600 uppercase italic">2. Bác sĩ chuyên khoa có lịch:</label>
                                        <select
                                            className="w-full border p-2 rounded-lg mt-1 outline-none disabled:bg-gray-100 disabled:text-gray-400"
                                            value={editFormData.doctorId}
                                            disabled={!editFormData.date || availableDoctors.length === 0}
                                            onChange={(e) => handleDoctorChange(e.target.value)}
                                        >
                                            <option value="">
                                                {editFormData.date
                                                    ? (availableDoctors.length > 0 ? "-- Chọn bác sĩ --" : "Không có bác sĩ nào trực")
                                                    : "Vui lòng chọn ngày trước"}
                                            </option>
                                            {availableDoctors.map(dr => (
                                                <option key={dr.id} value={dr.id}>BS. {dr.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* TẦNG 3: CHỌN GIỜ (Chỉ mở khi đã chọn bác sĩ) */}
                                    <div>
                                        <label className="text-[10px] font-bold text-indigo-600 uppercase italic">3. Khung giờ còn trống:</label>
                                        <select
                                            className="w-full border p-2 rounded-lg mt-1 outline-none disabled:bg-gray-100 disabled:text-gray-400"
                                            value={editFormData.slotId}
                                            disabled={!editFormData.doctorId || availableSlots.length === 0}
                                            onChange={(e) => setEditFormData({ ...editFormData, slotId: e.target.value })}
                                        >
                                            <option value="">
                                                {editFormData.doctorId
                                                    ? (availableSlots.length > 0 ? "-- Chọn giờ khám --" : "Hết giờ trống")
                                                    : "Vui lòng chọn bác sĩ trước"}
                                            </option>
                                            {availableSlots.map(slot => (
                                                <option key={slot.slot_id} value={slot.slot_id}>
                                                    {slot.start_time} - {slot.end_time}
                                                </option>
                                            ))}
                                        </select>
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
                                        onClick={() => setIsEditing(false)}
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
                                    <button
                                        onClick={startEditing}
                                        className="flex-1 border-2 border-indigo-600 text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50"
                                    >
                                        Đổi lịch khám
                                    </button>
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