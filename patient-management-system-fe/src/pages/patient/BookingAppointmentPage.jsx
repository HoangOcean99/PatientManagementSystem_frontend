import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { supabase } from "../../../supabaseClient";
import { getAllDoctors } from "../../api/doctorApi";
import { createAppointment } from "../../api/scheduleApi";
import { getPatients } from "../../api/patientApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import scrollbarStyles from "../../helpers/styleCss/ScrollbarStyles";

const SPECIALTY_ICONS = {
  "Tim mạch": "fa-heart-pulse",
  "Nha khoa": "fa-tooth",
  "Thần kinh": "fa-brain",
  "Chấn thương chỉnh hình": "fa-bone",
  "Mắt": "fa-eye",
  "Nhi khoa": "fa-baby",
  "Tai Mũi Họng": "fa-ear-listen",
  "Da liễu": "fa-hand-dots",
};

const RELATION_MAP = {
  father: "Cha",
  mother: "Mẹ",
  guardian: "Người giám hộ",
  other: "Khác",
};

const getDefaultIcon = (specialty) => {
  for (const [key, icon] of Object.entries(SPECIALTY_ICONS)) {
    if (specialty.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return "fa-stethoscope";
};

const BookingAppointmentPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [dependents, setDependents] = useState([]);
  const [myself, setMyself] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    specialty: "",
    patient_id: "",
    is_dependent: false,
    doctor_id: "",
    service_id: "",
    appointment_date: "",
    start_time: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData?.user?.id;
        const userMetadata = authData?.user?.user_metadata || {};

        setMyself({
          user_id: userId,
          full_name: userMetadata.full_name || "Bản thân",
        });

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

        // Fallback for services if API fails
        const loadedServices = svcRes.data?.data || [
          { service_id: "svc_1", name: "Khám tổng quát", price: 200000, duration_minutes: 30 },
          { service_id: "svc_2", name: "Khám chuyên khoa", price: 300000, duration_minutes: 45 },
          { service_id: "svc_3", name: "Tái khám", price: 150000, duration_minutes: 20 },
        ];
        setServices(loadedServices);

        const loadedDependents = depRes.data?.data || depRes.data || [];
        setDependents(loadedDependents);

        const uniqueSpecialties = [
          ...new Set(docs.map((d) => d.specialization).filter(Boolean)),
        ];
        // Thêm một số chuyên khoa mẫu nếu không có bác sĩ nào (để test UI)
        if (uniqueSpecialties.length === 0) {
          uniqueSpecialties.push("Tim mạch", "Nha khoa", "Nhi khoa", "Mắt", "Tai Mũi Họng", "Da liễu");
        }
        setSpecialties(uniqueSpecialties);
      } catch (err) {
        console.error("Failed to load data:", err);
        toast.error("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "specialty") {
        updated.doctor_id = ""; // Reset doctor when specialty changes
      }
      return updated;
    });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep((prev) => prev + 1);
  };
  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep((prev) => prev - 1);
  };

  const handleSelectSpecialty = (specialty) => {
    handleChange("specialty", specialty);
    nextStep();
  };

  const handleSelectPatient = (patientId, isDependent) => {
    handleChange("patient_id", patientId);
    handleChange("is_dependent", isDependent);
    nextStep();
  };

  const validateStep3 = () => {
    const errs = {};
    if (!form.doctor_id) errs.doctor_id = "Vui lòng chọn bác sĩ";
    if (!form.service_id) errs.service_id = "Vui lòng chọn dịch vụ";
    if (!form.appointment_date) errs.appointment_date = "Vui lòng chọn ngày";
    else if (
      new Date(form.appointment_date) < new Date(new Date().toDateString())
    )
      errs.appointment_date = "Ngày hẹn không hợp lệ";
    if (!form.start_time) errs.start_time = "Vui lòng chọn giờ";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    try {
      setSubmitting(true);
      const selectedSvc = services.find(
        (s) => String(s.service_id) === String(form.service_id)
      );
      const duration = selectedSvc?.duration_minutes || 30;
      const [h, m] = form.start_time.split(":").map(Number);
      const endMin = h * 60 + m + duration;
      const end_time = `${String(Math.floor(endMin / 60)).padStart(
        2,
        "0"
      )}:${String(endMin % 60).padStart(2, "0")}`;

      const payload = {
        patient_id: form.patient_id,
        doctor_id: form.doctor_id,
        service_id: form.service_id,
        appointment_date: form.appointment_date,
        start_time: form.start_time,
        end_time,
        status: "pending",
      };

      const res = await createAppointment(payload);
      const appointmentId =
        res.data?.data?.appointment_id ||
        res.data?.appointment_id ||
        res?.appointment_id;

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

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)",
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  const filteredDoctors = doctors.filter(
    (d) => !form.specialty || d.specialization === form.specialty
  );

  return (
    <div
      className="min-h-screen font-sans relative pb-20"
      style={{
        width: "100vw",
        background:
          "linear-gradient(160deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)",
      }}
    >
      {scrollbarStyles}

      {/* Header */}
      <div
        className="sticky top-0 z-30 border-b border-blue-100/40"
        style={{
          background:
            "linear-gradient(180deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
          backdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (step > 1) prevStep();
                  else navigate("/patient/dashboard");
                }}
                className="w-10 h-10 rounded-xl bg-white/70 hover:bg-white border border-gray-200/60 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-all shadow-sm cursor-pointer"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                  Đặt lịch khám
                </h1>
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="hidden sm:flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step === s
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-110"
                      : step > s
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-400"
                      }`}
                  >
                    {step > s ? <i className="fa-solid fa-check"></i> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-10 h-1 mx-1.5 rounded-full transition-all duration-300 ${step > s ? "bg-emerald-500" : "bg-gray-200"
                        }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile progress bar */}
          <div className="mt-4 sm:hidden bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: CHỌN CHUYÊN KHOA */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mb-4 shadow-inner">
                  <i className="fa-solid fa-stethoscope text-xl"></i>
                </span>
                <h2 className="text-2xl font-bold text-gray-800">
                  Bạn cần khám chuyên khoa gì?
                </h2>
                <p className="text-gray-500 mt-2">
                  Vui lòng chọn một chuyên khoa phù hợp với triệu chứng của bạn
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => handleSelectSpecialty(specialty)}
                    className={`group relative bg-white/70 backdrop-blur-sm p-6 rounded-2xl border ${form.specialty === specialty
                      ? "border-blue-500 ring-2 ring-blue-100"
                      : "border-white/80 hover:border-blue-200"
                      } shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)] transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center gap-4 hover:-translate-y-1`}
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${form.specialty === specialty
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-110"
                        : "bg-blue-50 text-blue-500 group-hover:scale-110 group-hover:bg-blue-100"
                        }`}
                    >
                      <i className={`fa-solid ${getDefaultIcon(specialty)}`}></i>
                    </div>
                    <span
                      className={`font-semibold text-sm ${form.specialty === specialty
                        ? "text-blue-700"
                        : "text-gray-700 group-hover:text-blue-600"
                        }`}
                    >
                      {specialty}
                    </span>

                    {form.specialty === specialty && (
                      <div className="absolute top-3 right-3 text-blue-500 text-lg">
                        <i className="fa-solid fa-circle-check"></i>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: CHỌN ĐỐI TƯỢNG (BẢN THÂN / NGƯỜI NHÀ) */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6 max-w-2xl mx-auto"
            >
              <div className="text-center mb-8">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 mb-4 shadow-inner">
                  <i className="fa-solid fa-users text-xl"></i>
                </span>
                <h2 className="text-2xl font-bold text-gray-800">
                  Ai là người sẽ đi khám?
                </h2>
                <p className="text-gray-500 mt-2">
                  Bạn có thể đặt lịch cho chính mình hoặc người thân trong gia đình
                </p>
              </div>

              <div className="space-y-4">
                {/* Bản thân */}
                <button
                  onClick={() => handleSelectPatient(myself?.user_id, false)}
                  className={`w-full relative bg-white/70 backdrop-blur-sm p-5 rounded-2xl border ${form.patient_id === myself?.user_id && !form.is_dependent
                    ? "border-blue-500 ring-2 ring-blue-100"
                    : "border-white/80 hover:border-blue-200"
                    } shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)] transition-all duration-300 cursor-pointer flex items-center gap-4 text-left group`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-300 flex-shrink-0 ${form.patient_id === myself?.user_id && !form.is_dependent
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-blue-50 text-blue-500 group-hover:bg-blue-100"
                      }`}
                  >
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[15px] font-bold text-gray-800">
                      Đăng ký cho bản thân
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {myself?.full_name}
                    </p>
                  </div>
                  <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
                    <i className="fa-solid fa-chevron-right"></i>
                  </div>
                </button>

                {/* Người thân */}
                <div className="pt-4 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-px bg-gray-200 flex-1"></div>
                    <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                      Hoặc người phụ thuộc
                    </span>
                    <div className="h-px bg-gray-200 flex-1"></div>
                  </div>
                </div>

                {dependents.length === 0 ? (
                  <div className="text-center p-6 border border-dashed border-gray-300 rounded-2xl bg-gray-50/50">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                      <i className="fa-solid fa-user-plus"></i>
                    </div>
                    <p className="text-gray-500 text-sm">
                      Bạn chưa thêm người phụ thuộc nào.
                    </p>
                    <button
                      onClick={() => navigate("/patient/under-my-care/key")}
                      className="mt-3 text-blue-600 text-sm font-bold hover:underline"
                    >
                      Thêm người thân ngay
                    </button>
                  </div>
                ) : (
                  dependents.map((dep) => {
                    const child = dep.ChildUser || {};
                    const isSelected = form.patient_id === child.user_id && form.is_dependent;

                    return (
                      <button
                        key={dep.relationship_id}
                        onClick={() => handleSelectPatient(child.user_id, true)}
                        className={`w-full relative bg-white/70 backdrop-blur-sm p-5 rounded-2xl border ${isSelected
                          ? "border-emerald-500 ring-2 ring-emerald-100"
                          : "border-white/80 hover:border-emerald-200"
                          } shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)] transition-all duration-300 cursor-pointer flex items-center gap-4 text-left group`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-300 flex-shrink-0 ${isSelected
                            ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                            : "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100"
                            }`}
                        >
                          <i className="fa-solid fa-children"></i>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[15px] font-bold text-gray-800">
                            {child.full_name || "Chưa cập nhật"}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded-md font-medium border border-emerald-200/50">
                              {RELATION_MAP[dep.relationship] || dep.relationship}
                            </span>
                          </div>
                        </div>
                        <div className="text-gray-300 group-hover:text-emerald-500 transition-colors">
                          <i className="fa-solid fa-chevron-right"></i>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 3: CHI TIẾT LỊCH HẸN VÀ SUBMIT */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-2xl mx-auto"
            >
              <form
                onSubmit={handleSubmit}
                className="bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm shadow-lg shadow-sky-500/25">
                      <i className="fa-regular fa-calendar-check"></i>
                    </span>
                    Hoàn tất thông tin
                  </h3>

                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 font-medium">Chuyên khoa: <span className="text-blue-600 font-bold">{form.specialty}</span></span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Bác sĩ */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Bác sĩ khám <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredDoctors.length > 0 ? (
                        filteredDoctors.map((d) => (
                          <div
                            key={d.doctor_id}
                            onClick={() => handleChange("doctor_id", d.doctor_id)}
                            className={`p-4 rounded-xl border ${form.doctor_id === d.doctor_id
                              ? "border-blue-500 bg-blue-50/30 ring-1 ring-blue-500"
                              : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                              } cursor-pointer transition-all flex items-center gap-3`}
                          >
                            <img
                              src={d.Users?.avatar_url || "https://ui-avatars.com/api/?name=" + (d.Users?.full_name || "Doctor") + "&background=random"}
                              alt="avatar"
                              className="w-10 h-10 rounded-full bg-gray-200 object-cover"
                            />
                            <div>
                              <p className="text-sm font-bold text-gray-800 line-clamp-1">{d.Users?.full_name || `Bác sĩ ${d.doctor_id}`}</p>
                              <p className="text-xs text-gray-500">{d.specialization}</p>
                            </div>
                            {form.doctor_id === d.doctor_id && (
                              <div className="ml-auto text-blue-500">
                                <i className="fa-solid fa-circle-check"></i>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full p-4 border border-dashed rounded-xl border-gray-300 text-center text-gray-500 text-sm">
                          Không có bác sĩ nào thuộc chuyên khoa này đang hoạt động.
                        </div>
                      )}
                    </div>
                    {errors.doctor_id && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                        <i className="fa-solid fa-circle-exclamation text-[10px]"></i>
                        {errors.doctor_id}
                      </p>
                    )}
                  </div>

                  {/* Dịch vụ */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Loại dịch vụ <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={form.service_id}
                      onChange={(e) => handleChange("service_id", e.target.value)}
                      className={`w-full px-4 py-3 bg-white border ${errors.service_id
                        ? "border-red-400 ring-2 ring-red-100"
                        : "border-gray-200"
                        } rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all text-gray-700 font-medium shadow-sm cursor-pointer appearance-none`}
                    >
                      <option value="">— Chọn dịch vụ —</option>
                      {services.map((s) => (
                        <option key={s.service_id} value={s.service_id}>
                          {s.name} — {Number(s.price).toLocaleString("vi-VN")}₫ ({s.duration_minutes} phút)
                        </option>
                      ))}
                    </select>
                    {errors.service_id && (
                      <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                        <i className="fa-solid fa-circle-exclamation text-[10px]"></i>
                        {errors.service_id}
                      </p>
                    )}
                  </div>

                  {/* Ngày Giờ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Ngày khám <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="fa-regular fa-calendar text-blue-400 text-sm"></i>
                        </div>
                        <input
                          type="date"
                          value={form.appointment_date}
                          onChange={(e) =>
                            handleChange("appointment_date", e.target.value)
                          }
                          min={new Date().toISOString().split("T")[0]}
                          className={`w-full px-4 py-3 pl-11 bg-white border ${errors.appointment_date
                            ? "border-red-400 ring-2 ring-red-100"
                            : "border-gray-200"
                            } rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all text-gray-700 font-medium shadow-sm cursor-pointer`}
                        />
                      </div>
                      {errors.appointment_date && (
                        <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                          <i className="fa-solid fa-circle-exclamation text-[10px]"></i>
                          {errors.appointment_date}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Giờ bắt đầu <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="fa-regular fa-clock text-blue-400 text-sm"></i>
                        </div>
                        <input
                          type="time"
                          value={form.start_time}
                          onChange={(e) =>
                            handleChange("start_time", e.target.value)
                          }
                          className={`w-full px-4 py-3 pl-11 bg-white border ${errors.start_time
                            ? "border-red-400 ring-2 ring-red-100"
                            : "border-gray-200"
                            } rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all text-gray-700 font-medium shadow-sm cursor-pointer`}
                        />
                      </div>
                      {errors.start_time && (
                        <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                          <i className="fa-solid fa-circle-exclamation text-[10px]"></i>
                          {errors.start_time}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-3 bg-gray-50/50">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                    }}
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>{" "}
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-calendar-check"></i> Xác nhận & Thanh toán
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookingAppointmentPage;
