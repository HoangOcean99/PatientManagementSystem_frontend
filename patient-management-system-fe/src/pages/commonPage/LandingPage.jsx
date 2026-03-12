import { Activity } from 'lucide-react';
import React, { useState } from 'react';
import { HiOutlineChatAlt2, HiOutlineCursorClick, HiOutlineLogin, HiOutlineSparkles, HiX } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="font-sans text-gray-700 antialiased overflow-x-hidden bg-white" style={{ width: '100vw' }}>
            <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
                            <div className="bg-blue-600 p-1 rounded text-white"><Activity size={20} /></div>
                            MedSchedule
                        </div>

                        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600 items-center">
                            <a href="#features" className="hover:text-blue-600 transition">Tính năng</a>
                            <a href="#how-it-works" className="hover:text-blue-600 transition">Quy trình</a>
                            <a href="#testimonials" className="hover:text-blue-600 transition">Đánh giá</a>
                            <a href="#app" className="hover:text-blue-600 transition">Ứng dụng</a>
                            <a onClick={() => navigate('/admin/patients')} className="hover:text-blue-600 transition cursor-pointer">Quản trị</a>

                            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                                <a onClick={() => navigate('/login')} className="text-sm font-semibold text-gray-600 hover:text-blue-600 cursor-pointer">Đăng nhập</a>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5"
                                >
                                    Đặt lịch ngay
                                </button>
                            </div>
                        </div>

                        <div className="md:hidden flex items-center z-50">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-gray-900 focus:outline-none"
                            >
                                {isMobileMenuOpen ? (
                                    <i className="fa-solid fa-xmark text-2xl"></i>
                                ) : (
                                    <i className="fa-solid fa-bars text-2xl"></i>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Nav cho mobile */}
                <div className={`fixed inset-0 z-50 transition-all duration-500 ease-in-out md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}>

                    <div
                        className="absolute inset-0 bg-white/90 backdrop-blur-3xl shadow-2xl border-white/20" style={{ height: '100vh' }}
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className={`relative h-full w-full flex flex-col p-8 transition-transform duration-500 ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-10'
                        }`}>

                        <div className="flex justify-end mb-12">
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-3 bg-gray-100 rounded-full text-gray-600 active:scale-90 transition-all"
                            >
                                <HiX size={24} />
                            </button>
                        </div>

                        <nav className="flex flex-col space-y-6 flex-1">
                            {[
                                { href: "#features", label: "Tính năng", icon: <HiOutlineSparkles /> },
                                { href: "#how-it-works", label: "Quy trình", icon: <HiOutlineCursorClick /> },
                                { href: "#testimonials", label: "Đánh giá", icon: <HiOutlineChatAlt2 /> },
                                { onClick: () => navigate('/admin/patients'), label: "Quản trị", icon: <HiOutlineSparkles /> },
                                { onClick: () => navigate('/login'), label: "Đăng nhập", icon: <HiOutlineLogin /> },
                            ].map((item, index) => (
                                <a
                                    key={index}
                                    href={item.href}
                                    onClick={item.onClick || (() => setIsMobileMenuOpen(false))}
                                    className="flex items-center gap-4 text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors group"
                                >
                                    <span className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </a>
                            ))}
                        </nav>

                        <div className="mt-8 space-y-4">
                            <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2rem] border border-blue-100/50">
                                <p className="text-sm text-blue-600 font-bold mb-4 text-center">Sẵn sàng để bắt đầu?</p>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        navigate('/login');
                                    }}
                                    className="w-full bg-blue-600 text-white py-4 rounded-2xl text-lg font-black shadow-xl shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    Đặt lịch ngay
                                    <HiOutlineSparkles size={20} />
                                </button>
                            </div>

                            <p className="text-center text-gray-400 text-xs">
                                © 2026 HealthCare App. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </nav>

            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-64 h-64 md:w-80 md:h-80 bg-blue-200 rounded-full blur-3xl opacity-50"></div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="w-full lg:w-1/2 text-center lg:text-left">
                            <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
                                <i className="fa-solid fa-star text-yellow-400 mr-1"></i> Giải pháp Y tế số 1
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                                Chăm sóc sức khỏe <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Trong tầm tay bạn</span>
                            </h1>
                            <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                                Đặt lịch khám với các bác sĩ hàng đầu chỉ trong 30 giây. Không còn chờ đợi mệt mỏi, quản lý hồ sơ sức khỏe trọn đời ngay trên điện thoại.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/40 transition transform hover:-translate-y-1 flex items-center justify-center gap-2 w-full sm:w-auto"
                                >
                                    <i className="fa-solid fa-calendar-check"></i> Đặt lịch khám
                                </button>
                                <button className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-xl font-bold text-lg shadow-sm transition flex items-center justify-center gap-2 w-full sm:w-auto">
                                    <i className="fa-solid fa-play-circle text-blue-600"></i> Xem Demo
                                </button>
                            </div>

                            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-gray-500">
                                <div className="flex -space-x-2">
                                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=1" alt="User" />
                                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=2" alt="User" />
                                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=3" alt="User" />
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold">+2k</div>
                                </div>
                                <p>Được tin dùng bởi hơn 2,000 bệnh nhân.</p>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 relative mt-10 lg:mt-0">
                            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                                <img src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Doctor App Dashboard" className="w-full h-auto object-cover" />

                                <div className="absolute top-6 left-6 md:top-10 md:-left-6 bg-white p-3 md:p-4 rounded-xl shadow-lg animate-bounce hidden sm:block">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <i className="fa-solid fa-check"></i>
                                        </div>
                                        <div>
                                            <p className="text-[10px] md:text-xs text-gray-500">Trạng thái</p>
                                            <p className="text-xs md:text-sm font-bold text-gray-800">Đặt lịch thành công</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white py-10 border-b border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-gray-100">
                        <div className="p-4">
                            <p className="text-2xl md:text-3xl font-extrabold text-blue-600">50k+</p>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">Bệnh nhân hài lòng</p>
                        </div>
                        <div className="p-4">
                            <p className="text-2xl md:text-3xl font-extrabold text-blue-600">120+</p>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">Phòng khám đối tác</p>
                        </div>
                        <div className="p-4">
                            <p className="text-2xl md:text-3xl font-extrabold text-blue-600">500+</p>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">Bác sĩ chuyên khoa</p>
                        </div>
                        <div className="p-4">
                            <p className="text-2xl md:text-3xl font-extrabold text-blue-600">24/7</p>
                            <p className="text-xs md:text-sm text-gray-500 mt-1">Hỗ trợ trực tuyến</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="py-16 md:py-24 bg-gray-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Tính năng vượt trội</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">Mọi thứ bạn cần để quản lý sức khỏe</h2>
                        <p className="text-gray-500 text-base md:text-lg">Hệ thống tích hợp toàn diện giúp kết nối bệnh nhân và bác sĩ một cách liền mạch nhất.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                        {[
                            { icon: "fa-regular fa-calendar-check", color: "text-blue-600", bg: "bg-blue-100", title: "Đặt lịch thông minh", desc: "Xem lịch trống của bác sĩ theo thời gian thực. Đặt lịch khám, tái khám chỉ với vài cú chạm." },
                            { icon: "fa-solid fa-file-medical", color: "text-purple-600", bg: "bg-purple-100", title: "Hồ sơ điện tử (EHR)", desc: "Lưu trữ toàn bộ lịch sử khám, đơn thuốc, kết quả xét nghiệm bảo mật tuyệt đối." },
                            { icon: "fa-solid fa-bell", color: "text-teal-600", bg: "bg-teal-100", title: "Nhắc nhở tự động", desc: "Không bao giờ lỡ hẹn hay quên uống thuốc nhờ hệ thống nhắc nhở tự động qua SMS và App." },
                            { icon: "fa-solid fa-video", color: "text-orange-600", bg: "bg-orange-100", title: "Tư vấn từ xa", desc: "Kết nối video call trực tiếp với bác sĩ cho các vấn đề sức khỏe nhẹ hoặc tư vấn sơ bộ." },
                            { icon: "fa-solid fa-user-doctor", color: "text-pink-600", bg: "bg-pink-100", title: "Tìm bác sĩ giỏi", desc: "Tìm kiếm bác sĩ theo chuyên khoa, vị trí, giá tiền và xem đánh giá thực tế từ bệnh nhân." },
                            { icon: "fa-solid fa-credit-card", color: "text-indigo-600", bg: "bg-indigo-100", title: "Thanh toán minh bạch", desc: "Hỗ trợ thanh toán viện phí, phí khám online qua thẻ ngân hàng, ví điện tử nhanh chóng." }
                        ].map((feature, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 group">
                                <div className={`w-12 h-12 md:w-14 md:h-14 ${feature.bg} rounded-xl flex items-center justify-center ${feature.color} text-2xl mb-6 group-hover:bg-opacity-80 transition`}>
                                    <i className={feature.icon}></i>
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-500 text-sm md:text-base leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16">
                        <div className="lg:w-1/2 w-full">
                            <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Process" className="rounded-3xl shadow-2xl object-cover h-[400px] md:h-[600px] w-full" />
                        </div>
                        <div className="lg:w-1/2 w-full">
                            <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Quy trình đơn giản</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-8">4 Bước để chăm sóc sức khỏe toàn diện</h2>

                            <div className="space-y-6 md:space-y-8">
                                {[
                                    { num: 1, title: "Tìm kiếm & Lựa chọn", desc: "Nhập triệu chứng hoặc chuyên khoa, hệ thống sẽ đề xuất các bác sĩ phù hợp nhất." },
                                    { num: 2, title: "Đặt lịch hẹn", desc: "Chọn khung giờ trống phù hợp với lịch trình của bạn và xác nhận đặt lịch." },
                                    { num: 3, title: "Khám bệnh", desc: "Đến phòng khám đúng giờ hoặc kết nối online. Không cần chờ đợi lấy số." },
                                    { num: 4, title: "Nhận kết quả & Chăm sóc", desc: "Nhận đơn thuốc, kết quả xét nghiệm qua ứng dụng và nhận tin nhắn nhắc tái khám." }
                                ].map((step) => (
                                    <div key={step.num} className="flex gap-4 md:gap-6">
                                        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg md:text-xl">{step.num}</div>
                                        <div>
                                            <h4 className="text-lg md:text-xl font-bold text-gray-900">{step.title}</h4>
                                            <p className="text-gray-500 text-sm md:text-base mt-1 md:mt-2">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="app" className="py-16 md:py-24 bg-blue-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="bg-blue-600 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 overflow-hidden relative shadow-2xl">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 md:w-96 md:h-96 rounded-full bg-blue-500 opacity-50 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 md:w-80 md:h-80 rounded-full bg-blue-700 opacity-50 blur-3xl"></div>

                        <div className="flex flex-col md:flex-row items-center relative z-10 gap-10">
                            <div className="w-full md:w-1/2 text-white text-center md:text-left">
                                <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Tải ứng dụng MedCare ngay hôm nay</h2>
                                <p className="text-blue-100 text-base md:text-lg mb-8 max-w-md mx-auto md:mx-0">Trải nghiệm đặt lịch siêu tốc và quản lý sức khỏe cá nhân ngay trên chiếc điện thoại của bạn.</p>
                                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                                    <button className="bg-black text-white px-5 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-800 transition shadow-lg w-full sm:w-auto">
                                        <i className="fa-brands fa-apple text-2xl md:text-3xl"></i>
                                        <div className="text-left">
                                            <p className="text-[10px] uppercase">Download on the</p>
                                            <p className="font-bold text-base md:text-lg leading-none">App Store</p>
                                        </div>
                                    </button>
                                    <button className="bg-black text-white px-5 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-800 transition shadow-lg w-full sm:w-auto">
                                        <i className="fa-brands fa-google-play text-xl md:text-2xl"></i>
                                        <div className="text-left">
                                            <p className="text-[10px] uppercase">Get it on</p>
                                            <p className="font-bold text-base md:text-lg leading-none">Google Play</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
                                <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-48 md:w-64 lg:w-80 rounded-[2rem] md:rounded-[3rem] border-[6px] md:border-8 border-gray-900 shadow-2xl transform rotate-0 md:rotate-6 hover:rotate-0 transition duration-500" alt="Mobile App" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-2 mb-4 text-white">
                                <i className="fa-solid fa-heart-pulse text-blue-500 text-2xl"></i>
                                <span className="text-2xl font-bold">MedCare.</span>
                            </div>
                            <p className="text-sm leading-relaxed mb-6">
                                Nền tảng công nghệ y tế tiên phong, mang lại trải nghiệm khám chữa bệnh hiện đại, tiện lợi và nhân văn.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition"><i className="fa-brands fa-facebook-f"></i></a>
                                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition"><i className="fa-brands fa-twitter"></i></a>
                                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition"><i className="fa-brands fa-linkedin-in"></i></a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-4">Dịch vụ</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-blue-500 transition">Đặt lịch bác sĩ</a></li>
                                <li><a href="#" className="hover:text-blue-500 transition">Tư vấn trực tuyến</a></li>
                                <li><a href="#" className="hover:text-blue-500 transition">Hồ sơ sức khỏe</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-bold mb-4">Công ty</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-blue-500 transition">Về chúng tôi</a></li>
                                <li><a href="#" className="hover:text-blue-500 transition">Tuyển dụng</a></li>
                                <li><a href="#" className="hover:text-blue-500 transition">Liên hệ</a></li>
                            </ul>
                        </div>

                        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                            <h3 className="text-white font-bold mb-4">Đăng ký nhận tin</h3>
                            <form className="flex gap-2">
                                <input type="email" placeholder="Email của bạn" className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm" />
                                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-bold transition">
                                    <i className="fa-solid fa-paper-plane"></i>
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-center md:text-left gap-4">
                        <p>&copy; 2026 MedCare Systems. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white">Điều khoản</a>
                            <a href="#" className="hover:text-white">Bảo mật</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;