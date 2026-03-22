import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../../../supabaseClient";
import {
  getListAppointmentsByCurrentUserId,
  cancelAppointment,
  rescheduleAppointment,
  getAvailableDoctorSlots,
} from "../../api/appointmentApi";
import { getPatientById } from "../../api/patientApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const PRIMARY = "#4A90E2";

const normalizeAppointmentList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload?.data != null && Array.isArray(payload.data)) return payload.data;
  return [];
};

const GENDER_LABEL = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
};

const statusLabelVi = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "pending") return "Đang chờ xác nhận";
  if (s === "confirmed") return "Đã xác nhận";
  if (s === "cancelled") return "Đã hủy";
  if (s === "completed") return "Hoàn thành";
  if (s === "checked_in") return "Đã check-in";
  return status || "—";
};

const formatVnd = (n) => {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return `${Number(n).toLocaleString("vi-VN")} VNĐ`;
};

const maskPhone = (phone) => {
  if (!phone || String(phone).length < 6) return "—";
  const s = String(phone).replace(/\s/g, "");
  if (s.length <= 6) return `${s.slice(0, 2)} ****`;
  return `${s.slice(0, 3)} **** ${s.slice(-3)}`;
};

const formatSlotTime = (start, end) => {
  if (!start) return "—";
  const pad = (t) => (t && t.length >= 5 ? t.slice(0, 5) : t);
  const a = pad(start);
  const b = end ? pad(end) : null;
  return b ? `${a} – ${b}` : a;
};

