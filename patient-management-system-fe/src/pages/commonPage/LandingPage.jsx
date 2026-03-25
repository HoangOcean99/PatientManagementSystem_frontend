import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    HeartPulse, Play, CheckCircle2, ArrowRight,
    CalendarDays, Activity, Video, CreditCard, Clock, ShieldCheck,
    Zap, Baby, Heart, Stethoscope, Dna, BrainCircuit, Mic, PlusSquare
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import baseApi from '../../api/baseApi';

// === CSS TÙY CHỈNH: IMPORT FONTS, SÓNG NƯỚC & LẬT THẺ 3D ===
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Quicksand:wght@400;500;600;700&display=swap');
  @keyframes cardWave {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .wave-card-bg {
    background-image: linear-gradient(
      -45deg,
      #76c2f5ff 0%, 
      #9f8de9ff 25%, 
      #F3F4F6 50%, 
      #2f9ce5ff 75%, 
      #C4B5FD 100% 
    );
    background-size: 300% 300%;
    animation: cardWave 8s ease infinite;
  }
  @keyframes wave {
    0% { background-position: -800px; }
    100% { background-position: 800px; }
  }
  .wave-text {
    background-image: linear-gradient(
      -45deg,
      #76c2f5ff 0%, 
      #9f8de9ff 25%, 
      #F3F4F6 50%, 
      #2f9ce5ff 75%, 
      #C4B5FD 100% 
    );
    background-size: 1600px 100%;
    background-clip: text;
    -webkit-background-clip: text;
    text-fill-color: transparent;
    -webkit-text-fill-color: transparent;
    animation: wave 12s linear infinite;
    display: inline-block;
  }
  
  /* Utilities cho Thẻ lật 3D */
  .perspective-1000 { perspective: 1000px; }
  .transform-style-3d { transform-style: preserve-3d; }
  .backface-hidden { 
    backface-visibility: hidden; 
    -webkit-backface-visibility: hidden; 
  }
  .rotate-y-180 { transform: rotateY(180deg); }
`;

const DepartmentCard = ({ icon: Icon, name, shortDesc, description, services }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const flipTimerRef = useRef(null);

    const handleMouseEnter = () => {
        setIsFlipped(true);
        if (flipTimerRef.current) {
            clearTimeout(flipTimerRef.current);
        }
        flipTimerRef.current = setTimeout(() => {
            setIsFlipped(false);
        }, 15000);
    };

    useEffect(() => {
        return () => {
            if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
        };
    }, []);

    return (
        <div
            className="relative h-96 group cursor-pointer perspective-1000"
            onMouseEnter={handleMouseEnter}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={`absolute inset-0 transition-transform duration-700 transform-style-3d shadow-sm hover:shadow-xl rounded-[1.5rem] ${isFlipped ? 'rotate-y-180' : ''}`}>

                {/* MẶT TRƯỚC: Wave-text Gradient */}
                <div className="absolute inset-0 p-8 flex flex-col items-center justify-center wave-card-bg border border-slate-100 rounded-[1.5rem] backface-hidden">
                    <div className="w-16 h-16 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center mb-6 shadow-sm">
                        <Icon size={32} className="text-blue-700" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-3 text-center" style={{ fontFamily: '"Quicksand", sans-serif' }}>
                        {name}
                    </h4>
                    <p className="text-slate-800 font-medium text-center leading-relaxed">
                        {shortDesc}
                    </p>
                </div>

                {/* MẶT SAU: Xanh pastel, Giới thiệu về Khoa */}
                <div className="absolute inset-0 p-8 flex flex-col justify-start bg-blue-50 border border-blue-100 rounded-[1.5rem] backface-hidden rotate-y-180 text-slate-800 overflow-y-auto">

                    <h4 className="text-xl font-bold mb-6 text-center mt-2 border-b border-blue-200 pb-4 text-blue-900" style={{ fontFamily: '"Quicksand", sans-serif' }}>
                        {name}
                    </h4>

                    {/* GIỚI THIỆU KHOA (Thay thế phần Bác sĩ) */}
                    <div className="mb-6">
                        <p className="text-sm text-slate-700 leading-relaxed text-justify">
                            {description}
                        </p>
                    </div>

                    {/* Dịch vụ tiêu biểu */}
                    <div className="flex-1">
                        <h5 className="text-sm font-bold mb-3 flex items-center gap-2 text-blue-700">
                            <Stethoscope size={16} /> Dịch vụ tiêu biểu:
                        </h5>
                        <ul className="space-y-2 text-sm font-medium text-slate-700 list-disc pl-5">
                            {services.map((service, idx) => <li key={idx}>{service}</li>)}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

const InfoModal = ({ isOpen, onClose, title, icon: Icon, content }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />
            <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20">
                {/* Header with Gradient */}
                <div className="bg-gradient-to-r from-[#76c2f5] to-[#9f8de9] px-8 py-6 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Icon size={24} className="text-white" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight" style={{ fontFamily: '"Quicksand", sans-serif' }}>
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 text-white transition-all hover:rotate-90"
                    >
                        <span className="text-2xl">✕</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-6">
                        {content}
                    </div>
                </div>

                {/* Footer and Close Button */}
                <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gradient-to-r from-[#76c2f5] to-[#9f8de9] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-300/50 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <span>Tôi đã hiểu</span>
                        <CheckCircle2 size={18} />
                    </button>
                </div>
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
};

const LandingPage = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isServerReady, setIsServerReady] = useState(false);
    const [activeModal, setActiveModal] = useState(null); // 'terms', 'privacy', or null
    const navigate = useNavigate();

    // Ping server trước khi render trang
    useEffect(() => {
        baseApi.healthCheck()
            .catch(() => { })
            .finally(() => setIsServerReady(true));
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isServerReady) {
        return (
            <div
                className="fixed inset-0 flex flex-col items-center justify-center gap-4"
                style={{
                    backgroundColor: '#f8fafc',
                    backgroundImage: `linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    fontFamily: '"Nunito", system-ui, sans-serif'
                }}
            >
                <style>{customStyles}</style>
                <LoadingSpinner />
            </div>
        );
    }

    const departmentsData = [
        {
            icon: HeartPulse,
            name: "Khoa Da liễu",
            shortDesc: "Chuyên chẩn đoán, điều trị các bệnh lý về da, lông, tóc, móng.",
            description: "Khoa Da liễu cung cấp các dịch vụ khám, chữa bệnh chuyên sâu về da, ứng dụng công nghệ laser hiện đại trong điều trị thẩm mỹ và phục hồi da tổn thương.",
            services: ["Khám và điều trị mụn, nám", "Điều trị sẹo rỗ, sẹo lồi", "Trẻ hóa da công nghệ cao"]
        },
        {
            icon: Baby,
            name: "Khoa Răng Hàm Mặt",
            shortDesc: "Cung cấp dịch vụ chăm sóc răng miệng toàn diện và thẩm mỹ nụ cười.",
            description: "Trang bị hệ thống ghế nha khoa và máy chụp X-quang hiện đại, khoa mang đến các giải pháp chỉnh nha, phục hình và điều trị bệnh lý răng miệng không đau.",
            services: ["Nhổ răng khôn không đau", "Niềng răng thẩm mỹ", "Cấy ghép Implant"]
        },
        {
            icon: Heart,
            name: "Khoa Ngoại Tổng Quát",
            shortDesc: "Thực hiện các phẫu thuật điều trị bệnh lý tiêu hóa, gan mật, ổ bụng.",
            description: "Áp dụng các phương pháp phẫu thuật nội soi tiên tiến, ít xâm lấn, giúp bệnh nhân rút ngắn thời gian hồi phục và hạn chế tối đa sẹo mổ.",
            services: ["Phẫu thuật nội soi ruột thừa", "Cắt túi mật nội soi", "Phẫu thuật thoát vị bẹn"]
        },
        {
            icon: Dna,
            name: "Khoa Nhi",
            shortDesc: "Chăm sóc toàn diện cho trẻ em từ sơ sinh đến tuổi vị thành niên.",
            description: "Môi trường thăm khám thân thiện, đội ngũ bác sĩ tâm lý giúp trẻ không sợ hãi. Cung cấp các gói khám tổng quát và tư vấn dinh dưỡng chuyên sâu.",
            services: ["Khám tổng quát định kỳ", "Tư vấn dinh dưỡng, phát triển", "Tiêm chủng trọn gói"]
        },
        {
            icon: BrainCircuit,
            name: "Khoa Nội Tổng Quát",
            shortDesc: "Tầm soát, chẩn đoán và điều trị nội khoa các bệnh lý toàn thân.",
            description: "Nơi tiếp nhận đầu tiên để phân loại bệnh lý. Đội ngũ bác sĩ giàu kinh nghiệm giúp chẩn đoán chính xác và đưa ra phác đồ điều trị nội khoa hiệu quả.",
            services: ["Khám sức khỏe tổng quát", "Tầm soát tiểu đường, huyết áp", "Điều trị bệnh lý hô hấp, tiêu hóa"]
        },
        {
            icon: PlusSquare,
            name: "Sản & Phụ Khoa",
            shortDesc: "Chăm sóc thai kỳ và tầm soát sức khỏe sinh sản phụ nữ.",
            description: "Cung cấp các gói thai sản trọn gói, tầm soát ung thư phụ khoa và chăm sóc sức khỏe phụ nữ các độ tuổi với sự tận tâm, an toàn và kín đáo.",
            services: ["Khám thai và siêu âm 4D", "Tầm soát ung thư cổ tử cung", "Gói thai sản trọn gói"]
        }
    ];

    const benefitsData = [
        { icon: CalendarDays, title: "Đặt lịch linh hoạt", desc: "Chọn bác sĩ, chuyên khoa và thời gian phù hợp chỉ với 3 thao tác.", color: "text-blue-500", bg: "bg-blue-50" },
        { icon: Activity, title: "Hồ sơ điện tử", desc: "Lưu trữ kết quả xét nghiệm, đơn thuốc trọn đời trên nền tảng đám mây.", color: "text-indigo-500", bg: "bg-indigo-50" },
        { icon: Video, title: "Khám trực tuyến", desc: "Tư vấn sức khỏe từ xa với bác sĩ chuyên khoa qua video call chất lượng cao.", color: "text-purple-500", bg: "bg-purple-50" },
        { icon: CreditCard, title: "Thanh toán 1 chạm", desc: "Tích hợp thẻ ngân hàng, ví điện tử giúp thanh toán viện phí tức thì.", color: "text-emerald-500", bg: "bg-emerald-50" },
        { icon: Clock, title: "Nhắc nhở tự động", desc: "Không bao giờ quên lịch uống thuốc hay lịch tái khám với trợ lý AI.", color: "text-rose-500", bg: "bg-rose-50" },
        { icon: ShieldCheck, title: "Bảo mật tuyệt đối", desc: "Dữ liệu y tế của bạn được mã hóa 2 chiều theo tiêu chuẩn cao nhất.", color: "text-slate-500", bg: "bg-slate-100" },
    ];

    return (
        <div
            className="min-h-screen text-slate-800 selection:bg-blue-100 selection:text-blue-900"
            style={{
                backgroundColor: '#f8fafc',
                backgroundImage: `linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                fontFamily: '"Nunito", system-ui, sans-serif'
            }}
        >
            <style>{customStyles}</style>

            <nav className={`fixed w-full z-50 transition-all duration-300 bg-gradient-to-r from-[#76c2f5] to-[#9f8de9] text-white ${isScrolled ? 'shadow-md py-4' : 'py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
                    {/* Logo & Tên */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <HeartPulse size={28} className="text-white" />
                        <span className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: '"Quicksand", sans-serif' }}>MedSchedule</span>
                    </div>

                    {/* Menu Items */}
                    <div className="hidden lg:flex items-center gap-10">
                        {[
                            { name: 'Trang chủ', id: 'home' },
                            { name: 'Chuyên khoa', id: 'chuyen-khoa' },
                            { name: 'Giải pháp', id: 'giai-phap' },
                            { name: 'Cơ sở', id: 'co-so' },
                        ].map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className="text-sm font-bold text-white/90 hover:text-white transition-colors"
                                onClick={(e) => {
                                    e.preventDefault(); // Ngăn chặn hành vi nhảy trang mặc định
                                    const targetSection = document.getElementById(item.id);
                                    if (targetSection) {
                                        targetSection.scrollIntoView({ behavior: 'smooth' }); // Cuộn mượt mà
                                    }
                                }}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>

                    {/* Nút Đăng nhập */}
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/login')} className="hidden md:block text-sm font-bold text-white hover:text-blue-100 transition-colors">
                            Đăng nhập
                        </button>
                    </div>
                </div>
            </nav>

            <section className="pt-40 pb-20 lg:pt-52 lg:pb-32 text-center" id='home'>
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        NỀN TẢNG Y TẾ SỐ THÔNG MINH
                    </div>

                    <h1 className="text-5xl lg:text-[5rem] font-bold tracking-tight leading-[1.1] mb-8" style={{ fontFamily: '"Quicksand", sans-serif' }}>
                        <span className="wave-text pb-2">Chăm sóc sức khỏe. <br />Đơn giản và Toàn diện.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                        Giải pháp tối ưu giúp bạn kết nối nhanh chóng với mạng lưới chuyên gia y tế, quản lý hồ sơ an toàn và đặt lịch khám chỉ trong vài giây.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                        <button onClick={() => navigate('/login')} className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                            Tạo tài khoản miễn phí
                        </button>

                    </div>

                    <div className="flex items-center justify-center gap-6 text-sm font-bold text-slate-500">
                        <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-blue-600" />Hãy để chúng tôi chăm sóc các bạn</div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white/60 backdrop-blur-md border-y border-slate-200" id="chuyen-khoa">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: '"Quicksand", sans-serif' }}>
                            Chuyên khoa hàng đầu
                        </h2>
                        <p className="text-slate-600 font-medium text-lg">
                            Đội ngũ y bác sĩ, giáo sư giàu kinh nghiệm sẵn sàng đồng hành cùng sức khỏe của bạn. Hãy chọn thẻ để xem chi tiết.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {departmentsData.map((dept, idx) => (
                            <DepartmentCard key={idx} {...dept} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-transparent" id="giai-phap">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: '"Quicksand", sans-serif' }}>
                            Mọi thứ bạn cần cho sức khỏe
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefitsData.map((benefit, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className={`w-12 h-12 rounded-xl ${benefit.bg} flex items-center justify-center mb-6`}>
                                    <benefit.icon size={24} className={benefit.color} strokeWidth={2.5} />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: '"Quicksand", sans-serif' }}>{benefit.title}</h4>
                                <p className="text-slate-600 font-medium">{benefit.desc}</p>
                                <div className="mt-6 flex items-center text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer">
                                    Chi tiết <ArrowRight size={16} className="ml-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 relative overflow-hidden bg-gradient-to-r from-[#76c2f5] to-[#9f8de9] text-white" id="co-so">
                {/* Decorative blur - Đổi màu sang trắng để tạo hiệu ứng sáng lấp lánh nhẹ nhàng trên nền sáng */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: '"Quicksand", sans-serif' }}>
                            Bắt đầu hành trình <br />sống khỏe ngay hôm nay.
                        </h2>
                        <p className="text-white/90 text-lg font-medium mb-10">
                            Tạo tài khoản để kết nối với các cơ sở y tế tư nhân cao cấp nhất. Mạng lưới MedCare luôn mở cửa chào đón bạn.
                        </p>
                        {/* Đổi màu nút để tương phản tốt hơn trên nền gradient sáng (Dùng nền trắng, chữ xanh/tím) */}
                        <button onClick={() => navigate('/login')} className="w-full sm:w-auto bg-[#2f9ce5] text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-[#2f9ce5]/30 hover:bg-[#2680bc] transition-all flex items-center justify-center gap-2">
                            Tạo tài khoản miễn phí
                        </button>
                    </div>

                    <div className="relative">
                        {/* Đổi viền bản đồ sang trắng mờ thay vì đen (slate-700) như trước */}
                        <div className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/40 h-[400px] w-full bg-white/20">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.5713876762425!2d105.78160337471394!3d21.009811488430206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acab11ec72b9%3A0x4a34e18cc7b3b035!2zUC4gxJDhu5cgxJDhu6ljIEThu6VjLCBN4buFIFRyw6wsIFThu6sgTGnDqm0sIEjDoCBO4buZaSwgVmlldG5hbQ!5e0!3m2!1sen!2s!4v1774257793020!5m2!1sen!2s"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Bản đồ bệnh viện"
                            ></iframe>
                        </div>

                        <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 p-5 rounded-2xl shadow-xl flex items-center gap-4 border border-slate-100">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Trạng thái cơ sở</p>
                                <p className="font-bold">Đang hoạt động 24/7</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <HeartPulse size={24} className="text-blue-600" />
                        <span className="text-xl font-bold text-slate-900" style={{ fontFamily: '"Quicksand", sans-serif' }}>MedSchedule</span>
                    </div>
                    <div className="flex gap-8 text-sm font-bold text-slate-600">
                        <a href="#home" className="hover:text-blue-600">Trang chủ</a>
                        <button 
                            onClick={() => setActiveModal('terms')}
                            className="hover:text-blue-600 transition-colors"
                        >
                            Điều khoản
                        </button>
                        <button 
                            onClick={() => setActiveModal('privacy')}
                            className="hover:text-blue-600 transition-colors"
                        >
                            Bảo mật
                        </button>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">
                        <a
                            href="mailto:medschedule2026@gmail.com?subject=Hỗ trợ khôi phục tài khoản&body=Chào admin,"
                            className="hover:underline"
                        >
                            medschedule2026@gmail.com
                        </a>
                    </p>
                </div>
            </footer>

            {/* Modals */}
            <InfoModal
                isOpen={activeModal === 'terms'}
                onClose={() => setActiveModal(null)}
                title="Điều khoản sử dụng"
                icon={PlusSquare}
                content={
                    <>
                        <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                            <h4 className="font-extrabold text-[#2f9ce5] mb-2 flex items-center gap-2">
                                <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs shadow-sm">1</span>
                                Chấp nhận điều khoản
                            </h4>
                            <p className="text-slate-600 pl-8">Bằng việc truy cập và sử dụng dịch vụ MedSchedule, bạn mặc định đồng ý tuân thủ toàn bộ các điều khoản và điều kiện được nêu tại văn bản này.</p>
                        </div>
                        <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-100/50">
                            <h4 className="font-extrabold text-[#9181de] mb-2 flex items-center gap-2">
                                <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs shadow-sm">2</span>
                                Phạm vi dịch vụ
                            </h4>
                            <p className="text-slate-600 pl-8">MedSchedule là nền tảng trung gian kết nối và đặt lịch. Chúng tôi không thực hiện các hoạt động chuyên môn y tế trực tiếp tại nền tảng này.</p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/50">
                            <h4 className="font-extrabold text-slate-700 mb-2 flex items-center gap-2">
                                <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs shadow-sm">3</span>
                                Bảo mật & Trách nhiệm
                            </h4>
                            <p className="text-slate-600 pl-8">Bạn có trách nhiệm bảo mật thông tin tài khoản cá nhân. Mọi hoạt động phát sinh từ tài khoản của bạn sẽ được coi là do chính bạn thực hiện.</p>
                        </div>
                    </>
                }
            />

            <InfoModal
                isOpen={activeModal === 'privacy'}
                onClose={() => setActiveModal(null)}
                title="Chính sách bảo mật"
                icon={ShieldCheck}
                content={
                    <>
                        <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                            <h4 className="font-extrabold text-emerald-600 mb-2 flex items-center gap-2">
                                <ShieldCheck size={20} />
                                Bảo vệ dữ liệu cá nhân
                            </h4>
                            <p className="text-slate-600">Chúng tôi cam kết bảo vệ thông tin cá nhân và dữ liệu y tế của bạn với tiêu chuẩn mã hóa cao nhất hiện nay (AES-256).</p>
                        </div>
                        <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                            <h4 className="font-extrabold text-blue-600 mb-2 flex items-center gap-2">
                                <Activity size={20} />
                                Mục đích thu thập
                            </h4>
                            <p className="text-slate-600">Thông tin được thu thập chỉ nhằm mục đích xác thực danh tính khi đặt lịch và cung cấp cho bác sĩ hồ sơ cần thiết trước khi thăm khám.</p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/50">
                            <h4 className="font-extrabold text-slate-700 mb-2 flex items-center gap-2">
                                <Video size={20} />
                                Quyền riêng tư y tế
                            </h4>
                            <p className="text-slate-600">Dữ liệu bệnh án của bạn sẽ không bao giờ được chia sẻ cho bên thứ ba vì mục đích thương mại nếu không được sự đồng ý bằng văn bản của chính bạn.</p>
                        </div>
                    </>
                }
            />
        </div>
    );
};

export default LandingPage;