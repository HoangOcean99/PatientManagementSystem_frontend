import React, { useEffect, useMemo, useState } from 'react';
import * as Icons from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';
import { getDepartmentById } from '../../api/departmentApi';
import { createClinicService, deleteClinicService, getAllClinicServiceByDepartment, updateClinicService } from '../../api/clinicServiceApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import DynamicModal from '../../components/common/DynamicModal';
import { filterBySearchAndStatus } from '../../helpers/SearchFilterUtils';
import SearchFilterBar from '../../components/common/SearchFilterBar';

const ClinicServicesManagement = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState(null);
    const [filter, setFilter] = useState('Tất cả');
    const { department } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [departments, setDepartments] = useState(null);
    const [clinicServices, setClinicServices] = useState(null);
    const [isShowServiceCreatePopUp, setIsShowServiceCreatePopUp] = useState(false);
    const [isShowServiceUpdatePopUp, setIsShowServiceUpdatePopUp] = useState(false);
    const [isLoadingCreate, setIsLoadingCreate] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [initDataEdit, setInitDataEdit] = useState(null);

    const clinicServiceFields = [
        {
            name: "name",
            label: "Tên dịch vụ",
            type: "text",
            required: true
        },
        {
            name: "description",
            label: "Mô tả dịch vụ",
            type: "textarea",
            required: true,
            rows: 5
        },
        {
            name: "price",
            label: "Giá dịch vụ",
            type: "text",
            required: true,
        },
        {
            name: "duration_minutes",
            label: "Thời gian dịch vụ",
            type: "textarea",
            required: true,
        },
        {
            name: "is_active",
            label: "Trạng thái dịch vụ",
            type: "select",
            required: true,
            options: [
                { label: 'Hoạt động', value: true },
                { label: 'Dừng hoạt động', value: false }
            ]
        },

    ];

    useEffect(() => {
        fetchClinicService();
    }, []);
    const fetchClinicService = async () => {
        try {
            setIsLoading(true);
            const resDepartment = await getDepartmentById(department);
            const clinicServiceData = resDepartment.data.data.ClinicServices;
            setDepartments(resDepartment.data.data);
            setClinicServices(clinicServiceData);
        } catch (error) {
            toast.error('Tải dữ liệu thất bại!')
        } finally {
            setIsLoading(false);
        }
    }

    const handleCreateClinicService = async (data) => {
        try {
            setIsLoadingCreate(true);
            const mainData = { ...data, department_id: department }
            await createClinicService(mainData);
            fetchClinicService();
            setIsShowServiceCreatePopUp(false);
            toast.success('Thêm dịch vụ thành công');
        } catch (error) {
            toast.error('Thêm dịch vụ thất bại');
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
    const handleEditClinicService = async (data) => {
        try {
            const id = data.service_id;
            const mainData = {
                name: data.name,
                description: data.description,
                price: data.price,
                duration_minutes: data.duration_minutes,
                is_active: data.is_active
            }
            setIsLoadingUpdate(true);
            await updateClinicService(id, mainData);
            fetchClinicService();
            setIsShowServiceUpdatePopUp(false);
            toast.success('Chỉnh sửa dịch vụ thành công');
        } catch (error) {
            toast.error('Chỉnh sửa dịch vụ thất bại');
        } finally {
            setIsLoadingUpdate(false);
        }
    }

    const handleDeleteClinicService = async (id) => {
        try {
            setIsLoading(true);
            await deleteClinicService(id);
            fetchClinicService();
            toast.success('Xóa dịch vụ thành công');
        } catch (error) {
            toast.error('Xóa dịch vụ thất bại');
        } finally {
            setIsLoading(false);
        }
    }
    const filteredClinicService = useMemo(() => {
        return filterBySearchAndStatus({
            data: clinicServices || [],
            search,
            filter,
            searchFields: ["name", "description"]
        });
    }, [clinicServices, search, filter]);

    if (isLoading || !departments || !clinicServices) return (
        <div className="relative flex-1">
            <LoadingSpinner />
        </div>
    );


    return (
        <main className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
            {/* Header: Thông tin khoa */}
            <div className="mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-5 flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                >
                    <Icons.ArrowLeft size={18} /> Quay lại
                </button>

                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-800">{departments.name}</h1>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${departments.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {departments.is_active ? 'HOẠT ĐỘNG' : 'DỪNG HOẠT ĐỘNG'}
                            </span>
                        </div>
                        <p className="text-gray-500 max-w-2xl">{departments.description}</p>
                    </div>
                    <button
                        onClick={() => setIsShowServiceCreatePopUp(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                    >
                        <Icons.Plus size={20} /> Thêm dịch vụ mới
                    </button>
                </div>
            </div>
            <SearchFilterBar
                placeholder="Tìm kiếm tên dịch vụ hoặc mô tả..."
                filters={['Tất cả', 'Hoạt động', 'Dừng hoạt động']}
                defaultFilter="Tất cả"
                onSearch={(value) => setSearch(value)}
                onFilterChange={(value) => setFilter(value)}
            />
            {/* Bảng danh sách ClinicServices */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {filteredClinicService.length > 0 &&
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tên dịch vụ</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Thời lượng</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Giá niêm yết</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredClinicService.map(service => (
                                <tr
                                    key={service.service_id}
                                    className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                                    onClick={() => navigate(`/admin/clinic-service-detail/${service.service_id}`)}
                                >
                                    <td className="px-6 py-5">
                                        <div className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{service.name}</div>
                                        <div className="text-xs text-gray-400 mt-1 line-clamp-1">{service.description}</div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Icons.Clock size={14} className="text-gray-400" />
                                            {service.duration_minutes} phút
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-gray-700">
                                        {new Intl.NumberFormat('vi-VN').format(service.price)} VNĐ
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${service.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${service.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                            {service.is_active ? 'Hoạt động' : 'Dừng hoạt động'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenEditPopUp(service)
                                                }}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <Icons.Edit3 size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClinicService(service.service_id)
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Icons.Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }

                {filteredClinicService.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icons.PackageOpen size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-gray-800 font-bold">Chưa có dịch vụ nào</h3>
                        <p className="text-gray-400 text-sm">Khoa này hiện chưa được gán dịch vụ y tế nào.</p>
                    </div>
                )}

                {isShowServiceCreatePopUp && <DynamicModal
                    title="Thêm dịch vụ"
                    fields={clinicServiceFields}
                    onSubmit={(data) => handleCreateClinicService(data)}
                    onClose={() => setIsShowServiceCreatePopUp(false)}
                    isLoading={isLoadingCreate}
                />}

                {isShowServiceUpdatePopUp && <DynamicModal
                    title="Chỉnh sửa dịch vụ"
                    fields={clinicServiceFields}
                    onSubmit={(data) => handleEditClinicService(data)}
                    onClose={() => setIsShowServiceUpdatePopUp(false)}
                    isLoading={isLoadingUpdate}
                    initialData={initDataEdit}

                />}
            </div>
        </main>
    );
};

export default ClinicServicesManagement;