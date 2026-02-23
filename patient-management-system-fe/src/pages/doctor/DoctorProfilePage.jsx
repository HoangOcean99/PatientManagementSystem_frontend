import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';
import { getDoctorById } from '../../api/doctorApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const DoctorProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Nếu chúng ta đến từ route của Admin thì đây là flag nhận diện nhanh
    const isAdminView = location.pathname.includes('/admin/');

    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctorDetail = async () => {
            try {
                setLoading(true);
                const res = await getDoctorById(id);
                setDoctor(res.data.data || res.data);
            } catch (error) {
                console.error("Error fetching doctor:", error);
                toast.error("Không tìm thấy thông tin bác sĩ");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDoctorDetail();
        }
    }, [id]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50"><LoadingSpinner /></div>;
    
    if (!doctor) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <i className="fa-solid fa-user-doctor text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-bold text-gray-700">Không tìm thấy bác sĩ</h3>
            <button 
                onClick={() => navigate(-1)}
                className="mt-4 text-blue-600 font-bold hover:underline"
            >
                Quay lại danh sách
            </button>
        </div>
    );

    // Xử lý Map Field Data
    const displayDoctor = {
        ...doctor,
        name: doctor.Users?.full_name || 'Chưa cập nhật tên', 
        specialty: doctor.specialization || 'Chuyên khoa chung', 
        avatar: doctor.Users?.avatar_url || 'https://i.pravatar.cc/150?img=11', 
        hospital: doctor.hospital || "Phòng khám MedCare",
        price: doctor.price || "500.000đ", 
        availableSlots: doctor.availableSlots || [ 
             { date: "Hôm nay, 21/02", slots: ["08:00", "09:30", "14:00"] },
             { date: "Ngày mai, 22/02", slots: ["09:00", "10:30"] }
        ],
        education: doctor.education || ["Chuyên gia y tế cấp cao"],
        status: doctor.Users?.status || 'inactive'
    };

    const isActive = displayDoctor.status === 'active';

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12 font-sans">
            {scrollbarStyles}
            
            {/* Top Navigation */}
            <div className={`sticky top-0 z-40 backdrop-blur-md border-b border-gray-100 ${isAdminView ? 'bg-white/90' : 'bg-white/80'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-colors hover:bg-gray-100 px-3 py-1.5 rounded-xl"
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>Quay lại</span>
                    </button>

                    {isAdminView ? (
                        <button 
                            onClick={() => navigate(`/admin/doctors/${id}/edit`)}
                            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm border border-indigo-200 hover:border-indigo-600 flex items-center gap-2"
                        >
                            <i className="fa-solid fa-pen-to-square"></i>
                            Mở Form Chỉnh Sửa
                        </button>
                    ) : null}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    
                    {/* Left Column: Doctor Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Card Main */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
                            
                            {/* Admin Tag */}
                            {isAdminView && !isActive && (
                                <div className="absolute top-6 right-[-45px] bg-red-500 text-white text-[12px] font-bold px-12 py-1 rotate-45 shadow-sm text-center">
                                    TẠM NGƯNG
                                </div>
                            )}

                            <div className="relative mx-auto md:mx-0">
                                <img 
                                    src={displayDoctor.avatar} 
                                    alt={displayDoctor.name} 
                                    className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] object-cover shadow-lg border-4 border-white bg-gray-50"
                                />
                                <div className={`absolute -bottom-3 -right-2 text-xs font-bold px-3 py-1 rounded-full border-[3px] border-white shadow-sm flex items-center gap-1.5 ${
                                    isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                }`}>
                                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                    {isActive ? 'Hoạt động' : 'Tạm ngưng'}
                                </div>
                            </div>
                            
                            <div className="flex-1 w-full text-center md:text-left">
                                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg text-sm mb-3">
                                    {displayDoctor.specialty}
                                </span>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                                    {displayDoctor.name}
                                </h1>
                                
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 mb-6">
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                        <i className="fa-solid fa-stethoscope text-blue-500 text-lg"></i>
                                        <span className="font-medium">{displayDoctor.experience || "Nhiều năm kinh nghiệm"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                        <i className="fa-solid fa-house-medical text-blue-500 text-lg"></i>
                                        <span className="font-medium">Phòng: {displayDoctor.room_number || "Chưa cập nhật"}</span>
                                    </div>
                                    {!isAdminView && (
                                        <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-2 rounded-xl font-bold border border-yellow-100">
                                            <i className="fa-solid fa-star text-yellow-500"></i>
                                            <span>{displayDoctor.rating || 5.0} ({displayDoctor.reviews || 100} đánh giá)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Bio Section */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <i className="fa-solid fa-address-card"></i>
                                    </span>
                                    Giới thiệu chuyên môn
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-sm format-text">
                                    {displayDoctor.bio || "Bác sĩ chưa cập nhật phần giới thiệu."}
                                </p>
                            </div>

                            {/* Education Section */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <i className="fa-solid fa-graduation-cap"></i>
                                    </span>
                                    Quá trình đào tạo
                                </h3>
                                <ul className="space-y-3">
                                    {displayDoctor.education?.map((item, idx) => (
                                        <li key={idx} className="flex gap-3 items-start">
                                            <i className="fa-solid fa-certificate text-indigo-400 mt-1 flex-shrink-0"></i>
                                            <span className="text-gray-600 text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Booking Box */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-tr from-blue-700 to-blue-500 p-6 text-white text-center">
                                <h3 className="text-lg font-bold mb-1">{isAdminView ? "Thông tin đặt khám" : "Đặt lịch khám"}</h3>
                                <div className="text-blue-100 text-sm mt-2 flex justify-center items-baseline gap-1">
                                    Phí tư vấn: 
                                    <span className="font-black text-white text-2xl ml-1 tracking-tight">
                                        {displayDoctor.price}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                                    <i className="fa-regular fa-calendar text-blue-500"></i>
                                    Chọn ngày
                                </h4>
                                
                                {/* Date Selector */}
                                <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar mb-6">
                                    {displayDoctor.availableSlots?.map((day, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setSelectedDateIndex(idx);
                                                setSelectedSlot(null);
                                            }}
                                            className={`flex-shrink-0 px-4 py-3 rounded-xl border transition-all text-center min-w-[100px] ${
                                                selectedDateIndex === idx
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200/50'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                            }`}
                                        >
                                            <div className="text-xs opacity-80 mb-1">{day.date.split(',')[0]}</div>
                                            <div className="font-bold text-sm whitespace-nowrap">{day.date.split(',')[1]}</div>
                                        </button>
                                    ))}
                                </div>

                                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                                    <i className="fa-regular fa-clock text-blue-500"></i>
                                    Chọn giờ
                                </h4>
                                
                                {/* Time Slots */}
                                <div className="grid grid-cols-3 gap-2 mb-8">
                                    {displayDoctor.availableSlots && displayDoctor.availableSlots[selectedDateIndex]?.slots.map((slot, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`py-2 px-1 rounded-lg text-sm font-bold border transition-all truncate ${
                                                selectedSlot === slot
                                                ? 'bg-blue-50 text-blue-700 border-blue-200 ring-2 ring-blue-500 ring-offset-1'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50'
                                            }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>

                                {/* Main Button Action */}
                                {isAdminView ? (
                                    <button 
                                        onClick={() => navigate(`/admin/doctors/${id}`)}
                                        className="w-full py-3.5 rounded-xl font-bold text-[15px] transition-all bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-200 border border-transparent active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        <i className="fa-solid fa-calendar-plus"></i>
                                        Quản lý Slot Lịch Giờ
                                    </button>
                                ) : (
                                    <button 
                                        className={`w-full py-4 rounded-xl font-bold text-[15px] transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2
                                            ${selectedSlot 
                                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/30' 
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}
                                        `}
                                        disabled={!selectedSlot}
                                    >
                                        {selectedSlot ? 'Xác nhận Đặt khám' : 'Vui lòng chọn khung giờ'}
                                    </button>
                                )}
                                
                                {!isAdminView && (
                                    <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
                                        <i className="fa-solid fa-shield-halved"></i>
                                        Bảo mật thông tin thanh toán & y tế
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfilePage;
