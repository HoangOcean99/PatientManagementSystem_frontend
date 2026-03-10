import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getListAppointments } from "../../api/scheduleApi";
import { supabase } from "../../../supabaseClient";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const SPECIALTIES = [
  { id: "gen", name: "Nội Tổng Quát", desc: "Khám và điều trị các bệnh nội khoa tổng quát.", icon: "fa-solid fa-heart-pulse", color: "bg-sky-50 text-sky-500" },
  { id: "cardio", name: "Tim Mạch", desc: "Chẩn đoán và điều trị các bệnh về tim và mạch máu.", icon: "fa-solid fa-heart", color: "bg-red-50 text-red-500" },
  { id: "derma", name: "Da Liễu", desc: "Chăm sóc và điều trị các vấn đề về da, tóc, móng.", icon: "fa-solid fa-sun", color: "bg-orange-50 text-orange-500" },
  { id: "pedia", name: "Nhi Khoa", desc: "Khám và điều trị bệnh cho trẻ em và sơ sinh.", icon: "fa-solid fa-baby", color: "bg-pink-50 text-pink-500" },
  { id: "ortho", name: "Chấn Thương Chỉnh Hình", desc: "Phẫu thuật và điều trị các vấn đề xương khớp.", icon: "fa-solid fa-bone", color: "bg-blue-50 text-blue-500" },
  { id: "neuro", name: "Thần Kinh", desc: "Chẩn đoán và điều trị các bệnh liên quan đến hệ thần kinh.", icon: "fa-solid fa-brain", color: "bg-purple-50 text-purple-500" },
];

const SelectSpecialtyPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState([]);
  const [latestAppointment, setLatestAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const res = await getListAppointments({ patient_id: user.id });
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
    fetchAppointments();
  }, []);

  const filteredSpecialties = SPECIALTIES.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const MotionDiv = motion.div;

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><LoadingSpinner /></div>;

  return (
    <div className="w-full h-full overflow-y-auto bg-[#F8F9FB] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <MotionDiv 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chọn Chuyên Khoa</h1>
            <p className="text-gray-500 mt-1">Vui lòng chọn chuyên khoa bạn muốn đăng ký khám.</p>
          </div>
          <div className="relative w-full md:w-80">
            <input 
              type="text"
              placeholder="Search specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-sm"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </MotionDiv>

        {/* Quick Info: Latest Appointment */}
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
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  latestAppointment.status === 'completed' ? 'bg-green-50 text-green-600' : 
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
          {filteredSpecialties.map((s, idx) => (
            <MotionDiv
              key={s.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={() => navigate(`/patient/booking/details?specialty=${encodeURIComponent(s.name)}`)}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] cursor-pointer group transition-all"
            >
              <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <i className={`${s.icon} text-2xl`}></i>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{s.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </MotionDiv>
          ))}
        </div>

        {/* Appointment History Tabs */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] border border-gray-100"
        >
          <div className="flex flex-wrap p-1 bg-gray-50 rounded-2xl mb-8 w-fit">
            {["upcoming", "missed", "done"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab 
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25" 
                  : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "upcoming" ? "Up Coming" : tab === "missed" ? "Missed" : "Done"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {appointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Simplified appointment cards to match visual style */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="group p-4 rounded-[1.5rem] border border-gray-50 bg-white hover:border-sky-100 hover:shadow-xl hover:shadow-sky-500/5 transition-all flex items-center gap-4">
                    <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500">
                      <i className="fa-solid fa-notes-medical"></i>
                    </div>
                    <div className="flex-1 h-8 bg-gray-50 rounded-lg animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <i className="fa-solid fa-calendar-xmark text-3xl"></i>
                </div>
                <p className="text-gray-400 font-medium">No appointments found in this category.</p>
              </div>
            )}
          </div>
        </MotionDiv>
      </div>
    </div>
  );
};

export default SelectSpecialtyPage;
