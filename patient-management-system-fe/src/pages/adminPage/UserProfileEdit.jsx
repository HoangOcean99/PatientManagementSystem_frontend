import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getDoctorById, updateDoctor } from '../../api/doctorApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DoctorProfileForm from '../../components/admin/DoctorProfileForm';
import DoctorScheduleManager from '../../components/admin/DoctorScheduleManager';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';

const UserProfileEdit = () => {
    const { id, role } = useParams();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                setLoading(true);
                const res = await getDoctorById(id);
                setDoctor(res.data?.data || res.data);
            } catch (error) {
                console.error("Error fetching doctor:", error);
                toast.error("Không tìm thấy thông tin bác sĩ");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDoctor();
        }
    }, [id]);

    const handleSaveProfile = async (formData) => {
        // Thực hiện lưu API
        await updateDoctor(id, formData);

        // Cập nhật local state
        setDoctor(prev => ({
            ...prev,
            specialization: formData.specialization,
            room_number: formData.room_number,
            bio: formData.bio,
            Users: {
                ...prev.Users,
                full_name: formData.full_name,
                phone_number: formData.phone_number,
                avatar_url: formData.avatar_url,
                status: formData.status
            }
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <i className="fa-solid fa-user-doctor text-4xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-bold text-gray-700">Không tìm thấy bác sĩ</h3>
                <button
                    onClick={() => navigate('/admin/user-profile')}
                    className="mt-4 text-blue-600 font-bold hover:underline"
                >
                    Quay lại trang người dùng
                </button>
            </div>
        );
    }

    const doctorName = doctor.Users?.full_name || 'Bác sĩ';
    const doctorAvatar = doctor.Users?.avatar_url || 'https://i.pravatar.cc/150?img=11';

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50/30">
            {scrollbarStyles}

            {/* Header Thống kê/Breadcrumb */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                            <div className="flex items-center gap-3">
                                <img src={doctorAvatar} alt={doctorName} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                                <div>
                                    <h1 className="text-xl font-extrabold text-gray-900 leading-tight">
                                        {doctorName}
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        {doctor.specialization || "Chưa cập nhật chuyên khoa"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${doctor.Users?.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                                }`}>
                                <i className={`fa-solid fa-circle text-[8px] mr-1 ${doctor.Users?.status === 'active' ? 'text-green-500' : 'text-gray-400'}`}></i>
                                {doctor.Users?.status === 'active' ? 'Đang hoạt động' : 'Tạm ngưng'}
                            </span>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex gap-8 mt-6 overflow-x-auto custom-scrollbar border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === 'profile'
                                ? 'text-blue-600'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <i className="fa-regular fa-id-card mr-2"></i>
                            Hồ sơ & Chuyên môn
                            {activeTab === 'profile' && (
                                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-full"></span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('schedule')}
                            className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === 'schedule'
                                ? 'text-blue-600'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <i className="fa-regular fa-calendar-check mr-2"></i>
                            Quản lý lịch làm việc
                            {activeTab === 'schedule' && (
                                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-full"></span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative z-20">
                {activeTab === 'profile' && (
                    <DoctorProfileForm
                        doctor={doctor}
                        onSave={handleSaveProfile}
                        isAdmin={true}
                    />
                )}

                {activeTab === 'schedule' && (
                    <DoctorScheduleManager doctorId={id} />
                )}
            </div>
        </main>
    );
};

export default UserProfileEdit;
