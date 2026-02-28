import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiUser,
  FiActivity,
  FiFileText,
  FiSave,
  FiCheckCircle,
  FiUpload,
  FiClock,
  FiAlertCircle,
  FiLoader,
  FiX,
} from 'react-icons/fi';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import './LabResultPage.css';

// ===== MOCK DATA =====
// In production: GET /api/lab-orders/:labOrderId  (joins patient info)
const MOCK_LAB_ORDERS = {
  'lo-001': {
    lab_order_id: 'lo-001',
    record_id: 'r-001',
    test_name: 'Xét nghiệm máu tổng quát',
    result_summary: '',
    result_file_url: '',
    status: 'ordered',
    created_at: '2026-02-28T08:15:00',
    // Joined patient info
    patient_name: 'Nguyễn Thị An',
    patient_id: 'p-001',
    gender: 'female',
    age: 34,
    allergies: 'Phấn hoa, Penicillin',
    doctor_name: 'BS. Nguyễn Văn Bác Sĩ',
  },
  'lo-003': {
    lab_order_id: 'lo-003',
    record_id: 'r-002',
    test_name: 'Xét nghiệm đường huyết',
    result_summary: 'Chỉ số đường huyết: 5.2 mmol/L — Bình thường.',
    result_file_url: '',
    status: 'processing',
    created_at: '2026-02-28T08:30:00',
    patient_name: 'Trần Văn Bình',
    patient_id: 'p-002',
    gender: 'male',
    age: 52,
    allergies: '',
    doctor_name: 'BS. Lê Minh Hoàng',
  },
};

// ===== HELPERS =====
const getInitials = (name) =>
  name ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(-2) : '?';

const getGenderLabel = (g) => ({ male: 'Nam', female: 'Nữ', other: 'Khác' }[g] || g);

const STATUS_MAP = {
  ordered:    { label: 'Chờ xét nghiệm', color: 'lr-status--ordered',    icon: FiClock },
  processing: { label: 'Đang xử lý',     color: 'lr-status--processing', icon: FiActivity },
  completed:  { label: 'Hoàn tất',        color: 'lr-status--completed',  icon: FiCheckCircle },
};

