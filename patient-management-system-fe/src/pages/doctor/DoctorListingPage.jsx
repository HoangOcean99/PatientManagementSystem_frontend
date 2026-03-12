import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import DoctorCard from '../../components/doctor/DoctorCard';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';
import { getAllDoctors, searchDoctors } from '../../api/doctorApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

// ===== HELPERS =====
const SORT_OPTIONS = [
    { key: 'name_asc',   label: 'Tên A → Z' },
    { key: 'name_desc',  label: 'Tên Z → A' },
    { key: 'spec_asc',   label: 'Chuyên khoa' },
];

const DoctorListingPage = () => {
    const location = useLocation();
    const isAdminView = location.pathname.includes('/admin/');

    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');           // admin-only
    const [sortKey, setSortKey] = useState('name_asc');
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    // ===== FETCH =====
    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const res = await getAllDoctors();
            const data = res.data?.data || [];
            // Patient: chỉ hiển thị active
            setDoctors(isAdminView ? data : data.filter((d) => d.Users?.status === 'active'));
        } catch (error) {
            console.error('Failed to fetch doctors:', error);
            toast.error('Không thể tải danh sách bác sĩ.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setSearchTerm(searchInput);
        if (!searchInput && !specialtyFilter) {
            fetchDoctors();
            return;
        }
        try {
            setLoading(true);
            const res = await searchDoctors(searchInput, specialtyFilter);
            let data = res.data?.data || res.data || [];
            if (!isAdminView) {
                data = data.filter((d) => d.Users?.status === 'active');
            }
            setDoctors(data);
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Tìm kiếm thất bại.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSearchInput('');
        setSearchTerm('');
        setSpecialtyFilter('');
        setDepartmentFilter('');
        setStatusFilter('');
        setSortKey('name_asc');
        fetchDoctors();
    };

    // ===== DERIVED DATA =====
    // Unique specialties
    const specialties = useMemo(
        () => [...new Set(doctors.map((d) => d.specialization).filter(Boolean))].sort(),
        [doctors]
    );

    // Unique departments từ nested Departments object
    const departments = useMemo(
        () => [...new Set(doctors.map((d) => d.Departments?.name).filter(Boolean))].sort(),
        [doctors]
    );

    // Filter + sort
    const filteredDoctors = useMemo(() => {
        let list = doctors.filter((doc) => {
            const name = doc.Users?.full_name?.toLowerCase() || '';
            const spec = doc.specialization?.toLowerCase() || '';
            const dept = doc.Departments?.name || '';
            const status = doc.Users?.status || '';

            const matchesSearch =
                !searchTerm ||
                name.includes(searchTerm.toLowerCase()) ||
                spec.includes(searchTerm.toLowerCase());

            const matchesSpecialty = !specialtyFilter || doc.specialization === specialtyFilter;
            const matchesDepartment = !departmentFilter || dept === departmentFilter;
            const matchesStatus = !statusFilter || status === statusFilter;

            return matchesSearch && matchesSpecialty && matchesDepartment && matchesStatus;
        });

        // Sort
        list = [...list].sort((a, b) => {
            const nameA = a.Users?.full_name || '';
            const nameB = b.Users?.full_name || '';
            const specA = a.specialization || '';
            const specB = b.specialization || '';
            if (sortKey === 'name_asc') return nameA.localeCompare(nameB, 'vi');
            if (sortKey === 'name_desc') return nameB.localeCompare(nameA, 'vi');
            if (sortKey === 'spec_asc') return specA.localeCompare(specB, 'vi');
            return 0;
        });

        return list;
    }, [doctors, searchTerm, specialtyFilter, departmentFilter, statusFilter, sortKey]);

    const activeCount = doctors.filter((d) => d.Users?.status === 'active').length;
    const hasActiveFilters = searchTerm || specialtyFilter || departmentFilter || statusFilter;

    return (
        <div
            className={`font-sans text-gray-700 min-h-screen ${isAdminView ? 'bg-gray-50/50' : 'bg-gradient-to-b from-blue-50/40 to-white'}`}
            style={{ width: '100vw' }}
        >
            {scrollbarStyles}

            {/* ===== HEADER ===== */}
            <div className={`border-b border-gray-100 sticky top-0 z-30 shadow-sm ${isAdminView ? 'bg-white' : 'bg-white/90 backdrop-blur-md'}`}>
                <div className="max-w-6xl mx-auto px-4 py-6">
                    {/* Title */}
                    <div className="text-center mb-6">
                        <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-3 ${
                            isAdminView ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                            <i className={`fa-solid ${isAdminView ? 'fa-user-tie' : 'fa-stethoscope'} mr-2`}></i>
                            {isAdminView ? 'Hệ thống Quản trị' : 'Đội ngũ chuyên gia'}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
                            {isAdminView ? 'Quản lý Hồ sơ Bác sĩ' : 'Tìm bác sĩ của bạn'}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {isAdminView
                                ? `${doctors.length} bác sĩ — ${activeCount} đang hoạt động`
                                : 'Đặt lịch khám với các chuyên gia y tế hàng đầu'}
                        </p>
                    </div>

                    {/* Search Row */}
                    <div className={`rounded-2xl p-2 flex flex-col md:flex-row gap-2 ${
                        isAdminView
                            ? 'bg-gray-50 border border-gray-200'
                            : 'bg-white border border-gray-100 shadow-lg shadow-blue-500/5'
                    }`}>
                        {/* Search Input */}
                        <div className="flex-1 relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <i className="fa-solid fa-magnifying-glass text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-11 pr-4 py-3 border border-transparent rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all placeholder-gray-400 font-medium bg-transparent text-sm"
                                placeholder="Tìm theo tên bác sĩ hoặc chuyên khoa..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>

                        {/* Specialty Filter */}
                        <div className="w-full md:w-48 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fa-solid fa-stethoscope text-gray-400 text-xs"></i>
                            </div>
                            <select
                                className="block w-full pl-9 pr-8 py-3 border border-transparent rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all font-medium appearance-none cursor-pointer text-gray-700 text-sm bg-transparent"
                                value={specialtyFilter}
                                onChange={(e) => setSpecialtyFilter(e.target.value)}
                            >
                                <option value="">Tất cả chuyên khoa</option>
                                {specialties.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            className={`px-8 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 whitespace-nowrap text-sm ${
                                isAdminView
                                    ? 'bg-gray-900 hover:bg-black text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
                            }`}
                        >
                            Tìm kiếm
                        </button>
                    </div>

                    {/* Secondary Filter Row */}
                    <div className="flex flex-wrap gap-2 mt-3 items-center">
                        {/* Department Filter */}
                        {departments.length > 0 && (
                            <select
                                className="text-xs font-bold px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:border-blue-400 cursor-pointer"
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                            >
                                <option value="">Tất cả khoa</option>
                                {departments.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        )}

                        {/* Status Filter (Admin only) */}
                        {isAdminView && (
                            <select
                                className="text-xs font-bold px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:border-blue-400 cursor-pointer"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="active">Hoạt động</option>
                                <option value="inactive">Tạm ngưng</option>
                            </select>
                        )}

                        {/* Sort */}
                        <select
                            className="text-xs font-bold px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:border-blue-400 cursor-pointer"
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value)}
                        >
                            {SORT_OPTIONS.map((o) => (
                                <option key={o.key} value={o.key}>{o.label}</option>
                            ))}
                        </select>

                        {/* Active Filter Tags */}
                        {hasActiveFilters && (
                            <button
                                onClick={handleReset}
                                className="text-xs font-bold px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-all flex items-center gap-1.5"
                            >
                                <i className="fa-solid fa-xmark"></i>
                                Xóa bộ lọc
                            </button>
                        )}

                        <span className="ml-auto text-xs text-gray-400 font-medium">
                            {filteredDoctors.length} kết quả
                        </span>
                    </div>
                </div>
            </div>

            {/* ===== LIST ===== */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center items-center h-52 opacity-50">
                        <LoadingSpinner />
                    </div>
                ) : filteredDoctors.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {filteredDoctors.map((doctor) => (
                            <DoctorCard
                                key={doctor.doctor_id}
                                doctor={doctor}
                                isAdminView={isAdminView}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <i className="fa-solid fa-user-doctor text-3xl"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Không tìm thấy bác sĩ nào</h3>
                        <p className="text-gray-500 mt-2 text-sm">Vui lòng thử lại với từ khóa hoặc bộ lọc khác</p>
                        <button
                            onClick={handleReset}
                            className="mt-6 font-bold text-blue-600 hover:text-blue-700 hover:underline px-6 py-2 bg-blue-50 rounded-xl transition-all"
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
