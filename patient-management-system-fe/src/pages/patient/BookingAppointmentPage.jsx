import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { supabase } from "../../../supabaseClient";
import { getAllDoctors } from "../../api/doctorApi";
import { createAppointment, getDoctorSchedule } from "../../api/scheduleApi";
import { getPatients } from "../../api/patientApi";
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
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [dependents, setDependents] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [myself, setMyself] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [form, setForm] = useState({
    patient_id: "",
    is_dependent: false,
    doctor_id: "",
    service_id: "",
    slot_id: "",
    appointment_date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [errors, setErrors] = useState({});

  // Calendar State
  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => {
    const load = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData?.user?.id;
        const userMetadata = authData?.user?.user_metadata || {};

        const me = {
          user_id: userId,
          full_name: userMetadata.full_name || "Bản thân",
        };
        setMyself(me);

        // Pre-select "Myself"
        if (userId) {
          setForm(prev => ({ ...prev, patient_id: userId, is_dependent: false }));
        }

        const [docRes, svcRes, depRes] = await Promise.all([
          getAllDoctors(),
          fetch("http://localhost:3000/base/test")
            .then((r) => (r.ok ? r.json() : { data: { data: [] } }))
            .catch(() => ({ data: { data: [] } })),
          userId
            ? getPatients({ parent_user_id: userId }).catch(() => ({ data: [] }))
            : Promise.resolve({ data: [] }),
        ]);

        const docs = docRes.data?.data || [];
        setDoctors(docs);

        const loadedServices = svcRes.data?.data || [
          { service_id: "svc_1", name: "Khám tổng quát", price: 200000, duration_minutes: 30 },
          { service_id: "svc_2", name: "Khám chuyên khoa", price: 300000, duration_minutes: 45 },
          { service_id: "svc_3", name: "Tái khám", price: 150000, duration_minutes: 20 },
        ];
        setServices(loadedServices);

        const loadedDependents = depRes.data?.data || depRes.data || [];
        setDependents(loadedDependents);
      } catch (err) {
        console.error("Failed to load data:", err);
        toast.error("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Handle specialty from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const specialty = params.get("specialty");
    if (specialty) {
      setSelectedSpecialty(specialty);
      // Pre-select service if it matches the name or type
      if (services.length > 0) {
        const matchingSvc = services.find(s => 
          s.name.toLowerCase().includes(specialty.toLowerCase()) || 
          specialty.toLowerCase().includes(s.name.toLowerCase())
        );
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

  // Fetch available slots when doctor + date changes
  useEffect(() => {
    if (!form.doctor_id || !form.appointment_date) {
      setAvailableSlots([]);
      return;
    }
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const res = await getDoctorSchedule(form.doctor_id, form.appointment_date);
        const slots = res.data?.data || res.data || [];
        // Only show unbooked slots
        setAvailableSlots(slots.filter(s => !s.is_booked));
      } catch (err) {
        console.error('Failed to load slots:', err);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [form.doctor_id, form.appointment_date]);

  const validate = () => {
    const errs = {};
    if (!form.patient_id) errs.patient_id = "Vui lòng chọn bệnh nhân";
    if (!form.doctor_id) errs.doctor_id = "Vui lòng chọn bác sĩ";
    if (!form.service_id) errs.service_id = "Vui lòng chọn dịch vụ";
    if (!form.appointment_date) errs.appointment_date = "Vui lòng chọn ngày";
    if (!form.slot_id) errs.slot_id = "Vui lòng chọn khung giờ";
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
      const totalPrice = selectedSvc?.price || 0;
      const depositRequired = Math.round(totalPrice * 0.3); // 30% deposit

      const payload = {
        patient_id: form.patient_id,
        doctor_id: form.doctor_id,
        service_id: form.service_id,
        slot_id: form.slot_id,
        total_price: totalPrice,
        deposit_required: depositRequired,
        status: "pending",
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

  // --- Calendar Logic ---
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  
  const calendarDays = useMemo(() => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    
    // Padding for previous month
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

  const handleDateSelect = (day) => {
    if (!day) return;
    const selected = new Date(currentYear, currentMonth, day);
    const year = selected.getFullYear();
    const month = String(selected.getMonth() + 1).padStart(2, '0');
    const d = String(selected.getDate()).padStart(2, '0');
    handleChange("appointment_date", `${year}-${month}-${d}`);
  };

  // --- Time Slots Logic ---
  const selectedSlot = availableSlots.find(s => s.slot_id === form.slot_id);

  const MotionDiv = motion.div;

  if (loading) return <div className="flex-1 h-full flex items-center justify-center bg-gray-50"><LoadingSpinner /></div>;

  return (
    <div className="w-full h-full overflow-y-auto bg-[#F8F9FB] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate("/patient/booking")}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-sky-500 transition-colors font-medium group"
        >
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          Back to Specialty Selection
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
          {/* Left Column: Form */}
          <MotionDiv 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-3xl p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-800">Book New Appointment</h2>
                {selectedSpecialty && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-full text-xs font-bold ring-1 ring-sky-500/10 shadow-sm shadow-sky-500/5">
                    <i className="fa-solid fa-stethoscope"></i>
                    {selectedSpecialty}
                  </div>
                )}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 block">Patient</label>
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
                        <option value="">Select a patient</option>
                        <option value={myself?.user_id}>{myself?.full_name} (Bản thân)</option>
                        {dependents.map((dep) => (
                          <option key={dep.relationship_id} value={dep.ChildUser?.user_id}>
                            {dep.ChildUser?.full_name} ({RELATION_MAP[dep.relationship] || dep.relationship})
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <i className="fa-solid fa-chevron-down text-xs"></i>
                      </div>
                    </div>
                    {errors.patient_id && <p className="text-xs text-red-500 mt-1">{errors.patient_id}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 block">Doctor</label>
                    <div className="relative">
                      <select
                        value={form.doctor_id}
                        onChange={(e) => handleChange("doctor_id", e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all appearance-none text-gray-700"
                      >
                        <option value="">Select a provider</option>
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
                    <label className="text-sm font-semibold text-gray-600 block">Appointment Type</label>
                    <div className="relative">
                      <select
                        value={form.service_id}
                        onChange={(e) => handleChange("service_id", e.target.value)}
                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all appearance-none text-gray-700"
                      >
                        <option value="">Select type</option>
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
                    <label className="text-sm font-semibold text-gray-600 block">Appointment Date</label>
                    <div className="relative">
                      <div className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl flex items-center gap-3 text-gray-700 cursor-default">
                        <i className="fa-regular fa-calendar text-sky-500"></i>
                        <span>{form.appointment_date ? new Date(form.appointment_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Pick a date"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 block">Time Slot</label>
                  <div className="relative">
                    <div className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl flex items-center gap-3 text-gray-700 cursor-default">
                      <i className="fa-regular fa-clock text-sky-500"></i>
                      <span className={selectedSlot ? "text-gray-900 font-medium" : "text-gray-400"}>
                        {selectedSlot ? `${selectedSlot.start_time} — ${selectedSlot.end_time}` : "Select time on the right"}
                      </span>
                    </div>
                  </div>
                  {errors.slot_id && <p className="text-xs text-red-500 mt-1">{errors.slot_id}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 block">Reasons appointment</label>
                  <textarea
                    rows="4"
                    value={form.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Add any additional notes about the appointment..."
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-gray-700 resize-none placeholder:text-gray-400"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold transition-all transform active:scale-[0.98] shadow-lg shadow-sky-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><i className="fa-solid fa-check"></i> Confirm Appointment</>}
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
              <h3 className="text-lg font-bold text-gray-800 mb-6 font-semibold">Select Date</h3>
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
                  const isSelected = form.appointment_date && day && new Date(form.appointment_date).getDate() === day && new Date(form.appointment_date).getMonth() === currentMonth;
                  const isToday = day && new Date().getDate() === day && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear;
                  return (
                    <button key={idx} type="button" disabled={!day} onClick={() => handleDateSelect(day)} className={`h-9 w-full rounded-full flex items-center justify-center text-xs font-semibold transition-all ${!day ? 'invisible' : 'cursor-pointer'} ${isSelected ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30' : 'text-gray-600 hover:bg-sky-50 hover:text-sky-600'} ${isToday && !isSelected ? 'text-sky-500 ring-1 ring-sky-500' : ''}`}>{day}</button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-6 font-semibold">Available Slots for {new Date(form.appointment_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
              {!form.doctor_id ? (
                <p className="text-sm text-gray-400 text-center py-8">Select a doctor first</p>
              ) : loadingSlots ? (
                <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin"></div></div>
              ) : availableSlots.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No available slots for this date</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableSlots.map((slot) => {
                    const isSelected = form.slot_id === slot.slot_id;
                    return (
                      <button key={slot.slot_id} type="button" onClick={() => handleChange("slot_id", slot.slot_id)} className={`py-3 px-1 rounded-xl text-[10px] font-bold border transition-all text-center ${isSelected ? 'bg-white border-sky-500 text-gray-900 border-2 shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50/30'}`}>{slot.start_time} — {slot.end_time}</button>
                    );
                  })}
                </div>
              )}
            </div>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
};

export default BookingAppointmentPage;
