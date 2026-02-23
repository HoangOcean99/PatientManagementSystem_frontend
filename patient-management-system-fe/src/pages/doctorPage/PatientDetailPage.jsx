import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiUser,
  FiCalendar,
  FiPhone,
  FiMail,
  FiMapPin,
  FiAlertCircle,
  FiFileText,
  FiActivity,
  FiClipboard,
  FiChevronDown,
  FiChevronUp,
  FiBriefcase,
  FiHeart,
  FiThermometer,
  FiBookOpen,
  FiPlay,
} from 'react-icons/fi';
import './PatientDetailPage.css';

// ===== MOCK DATA (replace with API calls) =====
const MOCK_PATIENT = {
  // From Users table
  user_id: 'u-001',
  full_name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone_number: '0901234567',
  avatar_url: null,
  // From Patients table
  patient_id: 'p-001',
  dob: '1990-01-01',
  gender: 'male',
  address: '123 Đường ABC, Quận 1, TP.HCM',
  allergies: 'Phấn hoa, Penicillin',
  medical_history_summary:
    'Tiểu đường type 2. Tình trạng bệnh nền hiện tại: Ổn định, đang dùng thuốc.',
};

const MOCK_RECORDS = [
  {
    // Appointments + MedicalRecords
    appointment_id: 'a-004',
    record_id: 'r-004',
    appointment_date: '2026-01-25',
    status: 'completed',
    symptoms: 'Bệnh nhân có biểu hiện sốt nhẹ, ho khan, đau họng.',
    diagnosis: 'Viêm họng cấp.',
    doctor_notes:
      'Tình trạng tổng thể ổn định. Khuyên bệnh nhân nghỉ ngơi đầy đủ và uống nhiều nước.',
    // Prescriptions
    prescriptions: [
      {
        prescription_id: 'pr-001',
        medication_name: 'Paracetamol',
        dosage: '500mg',
        instructions: '2 lần/ngày',
      },
      {
        prescription_id: 'pr-002',
        medication_name: 'Amoxicillin',
        dosage: '250mg',
        instructions: '3 lần/ngày',
      },
      {
        prescription_id: 'pr-003',
        medication_name: 'Thuốc giảm đau',
        dosage: '1 viên',
        instructions: 'Khi đau',
      },
    ],
    // LabOrders
    lab_orders: [
      {
        lab_order_id: 'l-001',
        test_name: 'CRP',
        result_summary: '7.9',
        status: 'completed',
        unit: 'mg/L',
      },
      {
        lab_order_id: 'l-002',
        test_name: 'WBC',
        result_summary: '12.5',
        status: 'completed',
        unit: 'K/uL',
      },
    ],
  },
  {
    appointment_id: 'a-003',
    record_id: 'r-003',
    appointment_date: '2026-01-24',
    status: 'completed',
    symptoms: 'Đau đầu kéo dài, mất ngủ, chóng mặt khi đứng dậy.',
    diagnosis: 'Thiếu máu não, rối loạn tiền đình.',
    doctor_notes:
      'Cần theo dõi huyết áp. Hẹn tái khám sau 2 tuần. Tránh thay đổi tư thế đột ngột.',
    prescriptions: [
      {
        prescription_id: 'pr-004',
        medication_name: 'Betahistine',
        dosage: '16mg',
        instructions: '2 lần/ngày sau ăn',
      },
      {
        prescription_id: 'pr-005',
        medication_name: 'Vitamin B12',
        dosage: '500mcg',
        instructions: '1 lần/ngày',
      },
    ],
    lab_orders: [
      {
        lab_order_id: 'l-003',
        test_name: 'Huyết áp',
        result_summary: '130/85',
        status: 'completed',
        unit: 'mmHg',
      },
    ],
  },
  {
    appointment_id: 'a-002',
    record_id: 'r-002',
    appointment_date: '2025-08-25',
    status: 'completed',
    symptoms: 'Đau bụng vùng thượng vị, buồn nôn sau ăn.',
    diagnosis: 'Viêm dạ dày cấp.',
    doctor_notes: 'Hạn chế đồ cay nóng, ăn đúng giờ. Tái khám sau 1 tháng.',
    prescriptions: [
      {
        prescription_id: 'pr-006',
        medication_name: 'Omeprazole',
        dosage: '20mg',
        instructions: '1 lần/ngày trước ăn sáng',
      },
      {
        prescription_id: 'pr-007',
        medication_name: 'Domperidone',
        dosage: '10mg',
        instructions: '3 lần/ngày trước ăn',
      },
    ],
    lab_orders: [],
  },
  {
    appointment_id: 'a-001',
    record_id: 'r-001',
    appointment_date: '2025-03-10',
    status: 'completed',
    symptoms: 'Khám tổng quát định kỳ, không triệu chứng bất thường.',
    diagnosis: 'Sức khỏe bình thường. Đường huyết cần theo dõi.',
    doctor_notes: 'Duy trì chế độ ăn kiêng đường. Tái khám kiểm tra đường huyết sau 3 tháng.',
    prescriptions: [
      {
        prescription_id: 'pr-008',
        medication_name: 'Metformin',
        dosage: '500mg',
        instructions: '2 lần/ngày sau ăn',
      },
    ],
    lab_orders: [
      {
        lab_order_id: 'l-004',
        test_name: 'HbA1c',
        result_summary: '6.8',
        status: 'completed',
        unit: '%',
      },
      {
        lab_order_id: 'l-005',
        test_name: 'Glucose (đói)',
        result_summary: '126',
        status: 'completed',
        unit: 'mg/dL',
      },
    ],
  },
];

