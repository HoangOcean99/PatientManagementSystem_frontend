import React from 'react';


const Coordinator = () => {
    return (
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        <div className="xl:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 flex justify-between items-start border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Danh sách Ứng viên Sẵn sàng</h2>
                    <p className="text-gray-500 text-sm mt-1">Ứng viên đã check-in và đang chờ gán phòng</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                    <i className="fa-solid fa-filter"></i> Bộ lọc
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500">Ứng viên</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500">Chuyên khoa</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500">Trạng thái</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500">Check-in</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-10 h-10 rounded-full object-cover"/>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Lê Văn Tám</p>
                                        <p className="text-xs text-gray-500">Tư vấn chuyên sâu</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="bg-[#7857DB] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">Đa khoa</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="bg-[#D38B6B] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Đã đến</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">14:18:28</td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-4">
                                    <button className="text-[#7857DB] hover:text-purple-800"><i className="fa-regular fa-eye"></i></button>
                                    <button className="text-[#4DBE9E] hover:text-teal-700"><i className="fa-solid fa-user-plus"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr className ="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src="https://i.pravatar.cc/150?img=5" alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Trần Thị Hoa</p>
                                        <p className="text-xs text-gray-500">Khám tổng quát</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="bg-[#FCE4E4] text-[#D86F6F] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">Đa khoa</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="bg-[#5B63D3] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Assigned</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">14:18:35</td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-4">
                                    <button className="text-[#7857DB] hover:text-purple-800"><i className="fa-regular fa-eye"></i></button>
                                    <button className="text-[#D86F6F] hover:text-red-700"><i className="fa-solid fa-user-minus"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4"> 
                                <div className="flex items-center gap-3">
                                    <img src="https://i.pravatar.cc/150?img=12" alt="Avatar" className ="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Nguyễn Minh Khôi</p>
                                        <p className="text-xs text-gray-500">Xét nghiệm máu</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="bg-[#E0F4F4] text-[#3D9494] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">Huyết học</span>
                            </td>
                            <td className="px-6 py-4">  
                                <span className="bg-[#D38B6B] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Đã đến</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">14:20:12</td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-4">
                                    <button className="text-[#7857DB] hover:text-purple-800"><i className="fa-regular fa-eye"></i></button>
                                    <button className="text-[#4DBE9E] hover:text-teal-700"><i className="fa-solid fa-user-plus"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src="https://i.pravatar.cc/150?img=9" alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Phạm Hồng Nhung</p>
                                        <p className="text-xs text-gray-500">Tư vấn chuyên sâu</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">  
                                <span className="bg-[#FCE4E4] text-[#D86F6F] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">Đa khoa</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="bg-[#D38B6B] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Đã đến</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">14:22:45</td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-4">
                                    <button className="text-[#7857DB] hover:text-purple-800"><i className="fa-regular fa-eye"></i></button>
                                    <button className="text-[#4DBE9E] hover:text-teal-700"><i className="fa-solid fa-user-plus"></i></button>
                                </div>
                            </td>
                        </tr>
                        <tr className ="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src="https://i.pravatar.cc/150?img=68" alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Vũ Quốc Bảo</p>
                                        <p className="text-xs text-gray-500">Khám định kỳ</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="bg-[#FCECDA] text-[#D08B48] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">Tổng quát</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="bg-[#F1F3F5] text-[#6B7280] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Waiting</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">14:25:00</td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-4">
                                    <button className="text-[#7857DB] hover:text-purple-800"><i className="fa-regular fa-eye"></i></button>
                                    <button className="text-[#4DBE9E] hover:text-teal-700"><i className="fa-solid fa-user-plus"></i></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div className="xl:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
            <div className="p-6 pb-4 flex justify-between items-start border-b border-gray-100 mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Danh sách Bàn trực</h2>
                    <p className="text-gray-500 text-sm mt-1">Theo dõi trạng thái phòng phỏng vấn/khám</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <i className="fa-solid fa-ellipsis"></i>
                </button>
            </div>

            <div className="p-6 pt-0 space-y-4 overflow-y-auto">
                
                <div className="border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start gap-4">
                            <img src="https://i.pravatar.cc/150?img=14" alt="Doctor" className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    Phòng 101 <span className="text-gray-400 text-xs font-normal">• Ngoại khoa</span>
                                </p>
                                <p className="text-base font-bold text-gray-900 mt-0.5">BS. Phan Anh</p>
                                <p className="text-xs text-gray-500 mt-0.5">phananh023@gmail.com</p>
                            </div>
                        </div>
                        <span className="bg-[#67D4B6] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">Ready To Interview</span>
                    </div>
                    <div className="border-t border-[#E5E7EB] pt-3">
                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Đang gán cho:</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#67D4B6]"></div>
                            <span className="text-sm font-semibold text-[#5B63D3]">Lê Văn Tám</span>
                        </div>
                    </div>
                </div>

                <div className="border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start gap-4">
                            <img src="https://i.pravatar.cc/150?img=32" alt="Doctor" className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    Phòng 102 <span className="text-gray-400 text-xs font-normal">• Sản nhi</span>
                                </p>
                                <p className="text-base font-bold text-gray-900 mt-0.5">BS. Nguyễn Huệ</p>
                                <p className="text-xs text-gray-500 mt-0.5">huenguyen67@gmail.com</p>
                            </div>
                        </div>
                        <span className="bg-[#D38B6B] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">Đang khám</span>
                    </div>
                    <div className="border-t border-[#E5E7EB] pt-3">
                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Đang gán cho:</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#67D4B6]"></div>
                            <span className="text-sm font-semibold text-[#5B63D3]">Trần Thị Hoa</span>
                        </div>
                    </div>
                </div>

                <div className="border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <i className="fa-solid fa-user-doctor text-xl"></i>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    Phòng 105 <span className="text-gray-400 text-xs font-normal">• Xét nghiệm</span>
                                </p>
                                <p className="text-base font-bold text-gray-900 mt-0.5">BS. Lê Lợi</p>
                                <p className="text-xs text-gray-500 mt-0.5">dan3002.work@gmail.com</p>
                            </div>
                        </div>
                        <span className="bg-[#C84040] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">Trống</span>
                    </div>
                    <div className="border-t border-[#E5E7EB] pt-3 flex justify-between items-end">
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Đang gán cho:</p>
                            <span className="text-sm italic text-gray-400">Chưa có bệnh nhân</span>
                        </div>
                        <button className="bg-[#67D4B6] hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors">
                            Gán ngay
                        </button>
                    </div>
                </div>

            </div>
        </div>
        
    </div>
    );
};
export default Coordinator;