const SectionBlock = ({ iconClass, title, children }) => (
  <section className="flex flex-col gap-4">
    <div className="flex items-center gap-2.5">
      <span
        className="w-1 self-stretch min-h-[22px] rounded-full shrink-0 bg-[#4A90E2]"
      />
      <i className={`fa-solid ${iconClass} text-lg text-[#4A90E2]`} />
      <h2 className="text-base font-bold text-slate-900 tracking-tight">{title}</h2>
    </div>
    {children}
  </section>
);

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [patientProfile, setPatientProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleSlots, setRescheduleSlots] = useState([]);
  const [rescheduleSlotsLoading, setRescheduleSlotsLoading] = useState(false);
  const [rescheduleSubmitting, setRescheduleSubmitting] = useState(false);
  const [selectedRescheduleSlot, setSelectedRescheduleSlot] = useState(null);

  const refreshAppointment = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const res = await getListAppointmentsByCurrentUserId(undefined, user.id);
    const list = normalizeAppointmentList(res.data);
    const found = list.find((a) => String(a.appointment_id) === String(id));
    setAppointment(found || null);
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          if (isMounted) setLoading(false);
          return;
        }

        const [apptRes, profileRes] = await Promise.allSettled([
          getListAppointmentsByCurrentUserId(undefined, user.id),
          getPatientById(user.id),
        ]);

        if (apptRes.status === "fulfilled") {
          const list = normalizeAppointmentList(apptRes.value.data);
          const found = list.find((a) => String(a.appointment_id) === String(id));
          if (isMounted) setAppointment(found || null);
        } else {
          console.error("Appointment detail:", apptRes.reason);
          toast.error("Không thể tải chi tiết lịch hẹn");
        }

        if (profileRes.status === "fulfilled") {
          const raw = profileRes.value.data?.data ?? profileRes.value.data ?? null;
          if (isMounted) setPatientProfile(raw);
        }
      } catch (err) {
        console.error("Appointment detail:", err);
        toast.error("Không thể tải chi tiết lịch hẹn");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const userFromAppt = appointment?.Patients?.Users;
  const userFromProfile = patientProfile?.Users;

  const displayName =
    userFromAppt?.full_name || userFromProfile?.full_name || "Bệnh nhân";
  const displayEmail = userFromAppt?.email || userFromProfile?.email || "—";
  const patientId = appointment?.Patients?.patient_id ?? patientProfile?.patient_id;
  const patientCode = patientId ? `BN-${String(patientId).slice(-5).padStart(5, "0")}` : "—";
  const gender =
    GENDER_LABEL[patientProfile?.gender] ||
    GENDER_LABEL[userFromProfile?.gender] ||
    "—";
  const phone = maskPhone(userFromProfile?.phone_number);
  const address = patientProfile?.address || "—";
  const avatarUrl =
    userFromProfile?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D8ABC&color=fff`;

  const slotDate =
    appointment?.appointment_date ||
    appointment?.DoctorSlots?.slot_date ||
    appointment?.created_at;

  const formattedDateShort = slotDate
    ? new Date(slotDate).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    : "—";

  const timeRange = formatSlotTime(
    appointment?.DoctorSlots?.start_time,
    appointment?.DoctorSlots?.end_time
  );

  const lastUpdated = appointment?.created_at
    ? new Date(appointment.created_at).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    : "—";

  const totalPrice = Number(appointment?.total_price) || 0;
  const depositPaid = Number(appointment?.deposit_paid) || 0;
  const balance = Math.max(0, totalPrice - depositPaid);

  const departmentName = appointment?.ClinicServices?.Departments?.name || "—";
  const departmentId = appointment?.ClinicServices?.Departments?.department_id;
  const serviceName = appointment?.ClinicServices?.name || "—";
  const doctorName = appointment?.Doctors?.Users?.full_name || "—";

  useEffect(() => {
    if (!rescheduleOpen || !departmentId) return;

    let cancelled = false;
    const loadSlots = async () => {
      setRescheduleSlotsLoading(true);
      setSelectedRescheduleSlot(null);
      try {
        const res = await getAvailableDoctorSlots(departmentId);
        const raw = res.data?.data ?? res.data ?? [];
        const arr = Array.isArray(raw) ? raw : [];
        if (!cancelled) setRescheduleSlots(arr);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setRescheduleSlots([]);
          toast.error("Không thể tải khung giờ trống");
        }
      } finally {
        if (!cancelled) setRescheduleSlotsLoading(false);
      }
    };

    loadSlots();
    return () => {
      cancelled = true;
    };
  }, [rescheduleOpen, departmentId]);

  const statusLower = (appointment?.status || "").toLowerCase();
  const canCancelAppointment =
    appointment && !["cancelled", "completed"].includes(statusLower);
  const canRescheduleAppointment =
    appointment && !["completed"].includes(statusLower);

  const handleCancel = async () => {
    if (!appointment?.appointment_id) return;
    if (!window.confirm("Bạn có chắc muốn hủy lịch hẹn này?")) return;
    setCancelLoading(true);
    try {
      await cancelAppointment(appointment.appointment_id);
      toast.success("Đã hủy lịch hẹn");
      navigate("/patient/booking");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Không thể hủy lịch hẹn");
    } finally {
      setCancelLoading(false);
    }
  };

  const openRescheduleModal = () => {
    if (!departmentId) {
      toast.error("Không xác định được khoa — không thể đổi lịch");
      return;
    }
    setRescheduleOpen(true);
  };

  const handleConfirmReschedule = async () => {
    if (!appointment?.appointment_id || !selectedRescheduleSlot?.slot_id) {
      toast.error("Vui lòng chọn khung giờ mới");
      return;
    }
    const currentSlotId = appointment?.DoctorSlots?.slot_id;
    const isCancelledAppointment = (appointment?.status || "").toLowerCase() === "cancelled";
    if (
      !isCancelledAppointment &&
      currentSlotId &&
      String(selectedRescheduleSlot.slot_id) === String(currentSlotId)
    ) {
      toast.error("Vui lòng chọn khung giờ khác với lịch hiện tại");
      return;
    }
    setRescheduleSubmitting(true);
    try {
      await rescheduleAppointment(appointment.appointment_id, {
        new_slot_id: selectedRescheduleSlot.slot_id,
        doctor_id: selectedRescheduleSlot.doctor_id,
      });
      toast.success("Đã đặt lại lịch thành công");
      setRescheduleOpen(false);
      setSelectedRescheduleSlot(null);
      await refreshAppointment();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Không thể đổi lịch hẹn");
    } finally {
      setRescheduleSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center px-4">
        <div className="text-center">
          <i className="fa-solid fa-calendar-xmark text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-600 font-medium">Không tìm thấy lịch hẹn</p>
          <button
            type="button"
            onClick={() => navigate("/patient/booking")}
            className="mt-4 font-semibold hover:underline"
            style={{ color: PRIMARY }}
          >
            ← Quay lại đặt lịch
          </button>
        </div>
      </div>
    );
  }

  const sortedRescheduleSlots = [...rescheduleSlots].sort((a, b) => {
    const d = (a.slot_date || "").localeCompare(b.slot_date || "");
    if (d !== 0) return d;
    return (a.start_time || "").localeCompare(b.start_time || "");
  });

  const slotDoctorLabel = (slot) => {
    const u = slot?.Doctors?.Users;
    const name = Array.isArray(u) ? u[0]?.full_name : u?.full_name;
    return name || "Bác sĩ";
  };

  const formatSlotRowDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("vi-VN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      : "—";

  return (
    <div className="w-full min-h-full box-border bg-[#f8f9fa] px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans text-slate-800 antialiased">
      <div className="w-full max-w-[min(100%,80rem)] mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 text-sm text-slate-500 hover:text-slate-700 flex items-center gap-2 transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-xs"></i>
          Quay lại
        </button>

        <h1 className="text-2xl font-bold text-slate-900 mb-6 md:mb-8 tracking-tight">Chi tiết lịch hẹn</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 lg:gap-6 items-start">
          {/* Sidebar */}
          <aside className="flex flex-col gap-4">
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.06)] p-5">
              <div className="flex flex-col items-center text-center">
                <img
                  src={avatarUrl}
                  alt=""
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-100 mb-3"
                />
                <p className="font-bold text-slate-900 text-lg leading-tight">{displayName}</p>
                {appointment?.priority === true ? (
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                    Bệnh nhân ưu tiên
                  </span>
                ) : null}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3.5 text-sm">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mã BN</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{patientCode}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Giới tính</p>
                  <p className="font-medium text-slate-900 mt-0.5">{gender}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                  <p className="text-slate-800 text-[13px] break-all mt-0.5">{displayEmail}</p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <i className="fa-solid fa-phone text-slate-400 w-4 text-center"></i>
                  <span>{phone}</span>
                </p>
                <p className="flex items-start gap-2">
                  <i className="fa-solid fa-location-dot text-slate-400 w-4 text-center mt-0.5"></i>
                  <span>{address}</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.06)] p-5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Trạng thái</p>
              <p className="text-sm text-slate-800 font-medium">{statusLabelVi(appointment.status)}</p>
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 border border-slate-100/80 px-3 py-2.5 text-xs text-slate-600">
                <i className="fa-regular fa-clock mt-0.5 text-slate-400"></i>
                <span>Cập nhật lần cuối: {lastUpdated}</span>
              </div>
            </div>
          </aside>

          {/* Main — một khối trắng, nội dung phân tầng bằng viền slate */}
          <main className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.06)] p-6 md:p-8 flex flex-col gap-8">
            <SectionBlock iconClass="fa-stethoscope" title="Thông tin chuyên khoa">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="rounded-lg border border-slate-100 bg-white p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Bác sĩ phụ trách
                  </p>
                  <p className="flex items-start gap-2 text-sm font-semibold text-slate-900">
                    <i className="fa-solid fa-user-doctor mt-0.5 text-[#4A90E2]"></i>
                    <span>BS. {doctorName}</span>
                  </p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-white p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Khoa / Phòng ban
                  </p>
                  <p className="flex items-start gap-2 text-sm font-semibold text-slate-900">
                    <i className="fa-solid fa-building mt-0.5 text-[#4A90E2]"></i>
                    <span>{departmentName}</span>
                  </p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Dịch vụ yêu cầu
                  </p>
                  <p className="flex items-start gap-2 text-sm font-semibold text-slate-900">
                    <i className="fa-solid fa-file-medical mt-0.5 text-[#4A90E2]"></i>
                    <span>{serviceName}</span>
                  </p>
                </div>
              </div>
            </SectionBlock>

            <SectionBlock iconClass="fa-calendar-days" title="Lịch hẹn chi tiết">
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,200px)_1fr] gap-4">
                <div className="space-y-3">
                  <div className="rounded-xl border border-sky-100 bg-sky-50/80 p-4 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ngày hẹn</p>
                    <p className="text-2xl font-bold text-[#4A90E2] tabular-nums">
                      {formattedDateShort}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white p-4 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Khung giờ</p>
                    <p className="text-2xl font-bold text-slate-900 tabular-nums">{timeRange}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-5 min-h-[140px]">
                  <p className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                    <i className="fa-solid fa-circle-info text-[#4A90E2]"></i>
                    Lý do thăm khám
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {appointment.currentSymptom?.trim()
                      ? appointment.currentSymptom
                      : "Chưa ghi nhận lý do khám cụ thể. Vui lòng liên hệ lễ tân nếu cần bổ sung."}
                  </p>
                </div>
              </div>
            </SectionBlock>

            <SectionBlock iconClass="fa-wallet" title="Tình trạng thanh toán">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-xl border border-slate-100 overflow-hidden bg-white">
                <div className="p-5 md:border-r border-slate-100">
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between gap-4">
                      <span className="text-slate-500">Tạm tính dịch vụ</span>
                      <span className="font-medium text-slate-900 tabular-nums">{formatVnd(totalPrice)}</span>
                    </li>
                    <li className="flex justify-between gap-4">
                      <span className="text-slate-500">Đã đặt cọc (Online)</span>
                      <span className="font-medium text-emerald-700 tabular-nums">− {formatVnd(depositPaid)}</span>
                    </li>
                  </ul>
                  <div className="my-4 border-t border-dashed border-slate-200" />
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="text-sm font-semibold text-slate-700">Số tiền còn lại</span>
                    <span className="text-xl font-bold text-red-600 tabular-nums">{formatVnd(balance)}</span>
                  </div>
                </div>
                <div className="p-5 bg-slate-50 border-t md:border-t-0 border-slate-100 flex flex-col justify-center gap-4 text-sm text-slate-600">
                  <p className="flex gap-3">
                    <i className="fa-solid fa-circle-info mt-0.5 shrink-0 text-[#4A90E2]"></i>
                    <span>Vui lòng hoàn tất thanh toán tại quầy lễ tân trước giờ khám nếu còn số dư.</span>
                  </p>
                  <p className="flex gap-3">
                    <i className="fa-solid fa-shield-halved mt-0.5 shrink-0 text-emerald-600"></i>
                    <span>Giao dịch trực tuyến được bảo mật qua hệ thống SmartHealth.</span>
                  </p>
                </div>
              </div>
            </SectionBlock>

            <div className="rounded-lg bg-slate-50 border border-slate-100 px-4 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-slate-600 flex items-start gap-2">
                <i className="fa-solid fa-circle-info mt-0.5 text-slate-400"></i>
                <span>Vui lòng mang theo CCCD khi đi thăm khám.</span>
              </p>
              <div className="flex flex-wrap gap-3 justify-end shrink-0 items-center">
                {canCancelAppointment ? (
                  <button
                    type="button"
                    disabled={cancelLoading}
                    onClick={handleCancel}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-red-500 text-red-600 text-sm font-semibold hover:bg-red-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    {cancelLoading ? (
                      <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fa-solid fa-xmark"></i>
                    )}
                    Hủy lịch hẹn
                  </button>
                ) : null}
                {canRescheduleAppointment ? (
                  <button
                    type="button"
                    onClick={openRescheduleModal}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-semibold shadow-sm hover:opacity-95 transition-opacity"
                    style={{ backgroundColor: PRIMARY }}
                  >
                    <i className="fa-regular fa-calendar-days"></i>
                    {statusLower === "cancelled" ? "Đặt lại lịch" : "Thay đổi lịch"}
                  </button>
                ) : (
                  <span className="text-sm text-slate-500">Lịch khám đã hoàn thành — không thể thao tác thêm.</span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
              <p className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                <i className="fa-solid fa-circle-exclamation text-amber-500"></i>
                Hướng dẫn trước buổi khám
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Nếu có chỉ định xét nghiệm máu, bạn nên nhịn ăn khoảng 8 giờ trước khi lấy mẫu. Vui lòng có mặt
                tại phòng khám ít nhất 15 phút trước giờ hẹn để làm thủ tục.
              </p>
            </div>
          </main>
        </div>
      </div>

      {rescheduleOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reschedule-modal-title"
          onClick={() => !rescheduleSubmitting && setRescheduleOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(15,23,42,0.2)] max-w-lg w-full max-h-[85vh] flex flex-col border border-slate-200/90"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
              <div>
                <h2 id="reschedule-modal-title" className="text-lg font-bold text-slate-900">
                  Đặt lại lịch khám
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Chọn khung giờ trống trong khoa — lịch sẽ chuyển về trạng thái chờ xác nhận.
                </p>
              </div>
              <button
                type="button"
                disabled={rescheduleSubmitting}
                onClick={() => setRescheduleOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                aria-label="Đóng"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="px-5 py-3 overflow-y-auto flex-1 min-h-0">
              {rescheduleSlotsLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : sortedRescheduleSlots.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  Hiện không còn khung giờ trống phù hợp. Vui lòng thử lại sau hoặc liên hệ lễ tân.
                </p>
              ) : (
                <ul className="space-y-2">
                  {sortedRescheduleSlots.map((slot) => {
                    const selected =
                      selectedRescheduleSlot && selectedRescheduleSlot.slot_id === slot.slot_id;
                    return (
                      <li key={slot.slot_id}>
                        <button
                          type="button"
                          onClick={() => setSelectedRescheduleSlot(slot)}
                          className={`w-full text-left rounded-lg border px-3 py-3 transition-colors ${selected
                            ? "border-sky-300 bg-sky-50 ring-1 ring-sky-200/80"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                        >
                          <div className="flex justify-between gap-2 items-start">
                            <span className="font-semibold text-slate-900 text-sm">
                              {formatSlotRowDate(slot.slot_date)}
                            </span>
                            <span className="text-sm font-bold text-[#4A90E2] shrink-0 tabular-nums">
                              {slot.start_time} – {slot.end_time}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            <i className="fa-solid fa-user-doctor mr-1"></i>
                            BS. {slotDoctorLabel(slot)}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="px-5 py-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
              <button
                type="button"
                disabled={rescheduleSubmitting}
                onClick={() => setRescheduleOpen(false)}
                className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={rescheduleSubmitting || !selectedRescheduleSlot || rescheduleSlotsLoading}
                onClick={handleConfirmReschedule}
                className="px-4 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                style={{ backgroundColor: PRIMARY }}
              >
                {rescheduleSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check"></i>
                    Xác nhận đổi lịch
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AppointmentDetail;
