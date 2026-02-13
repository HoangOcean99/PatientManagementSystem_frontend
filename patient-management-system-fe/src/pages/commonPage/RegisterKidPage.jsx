import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { AiOutlineUser, AiOutlineLock, AiOutlineMail, AiOutlineClose, AiOutlineCheckCircle } from 'react-icons/ai';
import { HiOutlineArrowNarrowLeft, HiOutlineShieldCheck, HiOutlineUsers } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { requestRegister, verifyAndCreate } from '../../api/authApi';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';
import { validatePassword, validateUsername } from '../../helpers/validationUtils';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const RegisterKidPage = () => {
    const navigate = useNavigate();
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const relationshipRef = useRef(null);
    const emailParentRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingOtp, setIsLoadingOtp] = useState(false);

    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [idParent, setIdParent] = useState('');

    const [timeLeft, setTimeLeft] = useState(300);
    const [canResend, setCanResend] = useState(false);


    const [isvalidationUsername, setValidationUsername] = useState(true);
    const [isvalidationPassword, setValidationPassword] = useState(true);
    const [isvalidationEmailParent, setValidationEmailParent] = useState(true);

    useEffect(() => {
        if (!showOtpModal) return;

        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, showOtpModal]);


    const handleRequestRegister = async () => {
        setIsLoading(true);
        // Check username
        const testUsername = validateUsername(usernameRef.current.value);
        if (testUsername) {
            setErrorMessage(testUsername);
            setValidationUsername(false);
            toast.error("Đăng kí thất bại!");
            setIsLoading(false);
            return;
        }
        setValidationUsername(true);


        // Check password and confirm password
        if (passwordRef.current.value !== confirmPasswordRef.current.value) {
            setErrorMessage('Hai mật khẩu không trùng nhau!');
            setValidationPassword(false);
            toast.error("Đăng kí thất bại!");
            setIsLoading(false);
            return;
        }

        // Validation password
        const testPassword = validatePassword(passwordRef.current.value);
        if (testPassword) {
            setErrorMessage(testPassword);
            setValidationPassword(false);
            toast.error("Đăng kí thất bại!");
            setIsLoading(false);
            return;
        }
        setValidationPassword(true);
        setValidationEmailParent(true);
        setErrorMessage('');
        await sendRequestRegister();
    };

    const sendRequestRegister = async () => {
        try {
            const res = await requestRegister(
                usernameRef.current.value,
                emailParentRef.current.value
            );

            setIdParent(res.data.data.idParent);
            setShowOtpModal(true);

        } catch (error) {
            const errorState = error.response?.status;
            if (errorState === 409) {
                setErrorMessage("Username đã tồn tại!");
                setValidationUsername(false);
            } else if (errorState === 404) {
                setErrorMessage("Email của người giám hộ không tồn tại!");
                setValidationEmailParent(false);
            } else {
                setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại.");
            }

            setShowOtpModal(false);
            setOtp(['', '', '', '', '', '']);
            toast.error("Đăng kí thất bại!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value.slice(-1);
        setOtp(newOtp);

        if (element.value && element.nextSibling) {
            element.nextSibling.focus();
        }
    };
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            e.preventDefault();
            e.target.previousSibling.focus();
        }
    };
    const handleVerifyAndCreate = async () => {
        try {
            setIsLoadingOtp(true);
            const mainOtp = otp.join('');
            if (mainOtp.length < 6) {
                toast.error("Vui lòng nhập đủ 6 số");
                setIsLoadingOtp(false);
                return;
            }
            const res = await verifyAndCreate(
                usernameRef.current.value,
                passwordRef.current.value,
                emailParentRef.current.value,
                relationshipRef.current.value,
                idParent,
                mainOtp
            )
            navigate('/login');
            toast.success('Đăng kí thành công')
        } catch (error) {
            toast.error(error.response?.data.message);
        } finally {
            setIsLoadingOtp(false);
        }
    }

    return (
        <div className="min-h-screen w-full bg-[#f0f7ff] flex items-center justify-center p-4 lg:p-8" style={{ width: '100vw', height: '100vh' }}>
            {scrollbarStyles}
            <div className="max-w-5xl w-full bg-white rounded-[3rem] shadow-2xl shadow-blue-100/50 overflow-hidden flex flex-col md:row md:flex-row" style={{ height: '100%' }}>

                {/* CỘT TRÁI */}
                <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-white flex-col justify-between relative">
                    <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <button onClick={() => navigate('/login')} className="mb-10 group flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-white/20 hover:border-white/40 active:scale-95">
                            <HiOutlineArrowNarrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            <span>Quay lại đăng nhập</span>
                        </button>
                        <h1 className="text-4xl font-black leading-tight mb-6">Tạo hồ sơ <br /> sức khỏe cho bé</h1>
                        <p className="text-blue-100 leading-relaxed italic text-sm">"Sức khỏe của trẻ em là hạnh phúc của mọi nhà"</p>
                    </div>
                    <div className="relative z-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                        <div className="flex items-center gap-3">
                            <HiOutlineShieldCheck className="text-2xl text-blue-200" />
                            <p className="text-[11px] font-medium leading-relaxed">Chúng tôi cam kết bảo mật thông tin gia đình bạn theo tiêu chuẩn an toàn dữ liệu y tế quốc tế.</p>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI */}
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        await handleRequestRegister();
                    }}
                    className="w-full md:w-3/5 p-8 lg:p-12 overflow-y-auto max-h-screen md:max-h-[850px] custom-scrollbar"
                >
                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-gray-800">Đăng ký tài khoản</h2>
                        <p className="text-gray-400 text-sm mt-1">Hoàn thành các bước sau để tạo mã định danh cho bé</p>
                    </div>
                    {errorMessage && (
                        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl animate-fade-in mb-5">
                            <span className="text-lg">⚠️</span>
                            <span className="text-xs font-semibold">{errorMessage}</span>
                        </div>
                    )}
                    <div className="space-y-10">
                        <section>
                            <h3 className="text-blue-600 font-black text-[11px] uppercase tracking-[0.2em] mb-5 flex items-center gap-3">
                                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">01</span>
                                Thiết lập tài khoản
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <div className="relative group">
                                        <AiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                        <input
                                            ref={usernameRef}
                                            type="text"
                                            placeholder="Tên đăng nhập của trẻ"
                                            className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white  outline-none transition-all ${!isvalidationUsername ? 'border-red-500' : 'focus:border-blue-400'}`}
                                            onInvalid={(e) => e.target.setCustomValidity("Vui lòng điền tên đăng nhập")}
                                            onChange={(e) => e.target.setCustomValidity("")}
                                            required
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2 ml-2 italic">* Tên dùng để đăng nhập vào hồ sơ riêng của bé</p>
                                </div>
                                <div className="relative group">
                                    <AiOutlineLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        ref={passwordRef}
                                        type="password"
                                        placeholder="Mật khẩu"
                                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white  outline-none transition-all ${!isvalidationPassword ? 'border-red-500' : 'focus:border-blue-400'}`}
                                        onInvalid={(e) => e.target.setCustomValidity("Vui lòng điền mật khẩu")}
                                        onChange={(e) => e.target.setCustomValidity("")}
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <AiOutlineLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        ref={confirmPasswordRef}
                                        type="password"
                                        placeholder="Xác nhận mật khẩu"
                                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white  outline-none transition-all ${!isvalidationPassword ? 'border-red-500' : 'focus:border-blue-400'}`}
                                        onInvalid={(e) => e.target.setCustomValidity("Vui lòng điền để xác nhận mật khẩu")}
                                        onChange={(e) => e.target.setCustomValidity("")}
                                        required
                                    />
                                </div>
                            </div>
                        </section>


                        <section>
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-blue-600 font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3">
                                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">02</span>
                                    Người giám hộ
                                </h3>
                            </div>

                            <div className="space-y-6">
                                {/* Người giám hộ chính */}
                                <div className="p-6 rounded-[2rem] border border-blue-100/50 space-y-4">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Người giám hộ chính</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative group md:col-span-3">
                                            <AiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" size={18} />
                                            <input
                                                ref={emailParentRef}
                                                type="email"
                                                placeholder="Email nhận mã OTP xác thực"
                                                className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white  outline-none transition-all ${!isvalidationEmailParent ? 'border-red-500' : 'focus:border-blue-400'}`}
                                                onInvalid={(e) => e.target.setCustomValidity("Vui lòng điền email của người giám hộ")}
                                                onChange={(e) => e.target.setCustomValidity("")}
                                                required
                                            />
                                        </div>
                                        <div className="relative group">
                                            <HiOutlineUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" size={18} />
                                            <select
                                                ref={relationshipRef}
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all appearance-none"
                                                required
                                                onInvalid={(e) =>
                                                    e.target.setCustomValidity("Vui lòng chọn mối quan hệ với người giám hộ")
                                                }
                                                onChange={(e) => e.target.setCustomValidity("")}
                                            >
                                                <option value="" disabled hidden>Mối quan hệ</option>
                                                <option value="father">Cha</option>
                                                <option value="mother">Mẹ</option>
                                                <option value="other">Người thân khác</option>
                                            </select>
                                        </div>

                                    </div>
                                </div>


                                <label className="flex items-center gap-3 p-5 bg-blue-600 rounded-2xl cursor-pointer group hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-none text-blue-600 focus:ring-offset-0 transition-all cursor-pointer"
                                        onInvalid={(e) => e.target.setCustomValidity("Vui lòng xác nhận bạn là người giám hộ hợp pháp")}
                                        onChange={(e) => e.target.setCustomValidity("")}
                                        required
                                    />
                                    <span className="text-xs font-bold text-white">Tôi cam đoan là người giám hộ hợp pháp và chịu trách nhiệm về thông tin này.</span>
                                </label>
                            </div>
                        </section>

                        <div className="pt-4">
                            <button type='submit' className="w-full bg-gray-800 text-white font-black py-5 rounded-2xl hover:bg-black transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 group">
                                {isLoading ? <LoadingSpinner size='20px' /> :
                                    <div>Gửi mã OTP xác nhận</div>
                                }
                            </button>
                        </div>
                        <div className="z-20 md:hidden mx-auto mt-5">
                            <button
                                onClick={() => navigate('/login')}
                                className=" mx-auto bg-blue-600 text-white group flex items-center gap-2 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-white/20 hover:border-white/40 active:scale-95"
                            >
                                <HiOutlineArrowNarrowLeft size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                                <span>Quay lại đăng nhập</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {showOtpModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    setShowOtpModal(false);
                                    setOtp(['', '', '', '', '', '']);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <AiOutlineClose size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <AiOutlineMail size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-800">Xác thực OTP</h3>
                            <p className="text-gray-500 text-sm mt-2">
                                Mã xác thực đã được gửi đến <br />
                                <span className="font-bold text-blue-600">{emailParentRef.current?.value}</span>
                            </p>
                        </div>

                        <div className="flex gap-2 justify-center mb-8">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    inputMode="numeric"
                                    className="w-12 h-14 border-2 border-gray-100 rounded-xl text-center text-xl font-bold focus:border-blue-500 focus:bg-blue-50 outline-none transition-all"
                                    value={data}
                                    onChange={e => handleOtpChange(e.target, index)}
                                    onKeyDown={e => handleKeyDown(e, index)}
                                    onFocus={e => e.target.select()}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleVerifyAndCreate}
                            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                        >
                            {isLoadingOtp ? <LoadingSpinner size='20px' /> :
                                <span>Xác nhận đăng ký</span>
                            }
                        </button>

                        <button
                            disabled={!canResend}
                            onClick={() => {
                                if (!canResend) return;
                                sendRequestRegister();
                                setTimeLeft(300);
                                setCanResend(false);
                            }}
                            className={`w-full mt-4 text-sm font-bold transition-colors
                                ${canResend ? "text-blue-600" : "text-gray-400 cursor-not-allowed"}
                            `}
                        >
                            {canResend ? "Gửi lại mã" : `Gửi lại mã (${timeLeft}s)`}
                        </button>

                    </div>
                </div>
            )
            }
        </div >
    );
};

export default RegisterKidPage;