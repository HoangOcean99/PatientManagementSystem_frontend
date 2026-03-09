import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiUser,
  FiCalendar,
  FiPhone,
  FiFileText,
  FiActivity,
  FiClipboard,
  FiPlus,
  FiTrash2,
  FiSave,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiPlay,
  FiLoader,
  FiAlertCircle,
  FiHeart,
  FiSend,
  FiDownload,
} from 'react-icons/fi';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import { getAppointmentsByDoctorId } from '../../api/doctorApi';
import medicalRecordApi from '../../api/medicalRecordApi';
import labOrderApi from '../../api/labOrderApi';
import './ExaminationPage.css';

// ===== HELPERS =====
const getGenderLabel = (g) => ({ male: 'Nam', female: 'Nữ', other: 'Khác' }[g] || g);
const calculateAge = (dob) => {
  if (!dob) return '';
  const today = new Date();
  const b = new Date(dob);
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
  return age;
};
const getInitials = (name) =>
  name ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(-2) : '?';

const STATUS_MAP = {
  pending:    { label: 'Chờ xác nhận', color: 'status--ready',  icon: FiLoader },
  confirmed:  { label: 'Đã xác nhận',  color: 'status--ready',  icon: FiLoader },
  checked_in: { label: 'Đã check-in',  color: 'status--ready',  icon: FiLoader },
  in_progress: { label: 'Đang khám',    color: 'status--active', icon: FiPlay },
  completed:  { label: 'Hoàn tất',      color: 'status--done',   icon: FiCheckCircle },
};

const LAB_STATUS_MAP = {
  draft: { label: 'Chưa gửi', color: 'lab-status--draft', icon: FiFileText },
  ordered: { label: 'Đã gửi', color: 'lab-status--sent', icon: FiSend },
  processing: { label: 'Đang xử lý', color: 'lab-status--processing', icon: FiLoader },
  completed: { label: 'Có kết quả', color: 'lab-status--completed', icon: FiCheckCircle },
};

// ===== ANIMATION VARIANTS =====
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

