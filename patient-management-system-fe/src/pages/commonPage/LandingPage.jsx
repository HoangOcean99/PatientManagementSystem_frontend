import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    HeartPulse, Play, CheckCircle2, ArrowRight,
    CalendarDays, Activity, Video, CreditCard, Clock, ShieldCheck,
    Zap, Baby, Heart, Stethoscope, Dna, BrainCircuit, Mic, PlusSquare
} from 'lucide-react';

// === CSS TÙY CHỈNH: IMPORT FONTS, SÓNG NƯỚC & LẬT THẺ 3D ===
const customStyles = `
  /* IMPORT FONT NHẸ NHÀNG MỀM MẠI */
  @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Quicksand:wght@400;500;600;700&display=swap');

  @keyframes wave {
    0% { background-position: -800px; }
    100% { background-position: 800px; }
  }
  .wave-text {
    background-image: linear-gradient(
      -45deg,
      #E0F2FE 0%, 
      #C4B5FD 25%, 
      #F3F4F6 50%, 
      #E0F2FE 75%, 
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

// === COMPONENT: THẺ CHUYÊN KHOA LẬT ===
const DepartmentCard = ({ icon: Icon, name, shortDesc, professor, professorImage, services }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className="relative h-96 group cursor-pointer perspective-1000"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={`absolute inset-0 transition-transform duration-700 transform-style-3d shadow-sm hover:shadow-xl rounded-[1.5rem] ${isFlipped ? 'rotate-y-180' : ''}`}>

                {/* MẶT TRƯỚC */}
                <div className="absolute inset-0 p-8 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-[1.5rem] backface-hidden">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                        <Icon size={32} className="text-blue-500" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-3 text-center" style={{ fontFamily: '"Quicksand", sans-serif' }}>
                        {name}
                    </h4>
                    <p className="text-slate-500 font-medium text-center leading-relaxed">
                        {shortDesc}
                    </p>
                    <button className="absolute bottom-6 flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700">
                        Xem chi tiết <PlusSquare size={16} />
                    </button>
                </div>

                {/* MẶT SAU */}
                <div className="absolute inset-0 p-8 flex flex-col justify-start bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[1.5rem] backface-hidden rotate-y-180 text-white overflow-y-auto">
                    <button
                        className="absolute top-6 right-6 flex items-center gap-1 text-xs font-bold text-blue-100 hover:text-white bg-white/10 px-3 py-1.5 rounded-full"
                        onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                    >
                        Đóng <ArrowRight size={14} />
                    </button>

                    <h4 className="text-xl font-bold mb-8 text-center mt-2 border-b border-white/20 pb-4" style={{ fontFamily: '"Quicksand", sans-serif' }}>
                        {name}
                    </h4>

                    {/* Giáo sư */}
                    <div className="flex items-center gap-4 mb-6">
                        <img src={professorImage} alt={professor} className="w-14 h-14 rounded-full border-2 border-white/40 object-cover" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Trưởng khoa</p>
                            <p className="text-lg font-bold" style={{ fontFamily: '"Quicksand", sans-serif' }}>{professor}</p>
                        </div>
                    </div>

                    {/* Dịch vụ */}
                    <div className="flex-1">
                        <h5 className="text-sm font-bold mb-3 flex items-center gap-2 text-blue-100">
                            <Stethoscope size={16} /> Dịch vụ tiêu biểu:
                        </h5>
                        <ul className="space-y-2 text-sm font-medium text-white/90 list-disc pl-5">
                            {services.map((service, idx) => <li key={idx}>{service}</li>)}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

// === COMPONENT CHÍNH ===
const LandingPage = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const departmentsData = [
        {
            icon: HeartPulse, name: "Khoa Cấp cứu",
            shortDesc: "Chăm sóc cấp cứu 24/7 với hệ thống xe cứu thương hiện đại.",
            professor: "GS. Trần Văn A", professorImage: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            services: ["Cấp cứu chấn thương", "Đột quỵ & Tim mạch", "Hồi sức tích cực"]
        },
        {
            icon: Baby, name: "Khoa Nhi",
            shortDesc: "Chăm sóc toàn diện cho trẻ em từ sơ sinh đến vị thành niên.",
            professor: "GS. Lê Thị B", professorImage: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
            services: ["Khám tổng quát", "Tiêm chủng", "Tư vấn dinh dưỡng"]
        },
        {
            icon: Heart, name: "Khoa Tim mạch",
            shortDesc: "Chẩn đoán và điều trị chuyên sâu các bệnh lý về tim mạch.",
            professor: "GS. Hoàng Văn D", professorImage: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
            services: ["Điện tâm đồ", "Siêu âm tim 4D", "Can thiệp mạch vành"]
        },
        {
            icon: Dna, name: "Khoa Thần kinh",
            shortDesc: "Tầm soát và điều trị các bệnh lý hệ thần kinh trung ương.",
            professor: "GS. Đặng Văn E", professorImage: "https://i.pravatar.cc/150?u=a04258114e29026702d",
            services: ["Chụp MRI 3.0 Tesla", "Đo điện não đồ", "Vật lý trị liệu"]
        },
        {
            icon: BrainCircuit, name: "Khoa Tâm thần",
            shortDesc: "Hỗ trợ chăm sóc sức khỏe tinh thần và tư vấn tâm lý.",
            professor: "GS. Bùi Văn F", professorImage: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
            services: ["Tư vấn tâm lý", "Trị liệu trầm cảm", "Rối loạn giấc ngủ"]
        },
        {
            icon: PlusSquare, name: "Sản & Phụ khoa",
            shortDesc: "Chăm sóc thai kỳ và tầm soát sức khỏe sinh sản phụ nữ.",
            professor: "GS. Phạm Văn C", professorImage: "https://i.pravatar.cc/150?u=a042581f4e29026024c",
            services: ["Khám thai định kỳ", "Tầm soát ung thư cổ tử cung", "Sinh mổ trọn gói"]
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
            // Áp dụng font Nunito cho toàn bộ Body và giữ Nền Caro lưới tinh tế
            style={{
                backgroundColor: '#f8fafc',
                backgroundImage: `linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                fontFamily: '"Nunito", system-ui, sans-serif'
            }}
        >
            <style>{customStyles}</style>

            {/* Navbar */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <HeartPulse size={28} className="text-blue-600" />
                        <span className="text-2xl font-bold tracking-tight text-slate-900" style={{ fontFamily: '"Quicksand", sans-serif' }}>MedCare.</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-10">
                        {['Giải pháp', 'Cơ sở', 'Bảng giá', 'Dành cho Bác sĩ'].map((item) => (
                            <a key={item} href="#" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">{item}</a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/login')} className="hidden md:block text-sm font-bold text-slate-900 hover:text-blue-600">Đăng nhập</button>
                        <button className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-blue-600 transition-all">
                            Bắt đầu
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 lg:pt-52 lg:pb-32 text-center">
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
                        <button onClick={() => navigate('/register')} className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                            Tạo tài khoản miễn phí
                        </button>
                        <button className="w-full sm:w-auto bg-white text-slate-800 border-2 border-slate-200 px-8 py-4 rounded-xl text-base font-bold hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                            Xem cách hoạt động <ArrowRight size={18} />
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-6 text-sm font-bold text-slate-500">
                        <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-blue-600" /> Không cần thẻ tín dụng</div>
                        <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-blue-600" /> Bảo mật dữ liệu HIPAA</div>
                    </div>
                </div>
            </section>

            {/* Departments Section (Flip Cards) */}
            <section className="py-24 bg-white/60 backdrop-blur-md border-y border-slate-200">
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

            {/* Benefits Section */}
            <section className="py-24 bg-transparent">
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

            {/* Google Map & Final CTA */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                {/* Decorative blur */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: '"Quicksand", sans-serif' }}>
                            Bắt đầu hành trình <br />sống khỏe ngay hôm nay.
                        </h2>
                        <p className="text-slate-300 text-lg font-medium mb-10">
                            Tạo tài khoản để kết nối với các cơ sở y tế tư nhân cao cấp nhất. Mạng lưới MedCare luôn mở cửa chào đón bạn.
                        </p>
                        <button onClick={() => navigate('/register')} className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30">
                            Tạo tài khoản miễn phí
                        </button>
                    </div>

                    <div className="relative">
                        <div className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-slate-700 h-[400px] w-full bg-slate-800">
                            {/* Google Map Iframe thực tế - Đang trỏ về khu vực BV Vinmec HN làm ví dụ */}
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.8143924376517!2d105.8647047116747!3d20.985542088827725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac05eb82e569%3A0xc6226da93c2bf962!2sVinmec%20International%20Hospital!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
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
                        <span className="text-xl font-bold text-slate-900" style={{ fontFamily: '"Quicksand", sans-serif' }}>MedCare.</span>
                    </div>
                    <div className="flex gap-8 text-sm font-bold text-slate-600">
                        <a href="#" className="hover:text-blue-600">Về chúng tôi</a>
                        <a href="#" className="hover:text-blue-600">Điều khoản</a>
                        <a href="#" className="hover:text-blue-600">Bảo mật</a>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">© 2026 MedCare Team.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;