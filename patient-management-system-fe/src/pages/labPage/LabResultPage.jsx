import React, { useState, useEffect } from 'react';
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
import labOrderApi from '../../api/labOrderApi';
import './LabResultPage.css';

// ===== HELPERS =====
const getInitials = (name) =>
  name ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(-2) : '?';

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

  // Page-level states
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  // Lab order data
  const [labOrder, setLabOrder] = useState(null);

  // Form state
  const [resultSummary, setResultSummary] = useState('');
  const [resultFileUrl, setResultFileUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch lab order detail on mount
  useEffect(() => {
    const fetchLabOrder = async () => {
      try {
        setPageLoading(true);
        setPageError(null);

        const response = await labOrderApi.getLabOrderById(labOrderId);
        const data = response.data?.data || response.data;

        if (!data) {
          setPageError('Không tìm thấy xét nghiệm này.');
          setPageLoading(false);
          return;
        }

        // Map data — backend join MedicalRecords → Patients → Users
        const mapped = {
          lab_order_id: data.lab_order_id,
          record_id: data.record_id,
          test_name: data.test_name,
          result_summary: data.result_summary || '',
          result_file_url: data.result_file_url || '',
          status: data.status,
          created_at: data.created_at,
          // Patient info (nested join)
          patient_name: data.MedicalRecord?.Patient?.User?.full_name
            || data.MedicalRecords?.Patients?.Users?.full_name
            || data.patient_name
            || 'N/A',
          patient_id: data.MedicalRecord?.Patient?.patient_id
            || data.MedicalRecords?.Patients?.patient_id
            || data.patient_id
            || '',
          gender: data.MedicalRecord?.Patient?.gender
            || data.MedicalRecords?.Patients?.gender
            || data.gender
            || '',
          age: calculateAge(
            data.MedicalRecord?.Patient?.dob
            || data.MedicalRecords?.Patients?.dob
            || data.dob
          ),
          allergies: data.MedicalRecord?.Patient?.allergies
            || data.MedicalRecords?.Patients?.allergies
            || data.allergies
            || '',
          // Doctor info
          doctor_name: data.MedicalRecord?.Doctor?.User?.full_name
            || data.MedicalRecords?.Doctors?.Users?.full_name
            || data.doctor_name
            || '',
        };

        setLabOrder(mapped);
        setResultSummary(mapped.result_summary);
        setResultFileUrl(mapped.result_file_url);
      } catch (err) {
        console.error('Failed to fetch lab order:', err);
        if (err.response?.status === 404) {
          setPageError('Không tìm thấy xét nghiệm này.');
        } else {
          setPageError('Không thể tải dữ liệu xét nghiệm. Vui lòng thử lại.');
        }
      } finally {
        setPageLoading(false);
      }
    };

    if (labOrderId) {
      fetchLabOrder();
    }
  }, [labOrderId]);

  // ===== HANDLERS =====

  // Bắt đầu xét nghiệm → PATCH /lab-orders/:id { status: 'processing' }
  const handleStartProcessing = async () => {
    try {
      setSaving(true);
      await labOrderApi.updateLabOrder(labOrderId, { status: 'processing' });
      setLabOrder((prev) => ({ ...prev, status: 'processing' }));
      setMessage({ type: 'success', text: 'Đã tiếp nhận xét nghiệm.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Lỗi khi tiếp nhận xét nghiệm:', err);
      const msg = err.response?.data?.message || 'Không thể tiếp nhận xét nghiệm.';
      setMessage({ type: 'error', text: msg });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Lưu nháp → PATCH /lab-orders/:id { result_summary, result_file_url, status: 'processing' }
  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      const payload = {
        result_summary: resultSummary.trim(),
        result_file_url: resultFileUrl.trim(),
        status: 'processing',
      };

      await labOrderApi.updateLabOrder(labOrderId, payload);
      setLabOrder((prev) => ({ ...prev, status: 'processing', ...payload }));
      setMessage({ type: 'success', text: 'Đã lưu nháp kết quả xét nghiệm.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Lỗi khi lưu nháp:', err);
      const msg = err.response?.data?.message || 'Không thể lưu nháp.';
      setMessage({ type: 'error', text: msg });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Hoàn tất → PATCH /lab-orders/:id { result_summary, result_file_url, status: 'completed' }
  const handleComplete = async () => {
    if (!resultSummary.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập kết quả xét nghiệm trước khi hoàn tất.' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      setSaving(true);
      const payload = {
        result_summary: resultSummary.trim(),
        result_file_url: resultFileUrl.trim(),
        status: 'completed',
      };

      await labOrderApi.updateLabOrder(labOrderId, payload);
      setLabOrder((prev) => ({ ...prev, status: 'completed', ...payload }));
      setMessage({ type: 'success', text: 'Hoàn tất xét nghiệm! Kết quả đã được gửi cho bác sĩ chỉ định.' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      console.error('Lỗi khi hoàn tất:', err);
      const msg = err.response?.data?.message || 'Không thể hoàn tất xét nghiệm.';
      setMessage({ type: 'error', text: msg });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  // ===== LOADING STATE =====
  if (pageLoading) {
    return (
      <div className="lr-layout">
        <DoctorSidebar activePage="lab-queue" role="lab" />
        <main className="lr-main">
          <div className="lr-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
              <FiLoader size={32} className="lr-spin" style={{ color: '#3b82f6', marginBottom: 16 }} />
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Đang tải dữ liệu xét nghiệm...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ===== ERROR STATE =====
  if (pageError || !labOrder) {
    return (
      <div className="lr-layout">
        <DoctorSidebar activePage="lab-queue" role="lab" />
        <main className="lr-main">
          <div className="lr-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
              <FiAlertCircle size={32} style={{ color: '#ef4444', marginBottom: 16 }} />
              <p style={{ color: '#ef4444', fontSize: '0.95rem', marginBottom: 16 }}>
                {pageError || 'Không tìm thấy dữ liệu.'}
              </p>
              <button
                className="lr-btn lr-btn--outline"
                onClick={() => navigate('/lab/queue')}
                type="button"
              >
                <FiArrowLeft size={16} />
                Quay lại danh sách
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isCompleted = labOrder.status === 'completed';
  const statusInfo = STATUS_MAP[labOrder.status] || STATUS_MAP.ordered;
  const StatusIcon = statusInfo.icon;

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
                  <span className="lr-badge">
                    ID: {labOrder.patient_id ? `${labOrder.patient_id.slice(0, 8)}...` : '—'}
                  </span>
                  <span className="lr-meta-sep">•</span>
                  <span>{labOrder.age ? `${labOrder.age} tuổi` : '—'}</span>
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
                  disabled={saving}
                >
                  {saving ? (
                    <FiLoader size={16} className="lr-spin" />
                  ) : (
                    <FiActivity size={16} />
                  )}
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
                    <span className="lr-info-value">{labOrder.doctor_name || '—'}</span>
                  </div>
                  <div className="lr-info-row">
                    <span className="lr-info-label">Mã phiếu</span>
                    <span className="lr-info-value">
                      {labOrder.lab_order_id ? `${labOrder.lab_order_id.slice(0, 8)}...` : '—'}
                    </span>
                  </div>
                  <div className="lr-info-row">
                    <span className="lr-info-label">Thời gian chỉ định</span>
                    <span className="lr-info-value">
                      {labOrder.created_at
                        ? new Date(labOrder.created_at).toLocaleString('vi-VN')
                        : '—'}
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
