import React from 'react';

const QueueDashboard = () => {
    const roomsData = [
        {
            id: 'A',
            name: 'Phòng A - Nhi',
            nameDoctor: 'Nguyễn Thị Hoa',
            waitingCount: 5,
            currentPatient: { id: '#A01', name: 'Nguyễn Văn An', status: 'Đang vào', time: '08:00' },
            queue: [
                { id: '#A02', name: 'Trần Thị Bình', status: 'Chờ' },
                { id: '#A03', name: 'Lê Văn Cường', status: 'Chờ' },
                { id: '#A04', name: 'Phạm Thị Duyên', status: 'Chờ' },
            ],
            extraCount: 1,
        },
        {
            id: 'B',
            name: 'Phòng B - Nội Tổng quát',
            nameDoctor: 'Nguyễn Thị Lý',
            waitingCount: 3,
            currentPatient: { id: '#B05', name: 'Đặng Thị Lan', status: 'Đang vào', time: '08:30' },
            queue: [
                { id: '#B06', name: 'Võ Văn Hùng', status: 'Chờ' },
                { id: '#B07', name: 'Bùi Thị Mai', status: 'Chờ' },
            ],
            extraCount: 0,
        },
        {
            id: 'C',
            name: 'Phòng C - Răng Hàm Mặt',
            nameDoctor: 'Nguyễn Thị Hoa',
            waitingCount: 6,
            currentPatient: { id: '#C12', name: 'Phan Anh Tú', status: 'Đang vào', time: '09:15' },
            queue: [
                { id: '#C13', name: 'Ngô Kim Ngân', status: 'Chờ' },
                { id: '#C14', name: 'Dương Thành Cô', status: 'Chờ' },
                { id: '#C15', name: 'Tạ Minh Khuê', status: 'Chờ' },
            ],
            extraCount: 2,
            isDragging: true,
        },
        {
            id: 'D',
            name: 'Phòng D - Cấp cứu',
            nameDoctor: 'Nguyễn Thị Hoa',
            waitingCount: 3,
            currentPatient: { id: '#D01', name: 'Trịnh Quang Vinh', status: 'Đang vào', time: '10:00' },
            queue: [
                { id: '#D02', name: 'Chu Thị Thảo', status: 'Chờ' },
                { id: '#D03', name: 'Cao Gia Bảo', status: 'Chờ' },
            ],
            extraCount: 0,
        },
        {
            id: 'E',
            name: 'Phòng E - Da liễu',
            nameDoctor: 'Nguyễn Thị Hoa',
            waitingCount: 2,
            currentPatient: { id: '#E03', name: 'Lê Thanh Bình', status: 'Đang vào', time: '08:45' },
            queue: [
                { id: '#E04', name: 'Phan Thị Hoa', status: 'Chờ' },
            ],
            extraCount: 0,
        },
        {
            id: 'F',
            name: 'Phòng F - Tai Mũi Họng',
            nameDoctor: 'Nguyễn Thị Hoa',
            waitingCount: 3,
            currentPatient: { id: '#F08', name: 'Ngô Đình Khoa', status: 'Đang vào', time: '09:30' },
            queue: [
                { id: '#F09', name: 'Trần Mai Phương', status: 'Chờ' },
                { id: '#F10', name: 'Lâm Tuấn Kiệt', status: 'Chờ' },
            ],
            extraCount: 0,
        },
    ];

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
            <div className="mx-auto space-y-6">

                {/* Top Filter Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[150px]">
                            <option>Tất cả khoa</option>
                        </select>
                        <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[150px]">
                            <option>Tất cả phòng</option>
                        </select>
                        <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[150px]">
                            <option>Tất cả ưu tiên</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* Grid Icon Indicator */}
                        <div className="hidden md:flex text-gray-300 mr-2">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"></path></svg>
                        </div>
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                            Áp dụng bộ lọc
                        </button>
                        <button className="flex-1 md:flex-none px-6 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors bg-white">
                            Đặt lại
                        </button>
                    </div>
                </div>

                {/* Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                    {roomsData.map((room) => (
                        <div key={room.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-5">

                            {/* Card Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-2">
                                    <svg className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                    <h2 className="font-bold text-gray-900 text-lg leading-tight w-32">{room.name}</h2>
                                    <p className="text-gray-500 text-[13px]">{room.nameDoctor}</p>
                                </div>
                                <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                    {room.waitingCount} đang chờ
                                </span>
                            </div>

                            {/* Current Patient Box */}
                            <div className={`relative bg-[#f8f9ff] rounded-xl p-4 flex flex-col gap-4 ${room.isDragging ? 'border-2 border-indigo-200' : 'border border-indigo-50'}`}>
                                {room.isDragging && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-gray-300 px-1 rounded">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 6a2 2 0 11-4 0 2 2 0 014 0zM8 12a2 2 0 11-4 0 2 2 0 014 0zM8 18a2 2 0 11-4 0 2 2 0 014 0zM20 6a2 2 0 11-4 0 2 2 0 014 0zM20 12a2 2 0 11-4 0 2 2 0 014 0zM20 18a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-indigo-500">{room.currentPatient.id}</span>
                                    <span className="font-bold text-gray-900 text-[15px] text-right max-w-[120px] leading-tight">{room.currentPatient.name}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        Bắt đầu: {room.currentPatient.time}
                                    </span>

                                    <span className="bg-indigo-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                        Đang vào
                                    </span>
                                </div>

                                <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm font-semibold transition-colors shadow-sm mt-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                    Gọi Tiếp Theo
                                </button>
                            </div>

                            {/* Queue List */}
                            <div className="pt-2">
                                <h3 className="text-[13px] font-semibold text-gray-700 mb-3">Hàng đợi tiếp theo:</h3>
                                <div className="space-y-3">
                                    {room.queue.map((patient, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-[13px]">
                                            <span className="font-bold text-gray-900 w-12">{patient.id}</span>
                                            <span className="flex-1 text-gray-600 font-medium">{patient.name}</span>
                                            <span className="bg-[#cd607b] text-white text-[10px] font-bold px-2.5 py-1 rounded-full w-[42px] text-center shrink-0">
                                                {patient.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                {room.extraCount > 0 && (
                                    <p className="text-[11px] text-gray-400 font-medium text-center mt-3">
                                        Và {room.extraCount} bệnh nhân khác...
                                    </p>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default QueueDashboard;