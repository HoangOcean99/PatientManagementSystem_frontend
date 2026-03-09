import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DoctorCard from '../../components/doctor/DoctorCard';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';
import { getAllDoctors, searchDoctors } from '../../api/doctorApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const DoctorListingPage = () => {
    const location = useLocation();
    const isAdminView = location.pathname.includes('/admin/');

    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInitialDoctors();
    }, []);

    const fetchInitialDoctors = async () => {
        try {
            setLoading(true);
            const res = await getAllDoctors();
            const fetchedData = res.data?.data || [];

            // Nếu là admin, hiển thị tất cả, còn user thì chỉ list doctor active
            const displayData = isAdminView
                ? fetchedData
                : fetchedData.filter(d => d.Users?.status === 'active');

            setDoctors(displayData);
        } catch (error) {
            console.error("Failed to fetch doctors:", error);
            toast.error("Không thể tải danh sách bác sĩ.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const res = await searchDoctors(searchTerm, specialtyFilter);
            let resultData = res.data.data || res.data || [];
            if (!isAdminView) {
                resultData = resultData.filter(d => d.Users?.status === 'active');
            }
            setDoctors(resultData);
        } catch (error) {
            console.error("Link search error:", error);
            toast.error("Tìm kiếm thất bại.");
        } finally {
            setLoading(false);
        }
    };

    const filteredDoctors = doctors.filter(doctor => {
        const docName = doctor.Users?.full_name || '';
        const docSpec = doctor.specialization || '';

        const matchesName = docName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = specialtyFilter
            ? docSpec === specialtyFilter
            : true;

        const matchesSpecialtyText = docSpec.toLowerCase().includes(searchTerm.toLowerCase());

        return (matchesName || matchesSpecialtyText) && matchesSpecialty;
    });

    const specialties = [...new Set(doctors.map(d => d.specialization).filter(Boolean))];

    return (
        <div className={`${isAdminView ? 'bg-gray-50/50' : 'bg-blue-50/30'} font-sans text-gray-700`} style={{ width: '100vw' }}>
            {scrollbarStyles}

            {/* Header Section */}
            <div className={`border-b border-gray-100 sticky top-0 z-30 shadow-sm relative ${isAdminView ? 'bg-white' : 'bg-white'}`}>
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-8">
                            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-3 ${isAdminView ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                                <i className={`fa-solid ${isAdminView ? 'fa-user-tie' : 'fa-stethoscope'} mr-2`}></i>
                                {isAdminView ? 'Hệ thống Quản trị' : 'Chăm sóc sức khoẻ'}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                                {isAdminView ? 'Quản lý Hồ sơ Bác sĩ' : 'Tìm bác sĩ giỏi'}
                            </h1>
                            <p className="text-gray-500 text-sm md:text-base">
                                {isAdminView ? 'Xem, chỉnh sửa và quản lý lịch làm việc của đội ngũ y bác sĩ' : 'Đặt lịch khám với các chuyên gia y tế hàng đầu'}
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className={`p-2 rounded-2xl shadow-lg shadow-blue-500/5 flex flex-col md:flex-row gap-2 ${isAdminView ? 'bg-gray-50/50 outline outline-1 outline-gray-200' : 'bg-white border border-gray-100'}`}>
                            <div className="flex-1 relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-magnifying-glass text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-11 pr-4 py-3 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all placeholder-gray-400 font-medium bg-transparent"
                                    placeholder="Tìm theo tên bác sĩ..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>

                            <div className="w-full md:w-56 relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-filter text-gray-400 group-focus-within:text-blue-500"></i>
                                </div>
                                <select
                                    className="block w-full pl-10 pr-8 py-3 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all font-medium appearance-none cursor-pointer text-gray-700 hover:bg-white bg-transparent"
                                    value={specialtyFilter}
                                    onChange={(e) => setSpecialtyFilter(e.target.value)}
                                >
                                    <option value="">Tất cả chuyên khoa</option>
                                    {specialties.map(spec => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={handleSearch}
                                className={`px-8 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 whitespace-nowrap ${isAdminView
                                        ? 'bg-gray-800 hover:bg-gray-900 text-white shadow-gray-300'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
                                    }`}
                            >
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="container mx-auto px-4 md:px-8 py-10">
                <div className="max-w-5xl mx-auto flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800">
                        {loading ? 'Đang tải dữ liệu...' : `Tìm thấy ${filteredDoctors.length} bác sĩ`}
                    </h2>
                </div>

                {loading ? (
                    <div className="relative flex-1">
                        <LoadingSpinner />
                    </div>
                ) : filteredDoctors.length > 0 ? (
                    <div className="flex flex-col gap-4 max-w-5xl mx-auto">
                        {filteredDoctors.map(doctor => (
                            <DoctorCard key={doctor.doctor_id} doctor={doctor} isAdminView={isAdminView} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 max-w-5xl mx-auto shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <i className="fa-solid fa-user-doctor text-3xl"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Không tìm thấy bác sĩ nào</h3>
                        <p className="text-gray-500 mt-2 text-sm">Vui lòng thử lại với từ khóa hoặc chuyên khoa khác</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSpecialtyFilter('');
                                fetchInitialDoctors();
                            }}
                            className="mt-6 font-bold text-blue-600 hover:text-blue-700 hover:underline px-6 py-2 bg-blue-50 rounded-xl"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorListingPage;