// ===== MINI CALENDAR COMPONENT =====
function MiniCalendar({ selectedDate, onSelect }) {
  const [viewDate, setViewDate] = useState(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const today = new Date();
  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate();
  const firstDay = new Date(viewDate.year, viewDate.month, 1).getDay();
  const monthNames = [
    'Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
    'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12',
  ];

  const prevMonth = () => {
    setViewDate((v) => {
      if (v.month === 0) return { year: v.year - 1, month: 11 };
      return { ...v, month: v.month - 1 };
    });
  };

  const nextMonth = () => {
    setViewDate((v) => {
      if (v.month === 11) return { year: v.year + 1, month: 0 };
      return { ...v, month: v.month + 1 };
    });
  };

  const buildCalendarDays = () => {
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  };

  const isToday = (day) =>
    day &&
    viewDate.year === today.getFullYear() &&
    viewDate.month === today.getMonth() &&
    day === today.getDate();

  const isSelected = (day) => {
    if (!day || !selectedDate) return false;
    const sel = new Date(selectedDate);
    return (
      viewDate.year === sel.getFullYear() &&
      viewDate.month === sel.getMonth() &&
      day === sel.getDate()
    );
  };

  const isPast = (day) => {
    if (!day) return false;
    const d = new Date(viewDate.year, viewDate.month, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < todayStart;
  };

  const handleDayClick = (day) => {
    if (!day || isPast(day)) return;
    const dateStr = `${viewDate.year}-${String(viewDate.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onSelect(dateStr === selectedDate ? '' : dateStr);
  };

  return (
    <div className="ex-calendar">
      <div className="ex-calendar__nav">
        <button className="ex-calendar__nav-btn" onClick={prevMonth} type="button">
          <FiChevronLeft size={16} />
        </button>
        <span className="ex-calendar__month">
          {monthNames[viewDate.month]} {viewDate.year}
        </span>
        <button className="ex-calendar__nav-btn" onClick={nextMonth} type="button">
          <FiChevronRight size={16} />
        </button>
      </div>
      <div className="ex-calendar__grid">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d) => (
          <div key={d} className="ex-calendar__weekday">{d}</div>
        ))}
        {buildCalendarDays().map((day, i) => (
          <button
            key={i}
            type="button"
            className={`ex-calendar__day ${!day ? 'ex-calendar__day--empty' : ''} ${isToday(day) ? 'ex-calendar__day--today' : ''} ${isSelected(day) ? 'ex-calendar__day--selected' : ''} ${isPast(day) ? 'ex-calendar__day--past' : ''}`}
            onClick={() => handleDayClick(day)}
            disabled={!day || isPast(day)}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}

// ===== MAIN COMPONENT =====
const ExaminationPage = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();

  // ===== PAGE-LEVEL STATES =====
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  // ===== APPOINTMENT & PATIENT DATA (from DoctorSchedulePage navigation) =====
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);

  // ===== MEDICAL RECORD =====
  const [recordId, setRecordId] = useState(null);
  const [recordStatus, setRecordStatus] = useState(null); // null = chưa có record

  // ===== FORM STATE =====
  const [symptoms, setSymptoms] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  // Prescriptions (dynamic list — local, gửi kèm khi save/complete)
  const [prescriptions, setPrescriptions] = useState([
    { id: Date.now(), medication_name: '', dosage: '', instructions: '', reminder_schedule: '' },
  ]);

  // LabOrders (dynamic list)
  const [labOrders, setLabOrders] = useState([]);

  // Follow-up date
  const [followUpDate, setFollowUpDate] = useState('');

  // Action loading states
  const [starting, setStarting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [labSending, setLabSending] = useState(false);

  // ===== FETCH DATA ON MOUNT =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        setPageLoading(true);
        setPageError(null);

        // 1. Lấy thông tin appointment + patient từ danh sách appointments của doctor
        // TODO: Lấy doctor_id từ auth context thay vì hardcode
        const doctorId = localStorage.getItem('doctor_id') || '85be2ff0-0b7d-489f-a63a-9a0538338773';
        const apptRes = await getAppointmentsByDoctorId(doctorId);
        const allAppointments = apptRes.data?.data || apptRes.data || [];

        const currentAppt = allAppointments.find(
          (a) => a.appointment_id === appointmentId
        );

        if (!currentAppt) {
          setPageError('Không tìm thấy lịch hẹn này.');
          setPageLoading(false);
          return;
        }

        // Map appointment data — time lấy từ DoctorSlots qua slot_id FK
        setAppointment({
          appointment_id: currentAppt.appointment_id,
          patient_id: currentAppt.Patients?.patient_id || currentAppt.patient_id,
          doctor_id: currentAppt.doctor_id || doctorId,
          service_id: currentAppt.service_id,
          // Lấy ngày và giờ từ nested DoctorSlots
          appointment_date:
            currentAppt.DoctorSlots?.slot_date ||
            currentAppt.DoctorSlot?.slot_date ||
            currentAppt.appointment_date,
          start_time:
            currentAppt.DoctorSlots?.start_time ||
            currentAppt.DoctorSlot?.start_time ||
            currentAppt.start_time,
          end_time:
            currentAppt.DoctorSlots?.end_time ||
            currentAppt.DoctorSlot?.end_time ||
            currentAppt.end_time,
          status: currentAppt.status,
          service_name: currentAppt.ClinicServices?.name || '',
          total_price: currentAppt.total_price,
          deposit_required: currentAppt.deposit_required,
          deposit_paid: currentAppt.deposit_paid,
        });

        // Map patient data
        setPatient({
          patient_id: currentAppt.Patients?.patient_id || currentAppt.patient_id,
          full_name: currentAppt.Patients?.Users?.full_name || 'N/A',
          email: currentAppt.Patients?.Users?.email || '',
          phone_number: currentAppt.Patients?.Users?.phone_number || '',
          avatar_url: currentAppt.Patients?.Users?.avatar_url || null,
          dob: currentAppt.Patients?.dob || '',
          gender: currentAppt.Patients?.gender || '',
          address: currentAppt.Patients?.address || '',
          allergies: currentAppt.Patients?.allergies || '',
          medical_history_summary: currentAppt.Patients?.medical_history_summary || '',
        });

        // 2. Kiểm tra đã có medical record cho appointment này chưa
        try {
          const recordRes = await medicalRecordApi.getMedicalRecordByAppointmentId(appointmentId);
          const record = recordRes.data?.data || recordRes.data;

          if (record && record.record_id) {
            // Đã có record → load data vào form
            setRecordId(record.record_id);
            setRecordStatus(record.status || 'in_progress');
            setSymptoms(record.symptoms || '');
            setDoctorNotes(record.doctor_notes || '');
            setDiagnosis(record.diagnosis || '');

            // Load prescriptions nếu có
            if (record.Prescriptions && record.Prescriptions.length > 0) {
              setPrescriptions(
                record.Prescriptions.map((p) => ({
                  id: p.prescription_id || Date.now() + Math.random(),
                  prescription_id: p.prescription_id,
                  medication_name: p.medication_name || '',
                  dosage: p.dosage || '',
                  instructions: p.instructions || '',
                  reminder_schedule: p.reminder_schedule || '',
                }))
              );
            }

            // Load lab orders nếu có
            if (record.LabOrders && record.LabOrders.length > 0) {
              setLabOrders(
                record.LabOrders.map((l) => ({
                  id: l.lab_order_id || Date.now() + Math.random(),
                  lab_order_id: l.lab_order_id,
                  test_name: l.test_name || '',
                  status: l.status || 'ordered',
                  result_summary: l.result_summary || '',
                  result_file_url: l.result_file_url || '',
                }))
              );
            }

            // Cập nhật status appointment nếu record đang in_progress
            if (currentAppt.status === 'in_progress' || record.status === 'in_progress') {
              setAppointment((prev) => ({ ...prev, status: 'in_progress' }));
            }
            if (record.status === 'completed' || currentAppt.status === 'completed') {
              setAppointment((prev) => ({ ...prev, status: 'completed' }));
              setRecordStatus('completed');
            }
          }
        } catch (recordErr) {
          // 404 = chưa có record → bình thường, không phải lỗi
          if (recordErr.response?.status !== 404) {
            console.warn('Lỗi khi kiểm tra medical record:', recordErr);
          }
        }
      } catch (err) {
        console.error('Failed to load examination data:', err);
        setPageError('Không thể tải dữ liệu khám bệnh. Vui lòng thử lại.');
      } finally {
        setPageLoading(false);
      }
    };

    if (appointmentId) {
      fetchData();
    }
  }, [appointmentId]);

  // ===== HANDLERS =====

  // Bắt đầu khám → POST /medical-record/start
  const handleStartExamination = async () => {
    if (!appointment) return;
    try {
      setStarting(true);
      const payload = {
        appointment_id: appointment.appointment_id,
        doctor_id: appointment.doctor_id,
        patient_id: appointment.patient_id,
      };

      const res = await medicalRecordApi.startExamination(payload);
      const record = res.data?.data || res.data;

      setRecordId(record.record_id);
      setRecordStatus('in_progress');
      setAppointment((prev) => ({ ...prev, status: 'in_progress' }));

      alert('Đã bắt đầu ca khám!');
    } catch (err) {
      console.error('Lỗi khi bắt đầu khám:', err);
      const msg = err.response?.data?.message || 'Không thể bắt đầu ca khám.';
      alert(msg);
    } finally {
      setStarting(false);
    }
  };

  // -- Prescriptions --
  const addPrescription = () => {
    setPrescriptions((prev) => [
      ...prev,
      { id: Date.now(), medication_name: '', dosage: '', instructions: '', reminder_schedule: '' },
    ]);
  };

  const removePrescription = (id) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePrescription = (id, field, value) => {
    setPrescriptions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // -- Lab Orders --
  const addLabOrder = () => {
    setLabOrders((prev) => [
      ...prev,
      { id: Date.now(), test_name: '', status: 'draft' },
    ]);
  };

  const removeLabOrder = (id) => {
    setLabOrders((prev) => prev.filter((l) => l.id !== id));
  };

  const updateLabOrder = (id, value) => {
    setLabOrders((prev) =>
      prev.map((l) => (l.id === id ? { ...l, test_name: value } : l))
    );
  };

  // Gửi xét nghiệm → POST /lab-orders
  const handleSendLabOrders = async () => {
    const draftOrders = labOrders.filter(
      (l) => l.test_name.trim() && l.status === 'draft'
    );
    if (draftOrders.length === 0) {
      alert('Không có xét nghiệm mới nào để gửi.');
      return;
    }
    if (!recordId) {
      alert('Vui lòng bắt đầu khám trước khi gửi xét nghiệm.');
      return;
    }

    try {
      setLabSending(true);
      const payload = {
        record_id: recordId,
        doctor_id: appointment.doctor_id,
        lab_orders: draftOrders.map((l) => ({
          test_name: l.test_name.trim(),
        })),
      };

      const res = await labOrderApi.createLabOrders(payload);
      const createdOrders = res.data?.data || res.data || [];

      // Cập nhật status từ draft → ordered, gán lab_order_id từ server
      setLabOrders((prev) =>
        prev.map((l) => {
          if (l.status === 'draft' && l.test_name.trim()) {
            const serverOrder = Array.isArray(createdOrders)
              ? createdOrders.find((s) => s.test_name === l.test_name.trim())
              : null;
            return {
              ...l,
              status: 'ordered',
              lab_order_id: serverOrder?.lab_order_id || l.id,
            };
          }
          return l;
        })
      );

      alert('Đã gửi yêu cầu xét nghiệm thành công!');
    } catch (err) {
      console.error('Lỗi khi gửi xét nghiệm:', err);
      const msg = err.response?.data?.message || 'Không thể gửi yêu cầu xét nghiệm.';
      alert(msg);
    } finally {
      setLabSending(false);
    }
  };

  const hasDraftLabs = labOrders.some(
    (l) => l.status === 'draft' && l.test_name.trim()
  );

  // Lưu nháp → PATCH /medical-record/update/:recordId
  const handleSaveDraft = async () => {
    if (!recordId) {
      alert('Vui lòng bắt đầu khám trước khi lưu.');
      return;
    }

    try {
      setSaving(true);
      const payload = buildPayload();
      await medicalRecordApi.updateMedicalRecord(recordId, payload);
      alert('Đã lưu nháp thành công!');
    } catch (err) {
      console.error('Lỗi khi lưu nháp:', err);
      const msg = err.response?.data?.message || 'Không thể lưu nháp.';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  // Hoàn tất → POST /medical-record/complete
  const handleComplete = async () => {
    if (!diagnosis.trim()) {
      alert('Vui lòng nhập chẩn đoán trước khi hoàn tất.');
      return;
    }
    if (!recordId) {
      alert('Vui lòng bắt đầu khám trước khi hoàn tất.');
      return;
    }

    // Kiểm tra có lab draft chưa gửi không
    if (hasDraftLabs) {
      const confirmSend = window.confirm(
        'Còn xét nghiệm chưa gửi. Bạn có muốn bỏ qua và hoàn tất?'
      );
      if (!confirmSend) return;
    }

    try {
      setCompleting(true);

      // Lưu data trước
      const updatePayload = buildPayload();
      await medicalRecordApi.updateMedicalRecord(recordId, updatePayload);

      // Hoàn tất
      const completePayload = {
        record_id: recordId,
        appointment_id: appointment.appointment_id,
      };
      await medicalRecordApi.completeExamination(completePayload);

      setRecordStatus('completed');
      setAppointment((prev) => ({ ...prev, status: 'completed' }));
      alert('Hoàn tất ca khám thành công!');
    } catch (err) {
      console.error('Lỗi khi hoàn tất:', err);
      const msg = err.response?.data?.message || 'Không thể hoàn tất ca khám.';
      alert(msg);
    } finally {
      setCompleting(false);
    }
  };

  const buildPayload = () => ({
    doctor_id: appointment.doctor_id,
    symptoms: symptoms.trim(),
    diagnosis: diagnosis.trim(),
    doctor_notes: doctorNotes.trim(),
    prescriptions: prescriptions
      .filter((p) => p.medication_name.trim())
      .map((p) => ({
        medication_name: p.medication_name.trim(),
        dosage: p.dosage.trim(),
        instructions: p.instructions.trim(),
        reminder_schedule: p.reminder_schedule,
      })),
  });

  const viewPatientProfile = () => {
    if (patient?.patient_id) {
      navigate(`/doctor/patient/${patient.patient_id}`);
    }
  };

  // Polling lab orders mỗi 30s để cập nhật trạng thái
  useEffect(() => {
    if (!recordId || recordStatus === 'completed') return;

    const hasNonCompletedLabs = labOrders.some(
      (l) => l.status === 'ordered' || l.status === 'processing'
    );
    if (!hasNonCompletedLabs) return;

    const interval = setInterval(async () => {
      try {
        const res = await labOrderApi.getLabOrdersByRecordId(recordId);
        const serverLabs = res.data?.data || res.data || [];

        if (Array.isArray(serverLabs) && serverLabs.length > 0) {
          setLabOrders((prev) => {
            const draftLabs = prev.filter((l) => l.status === 'draft');
            const updatedFromServer = serverLabs.map((sl) => ({
              id: sl.lab_order_id,
              lab_order_id: sl.lab_order_id,
              test_name: sl.test_name,
              status: sl.status,
              result_summary: sl.result_summary || '',
              result_file_url: sl.result_file_url || '',
            }));
            return [...updatedFromServer, ...draftLabs];
          });
        }
      } catch (err) {
        console.warn('Polling lab orders failed:', err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [recordId, recordStatus, labOrders]);

  // ===== DERIVED STATE =====
  const isExamStarted = appointment?.status === 'in_progress';
  const isCompleted = appointment?.status === 'completed' || recordStatus === 'completed';

  const statusInfo = STATUS_MAP[appointment?.status] || STATUS_MAP.checked_in || STATUS_MAP.pending;
  const StatusIcon = statusInfo.icon;

  const formatFollowUp = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  };

  // ===== LOADING STATE =====
  if (pageLoading) {
    return (
      <div className="ex-layout">
        <DoctorSidebar activePage="examination" />
        <main className="ex-main">
          <div className="ex-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
              <FiLoader size={32} className="ex-spin" style={{ color: '#3b82f6', marginBottom: 16 }} />
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Đang tải dữ liệu khám bệnh...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ===== ERROR STATE =====
  if (pageError || !appointment || !patient) {
    return (
      <div className="ex-layout">
        <DoctorSidebar activePage="examination" />
        <main className="ex-main">
          <div className="ex-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
              <FiAlertCircle size={32} style={{ color: '#ef4444', marginBottom: 16 }} />
              <p style={{ color: '#ef4444', fontSize: '0.95rem', marginBottom: 16 }}>
                {pageError || 'Không tìm thấy dữ liệu.'}
              </p>
              <button
                className="ex-btn ex-btn--outline"
                onClick={() => navigate('/doctor/schedule')}
                type="button"
              >
                <FiArrowLeft size={16} />
                Quay lại lịch khám
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="ex-layout">
      {/* ===== SIDEBAR ===== */}
      <DoctorSidebar activePage="examination" />

      {/* ===== MAIN ===== */}
      <main className="ex-main">
        <motion.div
          className="ex-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ===== PATIENT BANNER ===== */}
          <motion.div className="ex-patient-banner" variants={itemVariants}>
            <div className="ex-patient-banner__left">
              <div className="ex-patient-banner__avatar">
                {patient.avatar_url ? (
                  <img src={patient.avatar_url} alt={patient.full_name} />
                ) : (
                  <span className="ex-patient-banner__initials">
                    {getInitials(patient.full_name)}
                  </span>
                )}
              </div>
              <div className="ex-patient-banner__info">
                <h1 className="ex-patient-banner__name">{patient.full_name}</h1>
                <div className="ex-patient-banner__meta">
                  <span className="ex-badge">ID: {patient.patient_id?.slice(0, 8)}...</span>
                  <span className="ex-meta-sep">•</span>
                  <span>Tuổi: {calculateAge(patient.dob)}</span>
                  <span className="ex-meta-sep">•</span>
                  <span>Giới tính: {getGenderLabel(patient.gender)}</span>
                </div>
                {patient.allergies && (
                  <div className="ex-patient-banner__allergy">
                    <FiAlertCircle size={14} />
                    <span>Dị ứng: {patient.allergies}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="ex-patient-banner__actions">
              <button
                className="ex-btn ex-btn--outline"
                onClick={viewPatientProfile}
                type="button"
              >
                <FiEye size={16} />
                Xem hồ sơ
              </button>

              <div className={`ex-status-badge ${statusInfo.color}`}>
                <StatusIcon size={14} />
                <span>{statusInfo.label}</span>
              </div>

              {/* Nút bắt đầu khám — chỉ hiện khi chưa có record */}
              {!recordId && !isCompleted && (
                <button
                  className="ex-btn ex-btn--primary"
                  onClick={handleStartExamination}
                  type="button"
                  disabled={starting}
                >
                  {starting ? (
                    <>
                      <FiLoader size={16} className="ex-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <FiPlay size={16} />
                      Bắt đầu khám
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>

          {/* ===== FORM AREA ===== */}
          <div className="ex-form-grid">
            {/* LEFT COLUMN */}
            <div className="ex-form-col ex-form-col--left">
              {/* Ghi chú & Thăm khám */}
              <motion.div className="ex-form-card" variants={itemVariants}>
                <div className="ex-form-card__header">
                  <FiFileText size={18} className="ex-form-card__icon" />
                  <h3 className="ex-form-card__title">Ghi chú & Thăm khám</h3>
                </div>
                <div className="ex-form-card__body">
                  <div className="ex-field">
                    <label className="ex-field__label" htmlFor="symptoms">
                      Triệu chứng
                    </label>
                    <textarea
                      id="symptoms"
                      className="ex-textarea"
                      placeholder="Ghi lại triệu chứng của bệnh nhân..."
                      rows={3}
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      disabled={isCompleted || !recordId}
                    />
                  </div>
                  <div className="ex-field">
                    <label className="ex-field__label" htmlFor="doctorNotes">
                      Ghi chú bác sĩ
                    </label>
                    <textarea
                      id="doctorNotes"
                      className="ex-textarea"
                      placeholder="Kết quả thăm khám, tình trạng bệnh nhân..."
                      rows={3}
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      disabled={isCompleted || !recordId}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Chẩn đoán */}
              <motion.div className="ex-form-card" variants={itemVariants}>
                <div className="ex-form-card__header">
                  <FiClipboard size={18} className="ex-form-card__icon" />
                  <h3 className="ex-form-card__title">Chẩn đoán</h3>
                </div>
                <div className="ex-form-card__body">
                  <input
                    type="text"
                    className="ex-input"
                    placeholder="Nhập chẩn đoán bệnh..."
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    disabled={isCompleted || !recordId}
                  />
                </div>
              </motion.div>

              {/* Đơn thuốc */}
              <motion.div className="ex-form-card" variants={itemVariants}>
                <div className="ex-form-card__header">
                  <FiHeart size={18} className="ex-form-card__icon" />
                  <h3 className="ex-form-card__title">Đơn thuốc</h3>
                  {!isCompleted && recordId && (
                    <button
                      className="ex-btn-add"
                      onClick={addPrescription}
                      type="button"
                    >
                      <FiPlus size={14} />
                      Thêm thuốc
                    </button>
                  )}
                </div>
                <div className="ex-form-card__body">
                  <AnimatePresence>
                    {prescriptions.map((p, idx) => (
                      <motion.div
                        key={p.id}
                        className="ex-prescription-item"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="ex-prescription-item__header">
                          <span className="ex-prescription-item__num">#{idx + 1}</span>
                          {!isCompleted && prescriptions.length > 1 && recordId && (
                            <button
                              className="ex-btn-delete"
                              onClick={() => removePrescription(p.id)}
                              type="button"
                              aria-label="Xóa thuốc"
                            >
                              <FiTrash2 size={16} color="#fff" />
                            </button>
                          )}
                        </div>
                        <div className="ex-prescription-item__fields">
                          <input
                            type="text"
                            className="ex-input"
                            placeholder="Tên thuốc"
                            value={p.medication_name}
                            onChange={(e) =>
                              updatePrescription(p.id, 'medication_name', e.target.value)
                            }
                            disabled={isCompleted || !recordId}
                          />
                          <div className="ex-prescription-item__row">
                            <input
                              type="text"
                              className="ex-input"
                              placeholder="Liều lượng (vd: 500mg)"
                              value={p.dosage}
                              onChange={(e) =>
                                updatePrescription(p.id, 'dosage', e.target.value)
                              }
                              disabled={isCompleted || !recordId}
                            />
                            <input
                              type="text"
                              className="ex-input"
                              placeholder="Hướng dẫn (vd: 2 lần/ngày)"
                              value={p.instructions}
                              onChange={(e) =>
                                updatePrescription(p.id, 'instructions', e.target.value)
                              }
                              disabled={isCompleted || !recordId}
                            />
                          </div>
                          <label className="ex-checkbox">
                            <input
                              type="checkbox"
                              checked={p.reminder_schedule === 'daily'}
                              onChange={(e) =>
                                updatePrescription(
                                  p.id,
                                  'reminder_schedule',
                                  e.target.checked ? 'daily' : ''
                                )
                              }
                              disabled={isCompleted || !recordId}
                            />
                            <span>Nhắc bệnh nhân uống thuốc</span>
                          </label>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {prescriptions.length === 0 && (
                    <p className="ex-empty-text">Chưa có thuốc nào được kê.</p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="ex-form-col ex-form-col--right">
              {/* Chỉ định xét nghiệm */}
              <motion.div className="ex-form-card ex-form-card--lab" variants={itemVariants}>
                <div className="ex-form-card__header ex-form-card__header--lab">
                  <FiActivity size={18} className="ex-form-card__icon" />
                  <h3 className="ex-form-card__title">Chỉ định xét nghiệm</h3>
                  {!isCompleted && recordId && (
                    <button
                      className="ex-btn-add"
                      onClick={addLabOrder}
                      type="button"
                    >
                      <FiPlus size={14} />
                      Thêm xét nghiệm
                    </button>
                  )}
                </div>
                <div className="ex-form-card__body">
                  <AnimatePresence>
                    {labOrders.map((l, idx) => {
                      const labStatus = LAB_STATUS_MAP[l.status] || LAB_STATUS_MAP.draft;
                      const LabIcon = labStatus.icon;
                      const isDraft = l.status === 'draft';

                      return (
                        <motion.div
                          key={l.id}
                          className={`ex-lab-card ${!isDraft ? 'ex-lab-card--sent' : ''}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="ex-lab-card__header">
                            <span className="ex-lab-card__num">#{idx + 1}</span>
                            <div className={`ex-lab-status-badge ${labStatus.color}`}>
                              <LabIcon size={12} />
                              <span>{labStatus.label}</span>
                            </div>
                            {!isCompleted && isDraft && (
                              <button
                                className="ex-btn-delete"
                                onClick={() => removeLabOrder(l.id)}
                                type="button"
                                aria-label="Xóa xét nghiệm"
                              >
                                <FiTrash2 size={16} color="#fff" />
                              </button>
                            )}
                          </div>

                          <div className="ex-lab-card__fields">
                            <input
                              type="text"
                              className="ex-input"
                              placeholder="Tên xét nghiệm..."
                              value={l.test_name}
                              onChange={(e) => updateLabOrder(l.id, e.target.value)}
                              disabled={isCompleted || !isDraft}
                            />
                          </div>

                          {/* Kết quả xét nghiệm — hiển thị khi completed */}
                          {l.status === 'completed' && l.result_summary && (
                            <div className="ex-lab-result">
                              <div className="ex-lab-result__header">
                                <FiClipboard size={14} />
                                <span>Kết quả xét nghiệm</span>
                              </div>
                              <p className="ex-lab-result__summary">{l.result_summary}</p>
                              {l.result_file_url && (
                                <a
                                  href={l.result_file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ex-lab-result__file"
                                >
                                  <FiDownload size={14} />
                                  Tải file kết quả
                                </a>
                              )}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  {labOrders.length === 0 && (
                    <div className="ex-lab-empty">
                      <FiActivity size={32} className="ex-lab-empty__icon" />
                      <p className="ex-lab-empty__text">Chưa có chỉ định xét nghiệm nào.</p>
                      {!isCompleted && recordId && (
                        <button
                          className="ex-btn ex-btn--outline ex-btn--sm"
                          onClick={addLabOrder}
                          type="button"
                        >
                          <FiPlus size={14} />
                          Thêm xét nghiệm đầu tiên
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Dedicated Send Button */}
                {labOrders.length > 0 && !isCompleted && recordId && (
                  <div className="ex-lab-action-bar">
                    <div className="ex-lab-action-bar__info">
                      <FiActivity size={14} />
                      <span>
                        {labOrders.filter((l) => l.status === 'draft').length} chưa gửi
                        {labOrders.filter((l) => l.status === 'ordered').length > 0 &&
                          ` · ${labOrders.filter((l) => l.status === 'ordered').length} đã gửi`}
                        {labOrders.filter((l) => l.status === 'completed').length > 0 &&
                          ` · ${labOrders.filter((l) => l.status === 'completed').length} có kết quả`}
                      </span>
                    </div>
                    <button
                      className={`ex-btn ex-btn--send ${!hasDraftLabs ? 'ex-btn--disabled' : ''}`}
                      onClick={handleSendLabOrders}
                      type="button"
                      disabled={!hasDraftLabs || labSending}
                    >
                      {labSending ? (
                        <>
                          <FiLoader size={16} className="ex-spin" />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <FiSend size={16} />
                          Gửi yêu cầu xét nghiệm
                        </>
                      )}
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Lịch tái khám */}
              <motion.div className="ex-form-card" variants={itemVariants}>
                <div className="ex-form-card__header">
                  <FiCalendar size={18} className="ex-form-card__icon" />
                  <h3 className="ex-form-card__title">Lịch tái khám</h3>
                </div>
                <div className="ex-form-card__body">
                  <MiniCalendar
                    selectedDate={followUpDate}
                    onSelect={setFollowUpDate}
                  />
                  {followUpDate && (
                    <div className="ex-followup-info">
                      <FiCalendar size={14} />
                      <span>
                        Lịch tái khám đã chọn: <strong>{formatFollowUp(followUpDate)}</strong>
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* ===== ACTION BAR ===== */}
          {!isCompleted && recordId && (
            <motion.div className="ex-action-bar" variants={itemVariants}>
              <button
                className="ex-btn ex-btn--outline"
                onClick={handleSaveDraft}
                type="button"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <FiLoader size={16} className="ex-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <FiSave size={16} />
                    Lưu nháp
                  </>
                )}
              </button>
              <button
                className="ex-btn ex-btn--primary ex-btn--lg"
                onClick={handleComplete}
                type="button"
                disabled={completing}
              >
                {completing ? (
                  <>
                    <FiLoader size={16} className="ex-spin" />
                    Đang hoàn tất...
                  </>
                ) : (
                  <>
                    <FiCheckCircle size={16} />
                    Hoàn tất ca khám
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Thông báo chưa bắt đầu khám */}
          {!recordId && !isCompleted && (
            <motion.div className="ex-completed-banner" variants={itemVariants} style={{ background: '#FFF7ED', borderColor: '#FDBA74', color: '#C2410C' }}>
              <FiAlertCircle size={20} />
              <span>Vui lòng bấm "Bắt đầu khám" để tạo bệnh án và bắt đầu ghi chú.</span>
            </motion.div>
          )}

          {isCompleted && (
            <motion.div className="ex-completed-banner" variants={itemVariants}>
              <FiCheckCircle size={20} />
              <span>Ca khám đã hoàn tất. Dữ liệu đã được lưu.</span>
            </motion.div>
          )}

          {/* Footer */}
          <motion.footer className="ex-footer" variants={itemVariants}>
            <p>&copy; 2026 MedSchedule. All rights reserved.</p>
          </motion.footer>
        </motion.div>
      </main>
    </div>
  );
};

export default ExaminationPage;
