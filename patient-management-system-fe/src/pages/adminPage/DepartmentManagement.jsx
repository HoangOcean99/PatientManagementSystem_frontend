import React, { useEffect, useMemo, useState } from 'react';
import * as Icons from "lucide-react";
import { useNavigate } from 'react-router-dom';
import DynamicModal from '../../components/common/DynamicModal';
import { createDepartment, deleteDepartment, getAllDepartments, updateDepartment } from '../../api/departmentApi';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SearchFilterBar from '../../components/common/SearchFilterBar';
import { filterBySearchAndStatus } from '../../helpers/SearchFilterUtils';

const colorPalettes = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-purple-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-indigo-500',
    'bg-cyan-500'
];

const departmentFields = [
    {
        name: "name",
        label: "Tên chuyên ngành",
        type: "text",
        required: true
    },
    {
        name: "description",
        label: "Mô tả chuyên ngành",
        type: "textarea",
        required: true,
        rows: 5
    },
    {
        name: "is_active",
        label: "Trạng thái chuyên ngành",
        type: "select",
        required: true,
        options: [
            { label: 'Hoạt động', value: true },
            { label: 'Dừng hoạt động', value: false }
        ]
    },

];



const ServiceCard = ({ service, handleDeleteDepartment, handleOpenEditPopUp }) => {
    const Icon = Icons['Activity'];
    const navigate = useNavigate();

    const getColorById = (id) => {
        const idValue = typeof id === 'number' ? id :
            id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colorPalettes[idValue % colorPalettes.length];
    };

    const serviceColor = getColorById(service.department_id);

    return (
        <div
            onClick={() => navigate(`/admin/clinic-services-management/${service.department_id}`)}
            className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 relative overflow-hidden cursor-pointer"
        >
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${serviceColor} opacity-[0.05] rounded-full group-hover:scale-150 transition-transform duration-500`}></div>

            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${serviceColor} text-white shadow-lg shadow-inherit/20`}>
                    <Icon size={24} />
                </div>
                <div className="flex gap-2 z-10">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditPopUp(service)
                        }}
                        className="cursor-pointer p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Icons.Edit3 size={18}
                        />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDepartment(service.department_id);
                        }} className="cursor-pointer p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Icons.Trash2 size={18} />
                    </button>
                </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-2">{service.name}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-2 italic" style={{ minHeight: '60px' }}>
                "{service.description}"
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-xs font-semibold">{service.clinic_services_count[0].count} dịch vụ</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${service.is_active ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                    {service.is_active ? 'Hoạt động' : 'Dừng hoạt động'}
                </span>
            </div>
        </div>
    );
};

