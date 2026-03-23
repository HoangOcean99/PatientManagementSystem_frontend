import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { supabase } from "../../../supabaseClient";

// Import API
import { createAppointment } from "../../api/appointmentApi";
import { getDoctorbyDepartmentId } from "../../api/doctorApi";
import { getAvailableDoctorSlots } from "../../api/appointmentApi";
import { getServicesbyDepartmentId } from "../../api/serviceApi";
import { getDependents } from "../../api/patientApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const RELATION_MAP = {
  father: "Cha",
  mother: "Mẹ",
  guardian: "Người giám hộ",
  other: "Khác",
};

// --- Helper for Calendar ---
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const BookingAppointmentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [dependents, setDependents] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [myself, setMyself] = useState(null);

  const [allRawSlots, setAllRawSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const [form, setForm] = useState({
    patient_id: "",
    is_dependent: false,
    doctor_id: "",
    service_id: "",
    appointment_date: "", // Tớ để rỗng ban đầu để hiển thị thông báo "chọn ngày" rõ hơn
    start_time: "",
    slot_id: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const departmentId = searchParams.get("departmentId");
  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      setIsLoadingSlots(true);
      try {
        const res = await getAvailableDoctorSlots(departmentId);
        setAllRawSlots(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Error fetching slots", err);
      } finally {
        setIsLoadingSlots(false);
      }
    };
    if (departmentId) fetchAvailableSlots();
  }, [departmentId]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData?.user?.id;
        const userMetadata = authData?.user?.user_metadata || {};

        const me = {
          user_id: userId,
          full_name: userMetadata.full_name || "Bản thân",
        };
        setMyself(me);

        if (userId) {
          setForm(prev => ({ ...prev, patient_id: userId, is_dependent: false }));
          const depsRes = await getDependents();
          setDependents(depsRes.data?.data || depsRes.data || []);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        toast.error("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    const fetchDoctors = async () => {
      const res = await getDoctorbyDepartmentId(departmentId);
      setDoctors(res.data?.data || []);
    };

    const fetchServices = async () => {
      const res = await getServicesbyDepartmentId(departmentId);
      setServices(res.data);
    };

    if (departmentId) {
      fetchDoctors();
      fetchServices();
    }
    loadUserData();
  }, [departmentId]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const specialtyFilter = params.get("specialty");

    if (specialtyFilter) {
      setSelectedSpecialty(specialtyFilter);
      if (services.length > 0) {
        const matchingSvc = services.find(s => {
          if (!s || !s.name) return false;
          const sNameLower = s.name.toLowerCase();
          const filterLower = specialtyFilter.toLowerCase();
          return sNameLower.includes(filterLower) || filterLower.includes(sNameLower);
        });

        if (matchingSvc) {
          setForm(prev => ({ ...prev, service_id: matchingSvc.service_id }));
        }
      }
    }
  }, [location.search, services, doctors]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.patient_id) errs.patient_id = "Vui lòng chọn bệnh nhân";
    if (!form.doctor_id) errs.doctor_id = "Vui lòng chọn bác sĩ";
    if (!form.service_id) errs.service_id = "Vui lòng chọn dịch vụ";
    if (!form.appointment_date) errs.appointment_date = "Vui lòng chọn ngày";
    if (!form.start_time) errs.start_time = "Vui lòng chọn giờ";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setSubmitting(true);
      const selectedSvc = services.find((s) => String(s.service_id) === String(form.service_id));

      const payload = {
        patient_id: form.patient_id,
        doctor_id: form.doctor_id,
        service_id: form.service_id,
        slot_id: form.slot_id,
        role: "patient",
        notes: form.notes
      };

      const res = await createAppointment(payload);
      const appointmentId = res.data?.data?.appointment_id || res.data?.appointment_id || res?.appointment_id;

      toast.success("Đặt lịch thành công!");
      navigate(`/patient/payment/${appointmentId}`, {
        state: { appointment: res.data?.data, service: selectedSvc },
      });
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error(err.response?.data?.message || "Đặt lịch thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const availableDates = useMemo(() => {
    if (!allRawSlots.length) return [];
    let filtered = allRawSlots;
    if (form.doctor_id) {
      filtered = filtered.filter(slot => String(slot.doctor_id) === String(form.doctor_id));
    }
    return [...new Set(filtered.map(slot => slot.slot_date))];
  }, [allRawSlots, form.doctor_id]);

  const filteredTimeSlots = useMemo(() => {
    if (!form.appointment_date) return [];
    let filtered = allRawSlots.filter(slot => slot.slot_date === form.appointment_date);
    if (form.doctor_id) {
      filtered = filtered.filter(slot => String(slot.doctor_id) === String(form.doctor_id));
    }
    return filtered.sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""));
  }, [allRawSlots, form.appointment_date, form.doctor_id]);

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  const calendarDays = useMemo(() => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    return days;
  }, [currentMonth, currentYear]);

  const changeMonth = (offset) => {
    setViewDate(new Date(currentYear, currentMonth + offset, 1));
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleDateSelect = (day) => {
    if (!day) return;
    const selectedDate = new Date(currentYear, currentMonth, day);
    if (selectedDate < today) return;

    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateString = `${currentYear}-${monthStr}-${dayStr}`;

    handleChange("appointment_date", dateString);
    handleChange("start_time", "");
    handleChange("slot_id", "");
  };

  // --- LOGIC HƯỚNG DẪN & RESET ---
  const handleResetSelection = () => {
    handleChange("doctor_id", "");
    handleChange("appointment_date", "");
    handleChange("start_time", "");
    handleChange("slot_id", "");
  };

  const getGuideMessage = () => {
    const { doctor_id, appointment_date, start_time } = form;

    if (doctor_id && appointment_date && start_time) {
      return "Tuyệt vời! Bạn đã chọn đủ thông tin. Hãy nhấn Xác nhận lịch khám bên dưới.";
    }
    if (doctor_id && !appointment_date) {
      return "Bác sĩ đã được chọn. Tiếp theo, vui lòng chọn Ngày khám trên lịch bên phải.";
    }
    if (!doctor_id && appointment_date && !start_time) {
      return "Ngày khám đã được chọn. Tiếp theo, vui lòng chọn Giờ khám ở góc dưới bên phải.";
    }
    if (doctor_id && appointment_date && !start_time) {
      return "Tiếp theo, vui lòng chọn Giờ khám trống hiển thị ở bên dưới lịch.";
    }
    if (!doctor_id && appointment_date && start_time) {
      return "Đã chọn giờ. Vui lòng kiểm tra Bác sĩ phụ trách hoặc chọn thêm ở Form.";
    }
    return "Vui lòng chọn Bác sĩ hoặc Ngày khám trên lịch để bắt đầu tìm kiếm slot.";
  };

  const MotionDiv = motion.div;

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><LoadingSpinner /></div>;

  return (
    <div className="w-full h-full overflow-y-auto bg-[#F8F9FB] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/patient/booking")}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-sky-500 transition-colors font-medium group"
        >
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          Quay lại chọn khoa
        </button>
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
          <p className="text-gray-500 mt-1">Easily schedule new appointments for patients.</p>
        </MotionDiv>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <MotionDiv
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-3xl p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Đặt lịch khám</h2>
                {selectedSpecialty && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-full text-xs font-bold ring-1 ring-sky-500/10 shadow-sm shadow-sky-500/5">
                    <i className="fa-solid fa-stethoscope"></i>
                    {selectedSpecialty}
                  </div>
                )}
              </div>

              {/* KHU VỰC THÔNG BÁO HƯỚNG DẪN & NÚT XÓA */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-circle-info text-emerald-500 mt-1"></i>
                  <p className="text-sm text-emerald-700 font-medium leading-snug">
                    {getGuideMessage()}
                  </p>
                </div>
                {(form.doctor_id || form.appointment_date || form.start_time) && (
                  <button
                    type="button"
                    onClick={handleResetSelection}
                    className="text-xs font-bold text-red-500 hover:text-red-600 bg-white px-3 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors whitespace-nowrap shadow-sm"
                  >
                    <i className="fa-solid fa-rotate-right mr-1"></i> Xóa chọn lại
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 block">Bệnh nhân</label>
                    <div className="relative">
                      <select
                        value={form.patient_id}
                        onChange={(e) => {
                          const isMyself = e.target.value === myself?.user_id;
                          handleChange("patient_id", e.target.value);
                          handleChange("is_dependent", !isMyself);
                        }}
                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all appearance-none text-gray-700"
                      >
                        <option value="">Chọn bệnh nhân</option>
                        <option value={myself?.user_id}>{myself?.full_name} (Bản thân)</option>
                        {dependents.map((dep) => {
                          const childUser = dep.Users || dep.ChildUser || {};
                          const childId = childUser.user_id || dep.child_user_id;
                          return (
                          <option key={dep.relationship_id} value={childId}>
                            {childUser.full_name}
                          </option>
                        )})}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <i className="fa-solid fa-chevron-down text-xs"></i>
                      </div>
                    </div>
                    {errors.patient_id && <p className="text-xs text-red-500 mt-1">{errors.patient_id}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 block">Bác sĩ</label>
                    <div className="relative">
                      <select
                        value={form.doctor_id}
                        onChange={(e) => {
                          handleChange("doctor_id", e.target.value);
                          handleChange("start_time", "");
                          handleChange("slot_id", "");
                          handleChange("appointment_date", "");
                        }}
                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all appearance-none text-gray-700"
                      >
                        <option value="">Chọn bác sĩ</option>
                        {doctors.map((d) => (
                          <option key={d.doctor_id} value={d.doctor_id}>
                            Dr. {d.Users?.full_name} ({d.specialization})
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <i className="fa-solid fa-chevron-down text-xs"></i>
                      </div>
                    </div>
                    {errors.doctor_id && <p className="text-xs text-red-500 mt-1">{errors.doctor_id}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 block">Loại dịch vụ</label>
                    <div className="relative">
                      <select
                        value={form.service_id}
                        onChange={(e) => handleChange("service_id", e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all appearance-none text-gray-700"
                      >
                        <option value="">Chọn dịch vụ</option>
                        {services.map((s) => (
                          <option key={s.service_id} value={s.service_id}>
                            {s.name} - {Number(s.price).toLocaleString("vi-VN")}₫
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <i className="fa-solid fa-chevron-down text-xs"></i>
                      </div>
                    </div>
                    {errors.service_id && <p className="text-xs text-red-500 mt-1">{errors.service_id}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 block">Ngày khám</label>

                    <div className="relative">
                      <div className={`w-full h-12 px-4 bg-white border rounded-xl flex items-center gap-3 cursor-default transition-all ${form.appointment_date ? 'border-sky-300 text-gray-900' : 'border-gray-200 text-gray-400'}`}>
                        <i className="fa-regular fa-calendar text-sky-500"></i>
                        <span>{form.appointment_date ? new Date(form.appointment_date).toLocaleDateString('vi-VN', { month: 'long', day: 'numeric', year: 'numeric' }) : "Vui lòng chọn ngày ở lịch bên phải"}</span>
                      </div>
                    </div>
                    {errors.appointment_date && <p className="text-xs text-red-500 mt-1">{errors.appointment_date}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 block">Giờ khám</label>
                  <div className="relative">
                    <div className={`w-full h-12 px-4 bg-white border rounded-xl flex items-center gap-3 cursor-default transition-all ${form.start_time ? 'border-sky-300 text-gray-900 font-medium' : 'border-gray-200 text-gray-400'}`}>
                      <i className="fa-regular fa-clock text-sky-500"></i>
                      <span>
                        {form.start_time || "Vui lòng chọn giờ trống ở khung bên phải"}
                      </span>
                    </div>
                  </div>
                  {errors.start_time && <p className="text-xs text-red-500 mt-1">{errors.start_time}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 block">Lý do khám</label>
                  <textarea
                    rows="4"
                    value={form.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Thêm bất kỳ ghi chú nào về lịch khám..."
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-gray-700 resize-none placeholder:text-gray-400"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold transition-all transform active:scale-[0.98] shadow-lg shadow-sky-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><i className="fa-solid fa-check"></i> Xác nhận lịch khám</>}
                  </button>
                </div>
              </form>
            </div>
          </MotionDiv>

          {/* Right Column: Calendar & Time Slots */}
          <MotionDiv
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-3xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100">
              <h3 className="text-lg text-gray-800 mb-6 font-semibold">Chọn ngày</h3>
              <div className="flex items-center justify-between mb-6">
                <button type="button" onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"><i className="fa-solid fa-chevron-left text-xs"></i></button>
                <div className="text-center"><span className="font-bold text-gray-700 block text-sm">{MONTHS[currentMonth]} {currentYear}</span></div>
                <button type="button" onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"><i className="fa-solid fa-chevron-right text-xs"></i></button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS_OF_WEEK.map(d => (<div key={d} className="text-center text-[10px] font-bold text-gray-400 py-2 uppercase tracking-tighter">{d}</div>))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  const dateOfSlot = day ? new Date(currentYear, currentMonth, day) : null;
                  const isPast = dateOfSlot && dateOfSlot < today;

                  const isSelected =
                    form.appointment_date &&
                    day &&
                    new Date(form.appointment_date).getDate() === day &&
                    new Date(form.appointment_date).getMonth() === currentMonth;

                  const isToday =
                    day &&
                    new Date().getDate() === day &&
                    new Date().getMonth() === currentMonth &&
                    new Date().getFullYear() === currentYear;

                  let hasSlots = false;
                  if (day) {
                    const monthStr = String(currentMonth + 1).padStart(2, "0");
                    const dayStr = String(day).padStart(2, "0");
                    const dateKey = `${currentYear}-${monthStr}-${dayStr}`;
                    hasSlots = availableDates.includes(dateKey);
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={!day || isPast || (!hasSlots && !isPast)}
                      onClick={() => handleDateSelect(day)}
                      className={`h-9 w-full rounded-full flex items-center justify-center text-xs font-semibold transition-all
          ${!day ? "invisible" : ""}
          ${isPast || (!hasSlots && !isPast && day)
                          ? "text-gray-300 cursor-not-allowed bg-gray-50 opacity-60"
                          : "cursor-pointer text-gray-600 hover:bg-sky-50 hover:text-sky-600"}
          ${isSelected
                          ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                          : ""
                        }
          ${isToday && !isSelected && !isPast
                          ? "text-sky-500 ring-1 ring-sky-500"
                          : ""
                        }
          ${hasSlots && !isSelected && !isPast
                          ? "border border-emerald-400 bg-emerald-50 text-emerald-700"
                          : ""
                        }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-6">
                Giờ khả dụng cho {form.appointment_date ? new Date(form.appointment_date).toLocaleDateString('vi-VN') : "ngày này"}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {isLoadingSlots ? (
                  <div className="col-span-full text-center text-sm text-gray-400 py-4">Đang tải...</div>
                ) : filteredTimeSlots.length > 0 ? (
                  filteredTimeSlots.map((slot) => {
                    const timeDisplay = slot.start_time?.slice(0, 5) || slot.start_time;
                    const isSelected = form.slot_id === slot.slot_id;

                    return (
                      <button
                        key={slot.slot_id}
                        type="button"
                        onClick={() => {
                          handleChange("start_time", slot.start_time);
                          handleChange("slot_id", slot.slot_id);

                          if (!form.doctor_id && slot.doctor_id) {
                            handleChange("doctor_id", slot.doctor_id);
                          }
                        }}
                        className={`py-3 px-1 rounded-xl text-[13px] font-bold border transition-all text-center flex flex-col items-center justify-center
                  ${isSelected
                            ? 'bg-white border-sky-500 text-sky-600 border-2 shadow-sm'
                            : 'bg-white border-gray-100 text-gray-500 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50/30'
                          }
                `}
                      >
                        <span>{timeDisplay}</span>
                        {!form.doctor_id && slot.Doctors?.Users?.full_name && (
                          <span className="text-[9px] mt-1 font-normal opacity-70 truncate w-full px-1">BS. {slot.Doctors.Users.full_name}</span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center text-sm text-gray-400 py-4">
                    {form.appointment_date ? "Không có lịch trống trong ngày này." : "Vui lòng chọn ngày trên lịch."}
                  </div>
                )}
              </div>
            </div>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
};

export default BookingAppointmentPage;