// ===== ANIMATION =====
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const LabResultPage = () => {
  const navigate = useNavigate();
  const { labOrderId } = useParams();

  // TODO: Replace with API call using labOrderId
  const labOrderData = MOCK_LAB_ORDERS[labOrderId] || MOCK_LAB_ORDERS['lo-001'];

  const [labOrder, setLabOrder] = useState(labOrderData);

  // Form state — fields from LabOrders table
  const [resultSummary, setResultSummary] = useState(labOrder.result_summary || '');
  const [resultFileUrl, setResultFileUrl] = useState(labOrder.result_file_url || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const isCompleted = labOrder.status === 'completed';
  const statusInfo = STATUS_MAP[labOrder.status] || STATUS_MAP.ordered;
  const StatusIcon = statusInfo.icon;

  // ===== HANDLERS =====
  const handleStartProcessing = () => {
    if (labOrder.status === 'ordered') {
      setLabOrder((prev) => ({ ...prev, status: 'processing' }));
      // TODO: API call — PATCH /api/lab-orders/:id { status: 'processing' }
    }
  };

  const handleSaveDraft = () => {
    setSaving(true);
    const payload = {
      lab_order_id: labOrder.lab_order_id,
      result_summary: resultSummary.trim(),
      result_file_url: resultFileUrl.trim(),
      status: 'processing',
    };
    console.log('Save Draft Lab Result:', payload);
    // TODO: API call — PATCH /api/lab-orders/:id

    setTimeout(() => {
      setSaving(false);
      setLabOrder((prev) => ({ ...prev, status: 'processing' }));
      setMessage({ type: 'success', text: 'Đã lưu nháp kết quả xét nghiệm.' });
      setTimeout(() => setMessage(null), 3000);
    }, 600);
  };

  const handleComplete = () => {
    if (!resultSummary.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập kết quả xét nghiệm trước khi hoàn tất.' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setSaving(true);
    const payload = {
      lab_order_id: labOrder.lab_order_id,
      result_summary: resultSummary.trim(),
      result_file_url: resultFileUrl.trim(),
      status: 'completed',
    };
    console.log('Complete Lab Order:', payload);
    // TODO: API call — PATCH /api/lab-orders/:id

    setTimeout(() => {
      setSaving(false);
      setLabOrder((prev) => ({ ...prev, status: 'completed' }));
      setMessage({ type: 'success', text: 'Hoàn tất xét nghiệm! Kết quả đã được gửi cho bác sĩ chỉ định.' });
      setTimeout(() => setMessage(null), 4000);
    }, 600);
  };

  return (
    <div className="lr-layout">
      <DoctorSidebar activePage="lab-queue" role="lab" />

      <main className="lr-main">
        <motion.div
          className="lr-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Back + Title Bar */}
          <motion.div className="lr-topbar" variants={itemVariants}>
            <button
              className="lr-back-btn"
              onClick={() => navigate('/lab/queue')}
              type="button"
            >
              <FiArrowLeft size={18} />
              Quay lại danh sách
            </button>
          </motion.div>

          {/* Toast Message */}
          {message && (
            <motion.div
              className={`lr-toast lr-toast--${message.type}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {message.type === 'success' ? <FiCheckCircle size={16} /> : <FiAlertCircle size={16} />}
              <span>{message.text}</span>
              <button className="lr-toast__close" onClick={() => setMessage(null)}>
                <FiX size={14} />
              </button>
            </motion.div>
          )}

          {/* Patient Banner */}
          <motion.div className="lr-patient-banner" variants={itemVariants}>
            <div className="lr-patient-banner__left">
              <div className="lr-patient-banner__avatar">
                <span className="lr-patient-banner__initials">
                  {getInitials(labOrder.patient_name)}
                </span>
              </div>
              <div className="lr-patient-banner__info">
                <h1 className="lr-patient-banner__name">{labOrder.patient_name}</h1>
                <div className="lr-patient-banner__meta">
                  <span className="lr-badge">ID: {labOrder.patient_id}</span>
                  <span className="lr-meta-sep">•</span>
                  <span>{labOrder.age} tuổi</span>
                  <span className="lr-meta-sep">•</span>
                  <span>{getGenderLabel(labOrder.gender)}</span>
                </div>
                {labOrder.allergies && (
                  <div className="lr-patient-banner__allergy">
                    <FiAlertCircle size={14} />
                    <span>Dị ứng: {labOrder.allergies}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="lr-patient-banner__right">
              <div className={`lr-status-badge ${statusInfo.color}`}>
                <StatusIcon size={14} />
                <span>{statusInfo.label}</span>
              </div>

              {labOrder.status === 'ordered' && (
                <button
                  className="lr-btn lr-btn--primary"
                  onClick={handleStartProcessing}
                  type="button"
                >
                  <FiActivity size={16} />
                  Bắt đầu xét nghiệm
                </button>
              )}
            </div>
          </motion.div>

          {/* Form Area */}
          <div className="lr-form-grid">
            {/* LEFT: Lab Order Info (readonly) */}
            <div className="lr-form-col">
              <motion.div className="lr-form-card" variants={itemVariants}>
                <div className="lr-form-card__header">
                  <FiFileText size={18} className="lr-form-card__icon" />
                  <h3 className="lr-form-card__title">Thông tin chỉ định</h3>
                </div>
                <div className="lr-form-card__body">
                  <div className="lr-info-row">
                    <span className="lr-info-label">Tên xét nghiệm</span>
                    <span className="lr-info-value lr-info-value--highlight">
                      {labOrder.test_name}
                    </span>
                  </div>
                  <div className="lr-info-row">
                    <span className="lr-info-label">Bác sĩ chỉ định</span>
                    <span className="lr-info-value">{labOrder.doctor_name}</span>
                  </div>
                  <div className="lr-info-row">
                    <span className="lr-info-label">Mã phiếu</span>
                    <span className="lr-info-value">{labOrder.lab_order_id}</span>
                  </div>
                  <div className="lr-info-row">
                    <span className="lr-info-label">Thời gian chỉ định</span>
                    <span className="lr-info-value">
                      {new Date(labOrder.created_at).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: Result Form */}
            <div className="lr-form-col">
              {/* result_summary */}
              <motion.div className="lr-form-card lr-form-card--result" variants={itemVariants}>
                <div className="lr-form-card__header lr-form-card__header--result">
                  <FiActivity size={18} className="lr-form-card__icon" />
                  <h3 className="lr-form-card__title">Kết quả xét nghiệm</h3>
                </div>
                <div className="lr-form-card__body">
                  <div className="lr-field">
                    <label className="lr-field__label" htmlFor="resultSummary">
                      Tóm tắt kết quả <span className="lr-required">*</span>
                    </label>
                    <textarea
                      id="resultSummary"
                      className="lr-textarea"
                      placeholder="Nhập kết quả xét nghiệm chi tiết..."
                      rows={6}
                      value={resultSummary}
                      onChange={(e) => setResultSummary(e.target.value)}
                      disabled={isCompleted}
                    />
                  </div>

                  {/* result_file_url */}
                  <div className="lr-field">
                    <label className="lr-field__label" htmlFor="resultFileUrl">
                      <FiUpload size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                      File kết quả (URL)
                    </label>
                    <input
                      id="resultFileUrl"
                      type="url"
                      className="lr-input"
                      placeholder="https://example.com/result.pdf"
                      value={resultFileUrl}
                      onChange={(e) => setResultFileUrl(e.target.value)}
                      disabled={isCompleted}
                    />
                    <p className="lr-field__hint">Đường dẫn tới file kết quả (PDF, hình ảnh...)</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Action Bar */}
          {!isCompleted && (
            <motion.div className="lr-action-bar" variants={itemVariants}>
              <button
                className="lr-btn lr-btn--outline"
                onClick={handleSaveDraft}
                type="button"
                disabled={saving}
              >
                {saving ? <FiLoader size={16} className="lr-spin" /> : <FiSave size={16} />}
                Lưu nháp
              </button>
              <button
                className="lr-btn lr-btn--success lr-btn--lg"
                onClick={handleComplete}
                type="button"
                disabled={saving}
              >
                {saving ? <FiLoader size={16} className="lr-spin" /> : <FiCheckCircle size={16} />}
                Hoàn tất xét nghiệm
              </button>
            </motion.div>
          )}

          {isCompleted && (
            <motion.div className="lr-completed-banner" variants={itemVariants}>
              <FiCheckCircle size={20} />
              <span>Xét nghiệm đã hoàn tất. Kết quả đã được gửi cho bác sĩ chỉ định.</span>
            </motion.div>
          )}

          {/* Footer */}
          <motion.footer className="lr-footer" variants={itemVariants}>
            <p>&copy; 2026 MedSchedule. All rights reserved.</p>
          </motion.footer>
        </motion.div>
      </main>
    </div>
  );
};

export default LabResultPage;