const DepartmentManagement = () => {
    const [search, setSearch] = useState(null);
    const [filter, setFilter] = useState('Tất cả');
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isShowServiceCreatePopUp, setIsShowServiceCreatePopUp] = useState(false);
    const [isShowServiceUpdatePopUp, setIsShowServiceUpdatePopUp] = useState(false);
    const [isLoadingCreate, setIsLoadingCreate] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [initDataEdit, setInitDataEdit] = useState(null);

    useEffect(() => {
        fetchDepartment();
    }, [])
    const fetchDepartment = async () => {
        try {
            setIsLoading(true);
            const res = await getAllDepartments();
            setDepartments(res.data.data);
        } catch (e) {
            toast.error('Tải dữ liệu thất bại!')
        } finally {
            setIsLoading(false);
        }
    }

    const handleCreateDepartment = async (data) => {
        try {
            setIsLoadingCreate(true);
            await createDepartment(data);
            fetchDepartment();
            setIsShowServiceCreatePopUp(false);
            toast.success('Thêm chuyên ngành thành công');
        } catch (error) {
            toast.error('Thêm chuyên ngành thất bại');
        } finally {
            setIsLoadingCreate(false);
        }
    }

    const handleOpenEditPopUp = (data) => {
        try {
            setIsShowServiceUpdatePopUp(true);
            setInitDataEdit(data);
        } catch (error) {
            toast.error('Không thể mở của sổ chỉnh sửa')
            setIsShowServiceUpdatePopUp(false)
        }
    }
    const handleEditDepartment = async (data) => {
        try {
            const id = data.department_id;
            const mainData = {
                name: data.name,
                description: data.description,
                is_active: data.is_active
            }
            setIsLoadingUpdate(true);
            await updateDepartment(id, mainData);
            fetchDepartment();
            setIsShowServiceUpdatePopUp(false);
            toast.success('Chỉnh sửa chuyên ngành thành công');
        } catch (error) {
            toast.error('Chỉnh sửa chuyên ngành thất bại');
        } finally {
            setIsLoadingUpdate(false);
        }
    }

    const handleDeleteDepartment = async (id) => {
        try {
            setIsLoading(true);
            await deleteDepartment(id);
            fetchDepartment();
            toast.success('Xóa chuyên ngành thành công');
        } catch (error) {
            toast.error('Xóa chuyên ngành thất bại');
        } finally {
            setIsLoading(false);
        }
    }

    const filteredDepartments = useMemo(() => {
        return filterBySearchAndStatus({
            data: departments,
            search,
            filter,
            searchFields: ["name", "description"]
        });
    }, [departments, search, filter]);

    if (isLoading) return (
        <div className="relative flex-1">
            <LoadingSpinner />
        </div>
    );

    return (
        <>
            <main className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Danh mục Chuyên khoa</h1>
                        <p className="text-gray-500 mt-1 font-medium">Quản lý và tùy chỉnh các chuyên khoa và gói dịch vụ y tế của phòng khám.</p>
                    </div>
                    <button
                        onClick={() => setIsShowServiceCreatePopUp(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
                    >
                        <Icons.Plus size={20} />
                        Thêm chuyên khoa mới
                    </button>
                </div>

                {/* Filter & Search Bar */}
                <SearchFilterBar
                    placeholder="Tìm kiếm tên dịch vụ hoặc mô tả..."
                    filters={['Tất cả', 'Hoạt động', 'Dừng hoạt động']}
                    defaultFilter="Tất cả"
                    onSearch={(value) => setSearch(value)}
                    onFilterChange={(value) => setFilter(value)}
                />

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(filteredDepartments.length > 0 ? filteredDepartments.map(department => (
                        <ServiceCard key={department.department_id} service={department} handleDeleteDepartment={handleDeleteDepartment} handleOpenEditPopUp={handleOpenEditPopUp} />
                    )) : <h1>Chưa có chuyên khoa nào</h1>
                    )}

                    {/* Empty State / Add Placeholder */}
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-gray-400 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group">
                        <div className="p-4 bg-gray-50 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <Icons.Plus size={32} />
                        </div>
                        <p className="mt-4 font-bold text-sm">Tạo thêm dịch vụ chuyên khoa</p>
                    </div>
                </div>

                {/* Pagination Footer */}
                <div className="mt-12 flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <span className="text-sm text-gray-400">Hiển thị 6 trên 12 dịch vụ</span>
                    <div className="flex gap-2">
                        <button className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50"><Icons.ChevronLeft size={18} /></button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md shadow-blue-100">1</button>
                        <button className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm font-bold">2</button>
                        <button className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50"><Icons.ChevronRight size={18} /></button>
                    </div>
                </div>
            </main>

            {isShowServiceCreatePopUp && <DynamicModal
                title="Thêm chuyên khoa"
                fields={departmentFields}
                onSubmit={(data) => handleCreateDepartment(data)}
                onClose={() => setIsShowServiceCreatePopUp(false)}
                isLoading={isLoadingCreate}
            />}
            {isShowServiceUpdatePopUp && <DynamicModal
                title="Chỉnh sửa chuyên khoa"
                fields={departmentFields}
                onSubmit={(data) => handleEditDepartment(data)}
                onClose={() => setIsShowServiceUpdatePopUp(false)}
                isLoading={isLoadingUpdate}
                initialData={initDataEdit}
            />}

        </>
    );
};

export default DepartmentManagement;