// ===== HELPERS =====
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatDateLong = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const getGenderLabel = (gender) => {
  const map = { male: 'Nam', female: 'Nữ', other: 'Khác' };
  return map[gender] || gender;
};

const calculateAge = (dob) => {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(-2);
};

// ===== ANIMATION VARIANTS =====
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
};

const tabContentVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 26, staggerChildren: 0.06 },
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
};

// ===== SUB-COMPONENTS =====

function InfoField({ icon: Icon, label, value }) {
  return (
    <div className="pd-info-field">
      <div className="pd-info-field__icon">
        <Icon size={16} />
      </div>
      <div className="pd-info-field__content">
        <span className="pd-info-field__label">{label}</span>
        <span className="pd-info-field__value">{value || '—'}</span>
      </div>
    </div>
  );
}

function SectionCard({ icon: Icon, title, children, className = '' }) {
  return (
    <motion.div className={`pd-section-card ${className}`} variants={cardVariants}>
      <div className="pd-section-card__header">
        <div className="pd-section-card__icon">
          <Icon size={18} />
        </div>
        <h3 className="pd-section-card__title">{title}</h3>
      </div>
      <div className="pd-section-card__body">{children}</div>
    </motion.div>
  );
}

function PrescriptionTable({ prescriptions }) {
  if (!prescriptions || prescriptions.length === 0) {
    return <p className="pd-empty-text">Không có đơn thuốc.</p>;
  }
  return (
    <div className="pd-table-wrapper">
      <table className="pd-table">
        <thead>
          <tr>
            <th>Tên thuốc</th>
            <th>Liều lượng</th>
            <th>Hướng dẫn</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((p, i) => (
            <tr key={p.prescription_id || i}>
              <td className="pd-table__med-name">{p.medication_name}</td>
              <td>{p.dosage}</td>
              <td>{p.instructions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LabTable({ labOrders }) {
  if (!labOrders || labOrders.length === 0) {
    return <p className="pd-empty-text">Không có kết quả xét nghiệm.</p>;
  }
  return (
    <div className="pd-table-wrapper">
      <table className="pd-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên xét nghiệm</th>
            <th>Kết quả</th>
            <th>Đơn vị</th>
          </tr>
        </thead>
        <tbody>
          {labOrders.map((l, i) => (
            <tr key={l.lab_order_id || i}>
              <td>{i + 1}</td>
              <td>{l.test_name}</td>
              <td className="pd-table__result">{l.result_summary || '—'}</td>
              <td>{l.unit || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ===== MAIN COMPONENT =====
const PatientDetailPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();

  // TODO: Replace with API call using patientId
  const patient = MOCK_PATIENT;
  const records = MOCK_RECORDS;

  const [activeRecordIndex, setActiveRecordIndex] = useState(0);
  const activeRecord = records[activeRecordIndex];

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="pd-layout" style={{}}>
      {/* ===== SIDEBAR ===== */}
      <aside className="pd-sidebar">
        <div className="pd-sidebar__brand">
          <div className="pd-sidebar__logo">
            <i className="fa-solid fa-heart-pulse"></i>
          </div>
          <span className="pd-sidebar__brand-text">MedSchedule</span>
        </div>

        <nav className="pd-sidebar__nav">
          <a href="#" className="pd-sidebar__link">
            <FiCalendar size={20} />
            <span>Lịch làm việc</span>
          </a>
          <a href="#" className="pd-sidebar__link pd-sidebar__link--active">
            <FiClipboard size={20} />
            <span>Quy trình khám bệnh</span>
          </a>
        </nav>

        <div className="pd-sidebar__footer">
          <button className="pd-sidebar__logout" onClick={() => navigate('/')}>
            <FiArrowLeft size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="pd-main">
        <motion.div
          className="pd-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div className="pd-header" variants={itemVariants}>
            <div className="pd-header__left">
              <h1 className="pd-header__title">Hồ sơ bệnh nhân</h1>
            </div>
            <div className="pd-header__actions">
              <button className="pd-btn-back" onClick={handleGoBack}>
                <FiArrowLeft size={16} />
                Quay lại
              </button>
              <button
                className="pd-btn-exam"
                onClick={() => navigate(`/doctor/examine/${records[0]?.appointment_id || 'new'}`)}
              >
                <FiPlay size={16} />
                Bắt đầu khám
              </button>
            </div>
          </motion.div>

          {/* Patient Avatar + Quick Info */}
          <motion.div className="pd-patient-banner" variants={itemVariants}>
            <div className="pd-patient-banner__avatar">
              {patient.avatar_url ? (
                <img src={patient.avatar_url} alt={patient.full_name} />
              ) : (
                <span className="pd-patient-banner__initials">
                  {getInitials(patient.full_name)}
                </span>
              )}
            </div>
            <div className="pd-patient-banner__info">
              <h2 className="pd-patient-banner__name">{patient.full_name}</h2>
              <div className="pd-patient-banner__meta">
                <span className="pd-badge pd-badge--gender">
                  {getGenderLabel(patient.gender)}
                </span>
                <span className="pd-badge pd-badge--age">
                  {calculateAge(patient.dob)} tuổi
                </span>
                <span className="pd-patient-banner__id">
                  ID: {patient.patient_id}
                </span>
              </div>
            </div>
          </motion.div>

          {/* THÔNG TIN CHUNG */}
          <motion.div variants={itemVariants}>
            <SectionCard icon={FiUser} title="Thông tin chung">
              <div className="pd-info-grid">
                <InfoField
                  icon={FiUser}
                  label="Họ và tên"
                  value={patient.full_name}
                />
                <InfoField
                  icon={FiCalendar}
                  label="Ngày sinh"
                  value={formatDate(patient.dob)}
                />
                <InfoField
                  icon={FiHeart}
                  label="Giới tính"
                  value={getGenderLabel(patient.gender)}
                />
                <InfoField
                  icon={FiPhone}
                  label="Điện thoại"
                  value={patient.phone_number}
                />
                <InfoField
                  icon={FiMail}
                  label="Email"
                  value={patient.email}
                />
                <InfoField
                  icon={FiMapPin}
                  label="Địa chỉ"
                  value={patient.address}
                />
              </div>
            </SectionCard>
          </motion.div>

          {/* THÔNG TIN Y TẾ */}
          <motion.div variants={itemVariants}>
            <SectionCard icon={FiActivity} title="Thông tin y tế">
              <div className="pd-medical-info">
                <div className="pd-medical-info__item">
                  <div className="pd-medical-info__icon pd-medical-info__icon--allergy">
                    <FiAlertCircle size={18} />
                  </div>
                  <div>
                    <span className="pd-medical-info__label">Dị ứng</span>
                    <p className="pd-medical-info__value">
                      {patient.allergies || 'Không có'}
                    </p>
                  </div>
                </div>
                <div className="pd-medical-info__item">
                  <div className="pd-medical-info__icon pd-medical-info__icon--history">
                    <FiFileText size={18} />
                  </div>
                  <div>
                    <span className="pd-medical-info__label">
                      Tóm tắt tiền sử bệnh
                    </span>
                    <p className="pd-medical-info__value">
                      {patient.medical_history_summary || 'Không có thông tin'}
                    </p>
                  </div>
                </div>
              </div>
            </SectionCard>
          </motion.div>

          {/* LỊCH SỬ KHÁM BỆNH */}
          <motion.div variants={itemVariants}>
            <div className="pd-history-section">
              <div className="pd-history-section__header">
                <div className="pd-history-section__title-row">
                  <div className="pd-section-card__icon">
                    <FiBookOpen size={18} />
                  </div>
                  <h3 className="pd-section-card__title">Lịch sử khám bệnh</h3>
                </div>
                <span className="pd-history-section__count">
                  {records.length} lần khám
                </span>
              </div>

              {/* Date Tabs */}
              <div className="pd-tabs">
                {records.map((rec, idx) => (
                  <button
                    key={rec.appointment_id}
                    className={`pd-tab ${idx === activeRecordIndex ? 'pd-tab--active' : ''}`}
                    onClick={() => setActiveRecordIndex(idx)}
                  >
                    <FiCalendar size={14} />
                    <span>{formatDate(rec.appointment_date)}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeRecord && (
                  <motion.div
                    key={activeRecord.record_id}
                    className="pd-record-content"
                    variants={tabContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {/* Record Date Badge */}
                    <motion.div className="pd-record-date-badge" variants={cardVariants}>
                      <FiCalendar size={16} />
                      <span>{formatDateLong(activeRecord.appointment_date)}</span>
                    </motion.div>

                    <div className="pd-record-grid">
                      {/* Ghi chú & Thăm khám */}
                      <motion.div className="pd-record-card" variants={cardVariants}>
                        <div className="pd-record-card__header">
                          <FiThermometer size={18} className="pd-record-card__icon" />
                          <h4 className="pd-record-card__title">Ghi chú & Thăm khám</h4>
                        </div>
                        <div className="pd-record-card__body">
                          <div className="pd-record-field">
                            <span className="pd-record-field__label">Triệu chứng:</span>
                            <p className="pd-record-field__value">{activeRecord.symptoms}</p>
                          </div>
                          <div className="pd-record-field">
                            <span className="pd-record-field__label">Ghi chú bác sĩ:</span>
                            <p className="pd-record-field__value">{activeRecord.doctor_notes}</p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Đơn thuốc */}
                      <motion.div className="pd-record-card" variants={cardVariants}>
                        <div className="pd-record-card__header">
                          <FiBriefcase size={18} className="pd-record-card__icon" />
                          <h4 className="pd-record-card__title">Đơn thuốc</h4>
                        </div>
                        <div className="pd-record-card__body">
                          <PrescriptionTable prescriptions={activeRecord.prescriptions} />
                        </div>
                      </motion.div>

                      {/* Chẩn đoán */}
                      <motion.div className="pd-record-card" variants={cardVariants}>
                        <div className="pd-record-card__header">
                          <FiClipboard size={18} className="pd-record-card__icon" />
                          <h4 className="pd-record-card__title">Chẩn đoán</h4>
                        </div>
                        <div className="pd-record-card__body">
                          <div className="pd-diagnosis">
                            <span className="pd-diagnosis__label">Chẩn đoán:</span>
                            <p className="pd-diagnosis__value">{activeRecord.diagnosis}</p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Kết quả xét nghiệm */}
                      <motion.div className="pd-record-card" variants={cardVariants}>
                        <div className="pd-record-card__header">
                          <FiActivity size={18} className="pd-record-card__icon" />
                          <h4 className="pd-record-card__title">Kết quả xét nghiệm</h4>
                        </div>
                        <div className="pd-record-card__body">
                          <LabTable labOrders={activeRecord.lab_orders} />
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.footer className="pd-footer" variants={itemVariants}>
            <p>&copy; 2026 MedSchedule. All rights reserved.</p>
          </motion.footer>
        </motion.div>
      </main>
    </div>
  );
};

export default PatientDetailPage;
