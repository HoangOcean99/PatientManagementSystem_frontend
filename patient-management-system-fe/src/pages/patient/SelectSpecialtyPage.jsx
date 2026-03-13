import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllDepartments } from "../../api/departmentsApi";
import { supabase } from "../../../supabaseClient";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getListAppointments } from "../../api/scheduleApi";
import { getListAppointmentsByStatus } from "../../api/appointmentApi";
import { useSearchParams } from "react-router-dom";

const SelectSpecialtyPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [appointments, setAppointments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [latestAppointment, setLatestAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointmentsByStatus, setAppointmentsByStatus] = useState([]);

  console.log(appointmentsByStatus);
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const res = await getListAppointments({ activeTab });
          const allApps = res.data?.data || [];

          // Sort to find the latest
          const sorted = [...allApps].sort((a, b) => {
            const dateA = new Date(`${a.appointment_date}T${a.start_time || '00:00'}`);
            const dateB = new Date(`${b.appointment_date}T${b.start_time || '00:00'}`);
            return dateB - dateA;
          });

          setAppointments(allApps);
          if (sorted.length > 0) {
            setLatestAppointment(sorted[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchDepartments = async () => {
      try {
        const res = await getAllDepartments();
        setDepartments(res.data);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      }
    };
    fetchAppointments();
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchAppointmentsByStatus = async () => {
      try {

        const res = await getListAppointmentsByStatus(activeTab);
        setAppointmentsByStatus(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Failed to fetch appointments by status:", err);
      }
    };

    if (activeTab) {
      fetchAppointmentsByStatus();
    }
  }, [activeTab]);

  const filteredDepartments = departments.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const MotionDiv = motion.div;

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><LoadingSpinner /></div>;

  const getDepartmentUI = (name) => {
    const lowerName = name?.toLowerCase() || "";
    if (lowerName.includes("sản") || lowerName.includes("phụ")) return { icon: "fa-solid fa-person-pregnant", color: "bg-pink-50 text-pink-500" };
    if (lowerName.includes("nhi")) return { icon: "fa-solid fa-baby", color: "bg-yellow-50 text-yellow-500" };
    if (lowerName.includes("răng") || lowerName.includes("hàm")) return { icon: "fa-solid fa-tooth", color: "bg-teal-50 text-teal-500" };
    if (lowerName.includes("da liễu")) return { icon: "fa-solid fa-spa", color: "bg-purple-50 text-purple-500" };
    if (lowerName.includes("mắt")) return { icon: "fa-solid fa-eye", color: "bg-emerald-50 text-emerald-500" };
    if (lowerName.includes("tai mũi họng")) return { icon: "fa-solid fa-ear-listen", color: "bg-orange-50 text-orange-500" };
    if (lowerName.includes("nội") || lowerName.includes("tổng quát") || lowerName.includes("general")) return { icon: "fa-solid fa-stethoscope", color: "bg-sky-50 text-sky-500" };

    // Mặc định nếu không khớp từ khóa nào
    return { icon: "fa-solid fa-user-doctor", color: "bg-gray-50 text-gray-500" };
  };
  return (
    <div className="w-full h-full overflow-y-auto bg-[#F8F9FB] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chọn Khoa</h1>
            <p className="text-gray-500 mt-1">Vui lòng chọn khoa bạn muốn đăng ký khám.</p>
          </div>
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-sm"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </MotionDiv>

        {/* //Quick Info: Latest Appointment */}
        {latestAppointment && (
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10 p-6 bg-white rounded-[2.5rem] border border-sky-100 shadow-[0_15px_50px_-15px_rgba(14,165,233,0.1)] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group"
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform duration-500" />

            <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-sky-500/30">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>

            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Last Appointment</p>
                <p className="text-gray-900 font-bold">{new Date(latestAppointment.appointment_date).toLocaleDateString('vi-VN')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Doctor</p>
                <p className="text-gray-900 font-bold">Dr. {latestAppointment.Doctor?.Users?.full_name || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Specialty</p>
                <p className="text-gray-900 font-bold">{latestAppointment.Doctor?.specialization || "General"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${latestAppointment.status === 'completed' ? 'bg-green-50 text-green-600' :
                  latestAppointment.status === 'pending' ? 'bg-sky-50 text-sky-600' : 'bg-red-50 text-red-600'
                  }`}>
                  {latestAppointment.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/patient/exam/${latestAppointment.appointment_id}`)}
              className="px-6 py-3 bg-gray-50 hover:bg-sky-500 hover:text-white text-gray-600 font-bold rounded-xl transition-all text-sm whitespace-nowrap"
            >
              View Results
            </button>
          </MotionDiv>
        )}

        {/* Specialty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredDepartments.map((s, idx) => {
            // Gọi hàm để lấy icon và màu sắc tương ứng với tên khoa
            const ui = getDepartmentUI(s.name);

            return (
              <MotionDiv
                key={s.department_id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                onClick={() => navigate(`/patient/booking/details?specialty=${encodeURIComponent(s.name)}&departmentId=${s.department_id}`)}
                className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] cursor-pointer group transition-all"
              >
                {/* Áp dụng màu và icon từ hàm getDepartmentUI */}
                <div className={`w-14 h-14 ${ui.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <i className={`${ui.icon} text-2xl`}></i>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">{s.name}</h3>

                {/* Nếu backend có s.description thì hiện, không thì hiện dòng text mặc định */}
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {s.description || "Khám và chẩn đoán chuyên sâu với đội ngũ bác sĩ hàng đầu."}
                </p>
              </MotionDiv>
            );
          })}
        </div>

        {/* Appointment History Tabs */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] border border-gray-100"
        >
          {/* Thanh Tabs */}
          <div className="flex bg-[#5ba4f8] items-center p-1 rounded-xl mb-8 w-full max-w-3xl mx-auto shadow-sm relative">
            {[
              { id: "pending", label: "Chờ Xác Nhận" },
              { id: "confirmed", label: "Đã Xác Nhận" },
              { id: "cancelled", label: "Bỏ Lỡ" },
              { id: "completed", label: "Hoàn Thành" }
            ].map((tab, index, array) => (
              <React.Fragment key={tab.id}>

                {/* Nút Tab */}
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 z-10 ${activeTab === tab.id
                    ? "bg-white text-[#5ba4f8] shadow-sm"
                    : "text-white hover:bg-white/10"
                    }`}
                >
                  {tab.label}
                </button>

                {/* Vạch kẻ (Line) - Tự động chèn vào giữa các nút, trừ nút cuối cùng */}
                {index < array.length - 1 && (
                  <div
                    className={`h-5 w-px self-center transition-colors duration-300 mx-1 ${
                      // Ẩn vạch kẻ nếu 1 trong 2 nút bên cạnh nó đang active (để viền trắng đè lên tự nhiên)
                      activeTab === array[index].id || activeTab === array[index + 1].id
                        ? "bg-transparent"
                        : "bg-white/30"
                      }`}
                  ></div>
                )}

              </React.Fragment>
            ))}
          </div>

          <div className="space-y-4">
            {appointmentsByStatus && appointmentsByStatus.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {appointmentsByStatus.map((app, i) => (
                  <MotionDiv
                    key={app.appointment_id || i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.08)] hover:shadow-lg transition-all flex flex-col h-full"
                  >
                    {/* Header: Giờ và Trạng thái */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center text-[#5ba4f8] font-medium text-sm">
                        <i className="fa-regular fa-clock mr-2"></i>
                        {app.DoctorSlots?.start_time?.slice(0, 5)} - {app.DoctorSlots?.end_time?.slice(0, 5)}
                      </div>

                      {/* ĐÃ SỬA: Cho chữ và màu ăn theo tab hiện tại luôn */}
                      <span className={`text-[12px] font-medium ${app.status === 'pending' ? 'text-[#5ba4f8]' : app.status === 'confirmed' ? 'text-[#5ba4f8]' : app.status === 'cancelled' ? 'text-gray-500' : app.status === 'completed' ? 'text-green-500' : 'text-gray-500'
                        }`}>
                        {app.status === 'pending' ? 'chờ xác nhận' : app.status === 'confirmed' ? 'Đã xác nhận' : app.status === 'cancelled' ? 'Bỏ lỡ' : app.status === 'completed' ? 'Hoàn thành' : 'Chờ xác nhận'}
                      </span>
                    </div>

                    {/* Body: Thông tin bệnh nhân & Dịch vụ */}
                    <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(app.Patients?.Users?.full_name || 'BN')}&background=random&color=fff`}
                        alt="avatar"
                        className="w-[42px] h-[42px] rounded-full object-cover"
                      />
                      <div>
                        {/* //Hiển thị id appointmennt_id */}
                        <p className="text-gray-500 text-xs mt-0.5">
                          {app.appointment_id || "Mã lịch khám"}
                        </p>
                        <h4 className="font-bold text-gray-900 text-sm">
                          {app.Patients?.Users?.full_name || "Tên Bệnh Nhân"}
                        </h4>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {app.ClinicServices?.name || "Khám sức khỏe tổng quát"}
                        </p>
                      </div>
                    </div>

                    {/* Footer: Thông tin Bác sĩ & Phòng khám */}
                    <div className="space-y-2 text-[13px] text-gray-600 flex-1">
                      <p className="flex items-start gap-2">
                        <i className="fa-solid fa-stethoscope mt-0.5 text-gray-400 w-4"></i>
                        <span>
                          <strong className="font-semibold text-gray-800">
                            BS. {app.Doctors?.Users?.full_name || "N/A"}
                          </strong>
                          <span className="mx-1">•</span>
                          {app.ClinicServices?.Departments?.name || "Chuyên khoa"}
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <i className="fa-solid fa-location-dot mt-0.5 text-gray-400 w-4 ml-[1px]"></i>
                        <span>Tầng 4, Tòa nhà A</span>
                      </p>
                    </div>

                    {/* Nút Xem chi tiết */}
                    <div className="flex justify-end pt-2 mt-auto">
                      <button
                        onClick={() => navigate(`/patient/exam/${app.appointment_id}`)}
                        className="text-[#5ba4f8] text-xs font-semibold hover:text-sky-600 transition-colors flex items-center gap-1"
                      >
                        Xem chi tiết
                        <i className="fa-solid fa-chevron-right text-[9px] mt-[1px]"></i>
                      </button>
                    </div>
                  </MotionDiv>
                ))}

              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <i className="fa-solid fa-calendar-xmark text-3xl"></i>
                </div>
                <p className="text-gray-400 font-medium">Chưa có lịch khám nào trong danh mục này.</p>
              </div>
            )}
          </div>
        </MotionDiv>

      </div>
    </div>
  );
};
export default SelectSpecialtyPage;
