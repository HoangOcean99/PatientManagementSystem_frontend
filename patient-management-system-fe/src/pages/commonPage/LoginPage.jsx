import React, { useRef, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineUser, AiOutlineLock, AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { HiArrowRight, HiOutlineHome } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { loginLocal, loginWithGoogle } from '../../api/authApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const usernameRef = useRef('');
    const passwordRef = useRef('');
    const [isLoadingLogin, setIsLoadingLogin] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const handleLoginGoogle = async () => {
        try {
            await loginWithGoogle();
        } catch (error) {
            setErrorMessage("Đăng nhập Google thất bại");
        }
    };


    const handleLoginLocal = async () => {
        try {
            setIsLoadingLogin(true);
            setErrorMessage('');
            const res = await loginLocal(
                usernameRef.current.value,
                passwordRef.current.value
            )
            switch (res.data.user.role) {
                case 'admin': navigate('/dashboard-admin'); break;
                case 'receptionist': navigate('/dashboard-receptionist'); break;
                case 'doctor': navigate('/dashboard-doctor'); break;
                case 'accountant': navigate('/dashboard-accountant'); break;
                case 'patient': navigate('/dashboard-patient'); break;
            }
            toast.success("Đăng nhập thành công!")
        } catch (err) {
            setErrorMessage('Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại.');
            toast.error("Đăng nhập không thành công!")
        } finally {
            setIsLoadingLogin(false);
        }
    }

    return (
        <div className="mx-auto w-full bg-[#f0f7ff] flex items-center justify-center p-6" style={{ width: '100vw', height: '100vh ' }}>
            {scrollbarStyles}
            <div className="max-w-5xl w-full bg-white rounded-[3rem] shadow-2xl shadow-blue-100/50 overflow-hidden flex flex-col md:flex-row" style={{ height: '100%' }}>

                {/* CỘT TRÁI: HÌNH ẢNH & THÔNG ĐIỆP (Chỉ hiện trên Desktop) */}
                <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-blue-500 to-blue-700 p-12 text-white flex-col justify-between relative overflow-hidden">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-20">
                        <button
                            onClick={() => navigate('/')}
                            className="group flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-white/20 hover:border-white/40 active:scale-95"
                        >
                            <HiOutlineHome size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                            <span>Trang chủ</span>
                        </button>
                    </div>

                    <div className="relative z-10">
                        <h1 className="text-4xl font-black leading-tight mb-6">
                            Chăm sóc sức khỏe cho bản thân và gia đình
                        </h1>
                        <p className="text-blue-100 text-lg">
                            Giải pháp đặt lịch khám nhanh chóng, an toàn và tận tâm dành riêng cho gia đình.
                        </p>
                    </div>

                    <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                        <p className="text-sm italic font-light">
                            "Đảm bảo sức khỏe của mọi người là sứ mệnh của chúng tôi."
                        </p>
                    </div>
                </div>

                {/* CỘT PHẢI: FORM ĐĂNG NHẬP */}
                <div className="w-full md:w-7/12 p-8 lg:p-14 flex flex-col justify-center custom-scrollbar overflow-y-auto">
                    <div className="mb-5 mt-8">
                        <h2 className="text-3xl font-extrabold text-gray-800">Xin chào! 👋</h2>
                        <p className="text-gray-400 mt-2">Vui lòng chọn phương thức đăng nhập phù hợp</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        <div className="group">
                            <button onClick={handleLoginGoogle} className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-100 py-4 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 shadow-sm active:scale-[0.98]">
                                <FcGoogle size={30} />
                                <span className="font-bold text-gray-700 text-lg">Tiếp tục bằng Google</span>
                            </button>
                            <div className="flex items-center gap-2 mt-3 px-1">
                                <span className="flex-1 h-[0px]"></span>
                                <p className="text-[11px] text-blue-400 font-bold uppercase tracking-widest px-2">
                                    Dành cho phụ huynh
                                </p>
                                <span className="flex-1 h-[0px]"></span>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-4 bg-white text-gray-300 font-bold uppercase tracking-tighter">Hoặc đăng nhập tài khoản cho trẻ</span>
                            </div>
                        </div>

                        <form className="space-y-4"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                await handleLoginLocal();
                            }}
                        >
                            {errorMessage && (
                                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl animate-fade-in">
                                    <span className="text-lg">⚠️</span>
                                    <span className="text-xs font-semibold">{errorMessage}</span>
                                </div>
                            )}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-gray-400">
                                    <AiOutlineUser size={22} />
                                </div>
                                <input
                                    ref={usernameRef}
                                    type="text"
                                    placeholder="Tên đăng nhập của trẻ"
                                    onChange={(e) => e.target.setCustomValidity("")}
                                    required
                                    onInvalid={(e) => e.target.setCustomValidity("Vui lòng nhập tên đăng nhập cho trẻ")}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm"
                                />

                            </div>

                            <div className="space-y-2">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-gray-400">
                                        <AiOutlineLock size={22} />
                                    </div>

                                    <input
                                        ref={passwordRef}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Mật khẩu hồ sơ"
                                        className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm"
                                        onInvalid={(e) => e.target.setCustomValidity("Vui lòng nhập mật khẩu")}
                                        onChange={(e) => e.target.setCustomValidity("")}
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors"
                                    >
                                        {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
                                    </button>
                                </div>

                                <div className="flex justify-end px-1">
                                    <button
                                        type="button"
                                        className="text-[11px] font-bold text-gray-400 hover:text-blue-500 transition-colors uppercase tracking-tighter"
                                    >
                                        Quên mật khẩu?
                                    </button>
                                </div>
                            </div>
                            <button className="w-full bg-gray-800 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-xl active:scale-[0.98] text-sm">
                                {isLoadingLogin ? <LoadingSpinner size="18px" /> : <span>Đăng nhập vào tài khoản trẻ</span>}
                            </button>
                        </form>
                    </div>

                    <div className="pt-8 border-t border-gray-50">
                        <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-50/40 rounded-3xl p-5 border border-blue-100/30">
                            <div className="mb-4 sm:mb-0 text-center sm:text-left">
                                <p className="text-gray-500 text-xs font-semibold">Chưa có tài khoản cho trẻ?</p>
                                <p className="text-blue-600 text-[10px] uppercase font-bold tracking-tighter">Bắt đầu chỉ trong 2 phút</p>
                            </div>
                            <button onClick={() => navigate('/register-kid')} className="group flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200 shadow-md shadow-blue-100">
                                Tạo tài khoản mới cho trẻ
                                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                    <div className="relative z-20 md:hidden mx-auto mt-5">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 text-white group flex items-center gap-2 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-white/20 hover:border-white/40 active:scale-95"
                        >
                            <HiOutlineHome size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                            <span>Trang chủ</span>
                        </button>
                    </div>
                </div>

            </div>
        </div >
    );
};

export default LoginPage;