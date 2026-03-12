import React, { useState, useEffect } from 'react';
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
  FiExternalLink,
} from 'react-icons/fi';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import medicalRecordApi from '../../api/medicalRecordApi';
import './PatientDetailPage.css';



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
    <div className="pd-lab-list">
      {labOrders.map((l, i) => (
        <div key={l.lab_order_id || i} className="pd-lab-item">
          <div className="pd-lab-item__header">
            <span className="pd-lab-item__name">{l.test_name}</span>
          </div>

          {l.result_summary && (
            <div className="pd-lab-item__summary">
              <p className="pd-lab-item__summary-text">{l.result_summary}</p>
            </div>
          )}

          {l.result_file_url && (
            <div className="pd-lab-item__footer">
              <a
                href={l.result_file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-lab-item__file-link"
              >
                <FiExternalLink size={12} />
                Xem file kết quả
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ===== MAIN COMPONENT =====
const PatientDetailPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();

  // ===== API STATE =====
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeRecordIndex, setActiveRecordIndex] = useState(0);

  // ===== FETCH DATA =====
  useEffect(() => {
    if (!patientId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy tất cả medical records của patient — bạn end join Patients → Users
        const recordsRes = await medicalRecordApi.getMedicalRecordsByPatientId(patientId);
        const rawRecords = recordsRes.data?.data || recordsRes.data || [];

        // Map records và extract patient info từ record đầu tiên
        const mappedRecords = (Array.isArray(rawRecords) ? rawRecords : []).map((rec) => ({
          record_id: rec.record_id,
          appointment_id: rec.appointment_id,
          // Lấy ngày từ slot nếu có join, fallback về created_at
          appointment_date:
            rec.Appointments?.DoctorSlots?.slot_date ||
            rec.Appointments?.DoctorSlot?.slot_date ||
            rec.created_at?.split('T')[0] ||
            '',
          status: rec.status || 'completed',
          symptoms: rec.symptoms || '',
          diagnosis: rec.diagnosis || '',
          doctor_notes: rec.doctor_notes || '',
          prescriptions: (rec.Prescriptions || []).map((p) => ({
            prescription_id: p.prescription_id,
            medication_name: p.medication_name || '',
            dosage: p.dosage || '',
            instructions: p.instructions || '',
            reminder_schedule: p.reminder_schedule || '',
          })),
          lab_orders: (rec.LabOrders || []).map((l) => ({
            lab_order_id: l.lab_order_id,
            test_name: l.test_name || '',
            result_summary: l.result_summary || '',
            result_file_url: l.result_file_url || '',
            status: l.status || 'ordered',
            created_at: l.created_at || '',
          })),
        }));

        setRecords(mappedRecords);

        // Lấy patient info từ record đầu tiên nếu có
        if (rawRecords.length > 0) {
          const first = rawRecords[0];
          setPatient({
            patient_id: first.patient_id || patientId,
            full_name: first.Patients?.Users?.full_name || 'N/A',
            email: first.Patients?.Users?.email || '',
            phone_number: first.Patients?.Users?.phone_number || '',
            avatar_url: first.Patients?.Users?.avatar_url || null,
            dob: first.Patients?.dob || '',
            gender: first.Patients?.gender || '',
            address: first.Patients?.address || '',
            allergies: first.Patients?.allergies || '',
            medical_history_summary: first.Patients?.medical_history_summary || '',
          });
        } else {
          // Không có record — hiển thị patient rỗng
          setPatient({
            patient_id: patientId,
            full_name: 'Bệnh nhân',
            email: '', phone_number: '', avatar_url: null,
            dob: '', gender: '', address: '', allergies: '',
            medical_history_summary: '',
          });
        }
      } catch (err) {
        console.error('Failed to load patient data:', err);
        setError('Không thể tải dữ liệu bệnh nhân. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);


  const activeRecord = records[activeRecordIndex] || null;

  const handleGoBack = () => {
    navigate(-1);
  };

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="pd-layout">
        <main className="pd-main">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 12 }}>
            <FiActivity size={28} style={{ color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Đang tải hồ sơ bệnh nhân...</p>
          </div>
        </main>
      </div>
    );
  }

  // ===== ERROR STATE =====
  if (error || !patient) {
    return (
      <div className="pd-layout">
        <DoctorSidebar activePage="schedule" />
        <main className="pd-main">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 12 }}>
            <FiAlertCircle size={28} style={{ color: '#ef4444' }} />
            <p style={{ color: '#ef4444', fontSize: '0.95rem', marginBottom: 12 }}>{error || 'Không tìm thấy bệnh nhân.'}</p>
            <button className="pd-btn-back" onClick={handleGoBack}>
              <FiArrowLeft size={16} /> Quay lại
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="pd-layout" style={{}}>
      {/* ===== SIDEBAR ===== */}
      <DoctorSidebar activePage="schedule" />

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
                onClick={() => navigate(`/doctor/examine/${records[0]?.appointment_id || ''}`)}
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

              {records.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', padding: '16px 0' }}>
                  Chưa có lịch sử khám bệnh.
                </p>
              ) : (
              <div className="pd-tabs">
                {records.map((rec, idx) => (
                  <button
                    key={rec.record_id || rec.appointment_id || idx}
                    className={`pd-tab ${idx === activeRecordIndex ? 'pd-tab--active' : ''}`}
                    onClick={() => setActiveRecordIndex(idx)}
                  >
                    <FiCalendar size={14} />
                    <span>{rec.appointment_date ? formatDate(rec.appointment_date) : `Lần ${idx + 1}`}</span>
                  </button>
                ))}
              </div>
              )}
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
