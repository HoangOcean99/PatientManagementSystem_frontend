import React, { useState, useCallback } from 'react';
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
} from 'react-icons/fi';
import './ExaminationPage.css';

// ===== MOCK DATA (replace with API) =====
const MOCK_APPOINTMENT = {
  appointment_id: 'a-005',
  patient_id: 'p-001',
  doctor_id: 'd-001',
  service_id: 's-001',
  appointment_date: '2026-02-22',
  start_time: '09:00',
  end_time: '09:30',
  status: 'ready', // ready → in_progress → completed
  queue_number: 3,
};

const MOCK_PATIENT = {
  user_id: 'u-001',
  full_name: 'Nguyễn Thị An',
  email: 'nguyenthian@example.com',
  phone_number: '0901234567',
  avatar_url: null,
  patient_id: 'p-001',
  dob: '1991-05-15',
  gender: 'female',
  address: '456 Đường XYZ, Quận 3, TP.HCM',
  allergies: 'Phấn hoa, Penicillin',
  medical_history_summary: 'Hen suyễn nhẹ. Đang dùng thuốc kiểm soát.',
};

// ===== HELPERS =====
const getGenderLabel = (g) => ({ male: 'Nam', female: 'Nữ', other: 'Khác' }[g] || g);
const calculateAge = (dob) => {
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
  ready: { label: 'Sẵn sàng', color: 'status--ready', icon: FiLoader },
  in_progress: { label: 'Đang khám', color: 'status--active', icon: FiPlay },
  completed: { label: 'Hoàn tất', color: 'status--done', icon: FiCheckCircle },
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

  // TODO: fetch from API using appointmentId
  const [appointment, setAppointment] = useState(MOCK_APPOINTMENT);
  const patient = MOCK_PATIENT;

  // ===== FORM STATE =====
  // MedicalRecords fields
  const [symptoms, setSymptoms] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  // Prescriptions (dynamic list)
  const [prescriptions, setPrescriptions] = useState([
    { id: Date.now(), medication_name: '', dosage: '', instructions: '', reminder_schedule: '' },
  ]);

  // LabOrders (dynamic list)
  const [labOrders, setLabOrders] = useState([]);

  // Follow-up date (UI only)
  const [followUpDate, setFollowUpDate] = useState('');

  // ===== HANDLERS =====
  const handleStatusChange = () => {
    if (appointment.status === 'ready') {
      setAppointment((a) => ({ ...a, status: 'in_progress' }));
      // TODO: API call to update appointment status
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
    setLabOrders((prev) => [...prev, { id: Date.now(), test_name: '' }]);
  };

  const removeLabOrder = (id) => {
    setLabOrders((prev) => prev.filter((l) => l.id !== id));
  };

  const updateLabOrder = (id, value) => {
    setLabOrders((prev) =>
      prev.map((l) => (l.id === id ? { ...l, test_name: value } : l))
    );
  };

  // -- Save / Complete --
  const handleSaveDraft = () => {
    const payload = buildPayload();
    console.log('Save Draft:', payload);
    // TODO: API call to save draft
    alert('Đã lưu nháp thành công!');
  };

  const handleComplete = () => {
    if (!diagnosis.trim()) {
      alert('Vui lòng nhập chẩn đoán trước khi hoàn tất.');
      return;
    }
    const payload = buildPayload();
    payload.appointment_status = 'completed';
    console.log('Complete Exam:', payload);
    // TODO: API call to save + update appointment status to completed
    setAppointment((a) => ({ ...a, status: 'completed' }));
    alert('Hoàn tất ca khám thành công!');
  };

  const buildPayload = () => ({
    // MedicalRecords
    medical_record: {
      appointment_id: appointment.appointment_id,
      doctor_id: appointment.doctor_id,
      patient_id: appointment.patient_id,
      symptoms: symptoms.trim(),
      diagnosis: diagnosis.trim(),
      doctor_notes: doctorNotes.trim(),
    },
    // Prescriptions
    prescriptions: prescriptions
      .filter((p) => p.medication_name.trim())
      .map((p) => ({
        medication_name: p.medication_name.trim(),
        dosage: p.dosage.trim(),
        instructions: p.instructions.trim(),
        reminder_schedule: p.reminder_schedule,
      })),
    // LabOrders
    lab_orders: labOrders
      .filter((l) => l.test_name.trim())
      .map((l) => ({
        test_name: l.test_name.trim(),
        status: 'ordered',
      })),
    // Follow-up (UI only — future use)
    follow_up_date: followUpDate || null,
  });

  const viewPatientProfile = () => {
    navigate(`/doctor/patient/${patient.patient_id}`);
  };

  const statusInfo = STATUS_MAP[appointment.status] || STATUS_MAP.ready;
  const StatusIcon = statusInfo.icon;
  const isExamStarted = appointment.status === 'in_progress';
  const isCompleted = appointment.status === 'completed';

  const formatFollowUp = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="ex-layout">
      {/* ===== SIDEBAR ===== */}
      <aside className="ex-sidebar">
        <div className="ex-sidebar__brand">
          <div className="ex-sidebar__logo">
            <i className="fa-solid fa-heart-pulse"></i>
          </div>
          <span className="ex-sidebar__brand-text">MedSchedule</span>
        </div>

        <nav className="ex-sidebar__nav">
          <a href="#" className="ex-sidebar__link">
            <FiCalendar size={20} />
            <span>Lịch làm việc & Hồ sơ</span>
          </a>
          <a href="#" className="ex-sidebar__link ex-sidebar__link--active">
            <FiClipboard size={20} />
            <span>Quy trình khám bệnh</span>
          </a>
        </nav>

        <div className="ex-sidebar__footer">
          <button className="ex-sidebar__logout" onClick={() => navigate('/')}>
            <FiArrowLeft size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

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
                  <span className="ex-badge">ID: {patient.patient_id}</span>
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

              {appointment.status === 'ready' && (
                <button
                  className="ex-btn ex-btn--primary"
                  onClick={handleStatusChange}
                  type="button"
                >
                  <FiPlay size={16} />
                  Bắt đầu khám
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
                      disabled={isCompleted}
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
                      disabled={isCompleted}
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
                    disabled={isCompleted}
                  />
                </div>
              </motion.div>

              {/* Đơn thuốc */}
              <motion.div className="ex-form-card" variants={itemVariants}>
                <div className="ex-form-card__header">
                  <FiHeart size={18} className="ex-form-card__icon" />
                  <h3 className="ex-form-card__title">Đơn thuốc</h3>
                  {!isCompleted && (
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
                          {!isCompleted && prescriptions.length > 1 && (
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
                            disabled={isCompleted}
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
                              disabled={isCompleted}
                            />
                            <input
                              type="text"
                              className="ex-input"
                              placeholder="Hướng dẫn (vd: 2 lần/ngày)"
                              value={p.instructions}
                              onChange={(e) =>
                                updatePrescription(p.id, 'instructions', e.target.value)
                              }
                              disabled={isCompleted}
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
                              disabled={isCompleted}
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
              <motion.div className="ex-form-card" variants={itemVariants}>
                <div className="ex-form-card__header">
                  <FiActivity size={18} className="ex-form-card__icon" />
                  <h3 className="ex-form-card__title">Chỉ định xét nghiệm</h3>
                  {!isCompleted && (
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
                    {labOrders.map((l) => (
                      <motion.div
                        key={l.id}
                        className="ex-lab-item"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <input
                          type="text"
                          className="ex-input"
                          placeholder="Tên xét nghiệm..."
                          value={l.test_name}
                          onChange={(e) => updateLabOrder(l.id, e.target.value)}
                          disabled={isCompleted}
                        />
                        {!isCompleted && (
                          <button
                            className="ex-btn-delete"
                            onClick={() => removeLabOrder(l.id)}
                            type="button"
                            aria-label="Xóa xét nghiệm"
                          >
                            <FiTrash2 size={16} color="#fff" />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {labOrders.length === 0 && (
                    <p className="ex-empty-text">Chưa có chỉ định xét nghiệm nào.</p>
                  )}
                </div>
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
          {!isCompleted && (
            <motion.div className="ex-action-bar" variants={itemVariants}>
              <button
                className="ex-btn ex-btn--outline"
                onClick={handleSaveDraft}
                type="button"
              >
                <FiSave size={16} />
                Lưu nháp
              </button>
              <button
                className="ex-btn ex-btn--primary ex-btn--lg"
                onClick={handleComplete}
                type="button"
              >
                <FiCheckCircle size={16} />
                Hoàn tất ca khám
              </button>
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
