import React, { useRef, useState } from 'react';
import { AiOutlineMail, AiOutlineArrowLeft, AiOutlineUser, AiOutlineCheckCircle, AiOutlineLock } from 'react-icons/ai';
import { HiOutlineHome, HiOutlineCheckCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import scrollbarStyles from '../../helpers/styleCss/ScrollbarStyles';
import toast from 'react-hot-toast';
import OtpPopUp from '../../components/common/OtpPopUp';
import { requestForgetPassword, resetPassword, verityResetOtp } from '../../api/authApi';
import { validatePassword } from '../../helpers/validationUtils';


const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const usernameRef = useRef('');
    const newPasswordRef = useRef('');
    const confirmPasswordRef = useRef('');
    const [isLoading, setIsLoading] = useState(false);
    const [tokenReset, setTokenReset] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isShowOtpPopUp, setIsShowOtpPopUp] = useState(false);
    const [emailGuadiar, setEmailGuadiar] = useState(null);
    const [isvalidationPassword, setValidationPassword] = useState(true);
    const [isvalidationUsername, setValidationUsername] = useState(true);



    const handleRequestForgetPassword = async (e) => {
        e.preventDefault();
        try {
            setValidationUsername(true);
            setIsLoading(true);
            const res = await requestForgetPassword(usernameRef.current.value);
            setEmailGuadiar(res.data.data.email);
            setIsShowOtpPopUp(true);
            setErrorMessage(null);
        } catch (error) {
            setValidationUsername(false);
            setErrorMessage('Không tìm thấy thông tin của tài khoản này.');
            toast.error("Gửi yêu cầu thất bại!");
            setIsShowOtpPopUp(false);
            setEmailGuadiar(null);
        } finally {
            setIsLoading(false);
        }
    }

    const handleVerifyResetOtp = async (otp) => {
        try {
            const mainOtp = otp.join('');
            if (mainOtp.length < 6) {
                toast.error("Vui lòng nhập đủ 6 số");
                return;
            }
            if (!emailGuadiar) {
                toast.error("Không tìm thấy email của người giám hộ");
                return;
            }
            const res = await verityResetOtp(
                usernameRef.current.value,
                emailGuadiar,
                mainOtp
            )
            setTokenReset(res.data.data.resetToken);
            setIsShowOtpPopUp(false);
            toast.success('Xác nhận OTP thành công')
        } catch (error) {
            toast.error('Xác nhận OTP thất bại');
        }
    }
    const handleResetPassword = async () => {
        try {
            setIsLoading(true);
            if (newPasswordRef.current.value !== confirmPasswordRef.current.value) {
                setErrorMessage('Hai mật khẩu không trùng nhau!');
                setValidationPassword(false);
                toast.error("Thay đổi thất bại!");
                setIsLoading(false);
                return;
            }

            const testPassword = validatePassword(newPasswordRef.current.value);
            if (testPassword) {
                setErrorMessage(testPassword);
                setValidationPassword(false);
                toast.error("Thay đổi thất bại!");
                setIsLoading(false);
                return;
            }
            setValidationPassword(true);
            setErrorMessage(null);
            const res = await resetPassword(
                tokenReset,
                newPasswordRef.current.value
            )
            setTokenReset(null);
            toast.success('Thay đổi mật khẩu thành công!');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data.message);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="mx-auto w-full bg-[#f0f7ff] flex items-center justify-center p-6" style={{ width: '100vw', height: '100vh' }}>
            {scrollbarStyles}
            <div className="max-w-5xl w-full bg-white rounded-[3rem] shadow-2xl shadow-blue-100/50 overflow-hidden flex flex-col md:flex-row" style={{ height: '100%' }}>

                {/* CỘT TRÁI: GIỮ NGUYÊN STYLE ĐỂ ĐỒNG BỘ */}
                <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-white flex-col justify-between relative overflow-hidden">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-20">
                        <button
                            onClick={() => navigate('/login')}
                            className="group flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-white/20 hover:border-white/40 active:scale-95"
                        >
                            <AiOutlineArrowLeft /> Quay lại đăng nhập
                        </button>
                    </div>

                    <div className="relative z-10">
                        <h1 className="text-4xl font-black leading-tight mb-6">
                            Bảo mật tài khoản của bạn
                        </h1>
                        <p className="text-blue-100 text-lg">
                            Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền truy cập chỉ trong vài bước đơn giản.
                        </p>
                    </div>

                    <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                        <p className="text-sm italic font-light">
                            "Hệ thống bảo mật đa lớp giúp thông tin y tế của gia đình luôn an toàn."
                        </p>
                    </div>
                </div>

                {/* CỘT PHẢI: FORM QUÊN MẬT KHẨU */}
                <div className="w-full md:w-7/12 p-8 lg:p-14 flex flex-col justify-center overflow-y-auto">
                    {!tokenReset ? (
                        <div className="animate-fade-in">
                            <div className="mb-10">
                                <h2 className="text-3xl font-extrabold text-gray-800">Quên mật khẩu? 🔑</h2>
                                <p className="text-gray-400 mt-2">Nhập username đăng ký để nhận hướng dẫn khôi phục mật khẩu</p>
                            </div>

                            <form key={'username-form'} className="space-y-6" onSubmit={handleRequestForgetPassword}>
                                {errorMessage && (
                                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl">
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
                                        placeholder="Nhập tên đăng nhập (username) của bạn"
                                        required
                                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:bg-white  outline-none transition-all ${!isvalidationUsername ? 'border-red-500' : 'focus:border-blue-400'}`}
                                    />
                                </div>

                                <button
                                    disabled={isLoading}
                                    className={`w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.98] text-sm flex items-center justify-center
                                        ${isLoading ? "bg-blue-300 cursor-not-allowed text-white"
                                            : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                                >
                                    {isLoading ? <div className="relative flex-1">
                                        {isLoading && <LoadingSpinner />}
                                    </div> : "Gửi yêu cầu khôi phục"}
                                </button>
                            </form>
                        </div>
                    ) : (
                        < div className="animate-fade-in">
                            <div className="mb-8">
                                <h2 className="text-3xl font-extrabold text-gray-800">Thiết lập mật khẩu 🔑</h2>
                                <p className="text-gray-400 mt-2">Vui lòng nhập mật khẩu mới cho tài khoản của bạn</p>
                            </div>

                            <form key={'password-form'} className="space-y-5" onSubmit={(e) => {
                                e.preventDefault();
                                handleResetPassword();
                            }}
                            >
                                {errorMessage && (
                                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl animate-fade-in mb-5">
                                        <span className="text-lg">⚠️</span>
                                        <span className="text-xs font-semibold">{errorMessage}</span>
                                    </div>
                                )}
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-gray-400">
                                        <AiOutlineLock size={22} />
                                    </div>
                                    <input
                                        ref={newPasswordRef}
                                        type="text"
                                        placeholder="Mật khẩu mới"
                                        required
                                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:bg-white  outline-none transition-all ${!isvalidationPassword ? 'border-red-500' : 'focus:border-blue-400'}`}
                                    />
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-gray-400">
                                        <AiOutlineCheckCircle size={22} />
                                    </div>
                                    <input
                                        ref={confirmPasswordRef}
                                        type="password"
                                        placeholder="Xác nhận mật khẩu mới"
                                        required
                                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:bg-white  outline-none transition-all ${!isvalidationPassword ? 'border-red-500' : 'focus:border-blue-400'}`}
                                    />
                                </div>

                                <button
                                    disabled={isLoading}
                                    className={`w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.98] text-sm flex items-center justify-center
                                        ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                                >
                                    {isLoading ? <div className="relative flex-1">
                                        {isLoading && <LoadingSpinner />}
                                    </div> : "Xác nhận đổi mật khẩu"}
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="mt-12 pt-8 border-t border-gray-50 text-center">
                        <p className="text-gray-400 text-xs font-semibold">
                            Bạn gặp khó khăn khi khôi phục tài khoản?
                            <br />
                            <span className="text-blue-600 cursor-pointer hover:underline">Liên hệ bộ phận hỗ trợ</span>
                        </p>
                    </div>
                </div>
            </div>
            {
                isShowOtpPopUp && <OtpPopUp
                    emailParentRef={emailGuadiar}
                    setShowOtpModal={setIsShowOtpPopUp}
                    handleVerifyAndCreate={handleVerifyResetOtp}
                    sendRequestRegister={handleRequestForgetPassword}
                    showOtpModal={isShowOtpPopUp} />
            }
        </div >
    );
};

export default ForgotPasswordPage;