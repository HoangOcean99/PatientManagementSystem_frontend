import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { supabase } from "../../../supabaseClient";
import axiosClient from "../../api/axiosClient";
import LoadingSpinner from "../../components/LoadingSpinner";
import scrollbarStyles from "../../helpers/styleCss/ScrollbarStyles";

const BookingAppointmentPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    doctor_id: "",
    service_id: "",
    appointment_date: "",
    start_time: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const [docRes, svcRes] = await Promise.all([
          axiosClient.get("/doctor"),
          axiosClient.get("/services"),
        ]);
        setDoctors(docRes.data?.data || []);
        setServices(svcRes.data?.data || []);
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
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
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
    if (!validate()) return;

    try {
      setSubmitting(true);
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      // if (!userId) { navigate('/login'); return; }

      const selectedSvc = services.find(
        (s) => s.service_id === form.service_id,
      );
      const duration = selectedSvc?.duration_minutes || 30;
      const [h, m] = form.start_time.split(":").map(Number);
      const endMin = h * 60 + m + duration;
      const end_time = `${String(Math.floor(endMin / 60)).padStart(2, "0")}:${String(endMin % 60).padStart(2, "0")}`;

      const payload = {
        patient_id: userId,
        doctor_id: form.doctor_id,
        service_id: form.service_id,
        appointment_date: form.appointment_date,
        start_time: form.start_time,
        end_time,
        status: "pending",
      };

      const res = await axiosClient.post("/appointments", payload);
      const appointmentId = res.data?.data?.appointment_id;

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

  const SelectField = ({
    label,
    field,
    options,
    placeholder,
    renderOption,
  }) => (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {label} <span className="text-red-400">*</span>
      </label>
      <select
        value={form[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        className={`w-full px-4 py-3 bg-white border ${errors[field] ? "border-red-400 ring-2 ring-red-100" : "border-gray-200"} rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all text-gray-700 font-medium shadow-sm cursor-pointer appearance-none`}
      >
        <option value="">{placeholder}</option>
        {options.map(renderOption)}
      </select>
      {errors[field] && (
        <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
          <i className="fa-solid fa-circle-exclamation text-[10px]"></i>
          {errors[field]}
        </p>
      )}
    </div>
  );

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

  return (
    <div
      className="min-h-screen font-sans relative"
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/patient/dashboard")}
              className="w-10 h-10 rounded-xl bg-white/70 hover:bg-white border border-gray-200/60 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-all shadow-sm cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 mb-1">
                <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">
                  Đặt lịch
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                Đặt lịch khám
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm shadow-lg shadow-sky-500/25">
                <i className="fa-solid fa-calendar-plus"></i>
              </span>
              Thông tin lịch hẹn
            </h3>
          </div>

          <div className="p-6 space-y-5">
            <SelectField
              label="Bác sĩ"
              field="doctor_id"
              options={doctors}
              placeholder="— Chọn bác sĩ —"
              renderOption={(d) => (
                <option key={d.doctor_id} value={d.doctor_id}>
                  {d.Users?.full_name || d.doctor_id} — {d.specialization}
                </option>
              )}
            />

            <SelectField
              label="Dịch vụ"
              field="service_id"
              options={services}
              placeholder="— Chọn dịch vụ —"
              renderOption={(s) => (
                <option key={s.service_id} value={s.service_id}>
                  {s.name} — {Number(s.price).toLocaleString("vi-VN")}₫ (
                  {s.duration_minutes} phút)
                </option>
              )}
            />

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
                    className={`w-full px-4 py-3 pl-11 bg-white border ${errors.appointment_date ? "border-red-400 ring-2 ring-red-100" : "border-gray-200"} rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all text-gray-700 font-medium shadow-sm`}
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
                    onChange={(e) => handleChange("start_time", e.target.value)}
                    className={`w-full px-4 py-3 pl-11 bg-white border ${errors.start_time ? "border-red-400 ring-2 ring-red-100" : "border-gray-200"} rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all text-gray-700 font-medium shadow-sm`}
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

          <div className="px-6 py-5 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/patient/dashboard")}
              className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95 cursor-pointer"
            >
              <i className="fa-solid fa-xmark mr-2"></i> Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
              }}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>{" "}
                  Đang xử lý...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-calendar-check"></i> Đặt lịch &
                  Thanh toán
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default BookingAppointmentPage;
