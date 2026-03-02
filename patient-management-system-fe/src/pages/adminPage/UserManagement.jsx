import React, { useState, useEffect } from 'react';
import * as Icons from "lucide-react";
import { useLocation, useParams } from 'react-router-dom';
import DoctorCard from '../../components/doctor/DoctorCard';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';
import { getAllDoctors, searchDoctors } from '../../api/doctorApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const UserManagement = () => {
    const location = useLocation();
    const { role } = useParams();
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
        <main className="flex-1 overflow-y-auto bg-gray-50/30">
            {scrollbarStyles}

            <div className="p-8 mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 w-full">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Quản lý Hồ sơ Bác sĩ
                        </h1>
                        <p className="text-gray-500 mt-1 font-medium">
                            Xem, chỉnh sửa và quản lý lịch làm việc của đội ngũ y bác sĩ
                        </p>
                    </div>

                    <button
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
                    >
                        <Icons.Plus size={20} />
                        Thêm bác sĩ mới mới
                    </button>
                </div>

                <div className={`p-3 rounded-2xl shadow-xl shadow-blue-500/5 flex flex-col md:flex-row gap-3 ${isAdminView ? 'bg-gray-50 border border-gray-200' : 'bg-white border border-gray-100'
                    }`}>
                    {/* Search Input */}
                    <div className="flex-[2] relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fa-solid fa-magnifying-glass text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all placeholder-gray-400 font-semibold text-gray-700 shadow-sm"
                            placeholder="Tìm theo tên bác sĩ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>

                    {/* Specialty Filter */}
                    <div className="flex-1 relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fa-solid fa-filter text-gray-400 group-focus-within:text-blue-500"></i>
                        </div>
                        <select
                            className="block w-full pl-11 pr-10 py-3.5 bg-white border border-gray-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all font-semibold appearance-none cursor-pointer text-gray-700 shadow-sm"
                            value={specialtyFilter}
                            onChange={(e) => setSpecialtyFilter(e.target.value)}
                        >
                            <option value="">Tất cả chuyên khoa</option>
                            {specialties.map(spec => (
                                <option key={spec} value={spec}>{spec}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <i className="fa-solid fa-chevron-down text-xs text-gray-400"></i>
                        </div>
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        className={`px-10 py-3.5 rounded-xl font-extrabold transition-all shadow-lg active:scale-95 whitespace-nowrap ${isAdminView
                            ? 'bg-gray-800 hover:bg-gray-900 text-white shadow-gray-200'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                            }`}
                    >
                        <i className="fa-solid fa-search mr-2"></i>
                        Tìm kiếm
                    </button>
                </div>
            </div>

            {/* List Section */}
            <div className="mx-auto md:px-8 py-10">
                <div className="mx-auto flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800">
                        {loading ? 'Đang tải dữ liệu...' : `Tìm thấy ${filteredDoctors.length} bác sĩ`}
                    </h2>
                </div>

                {loading ? (
                    <div className="relative flex-1">
                        {loading && <LoadingSpinner />}
                    </div>
                ) : filteredDoctors.length > 0 ? (
                    <div className="flex flex-col gap-4 mx-auto">
                        {filteredDoctors.map(doctor => (
                            <DoctorCard key={doctor.doctor_id} doctor={doctor} isAdminView={isAdminView} role={role} />
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
        </main>
    );
};

export default UserManagement;
