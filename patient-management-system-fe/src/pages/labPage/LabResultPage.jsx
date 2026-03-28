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
  FiDownload,
  FiFile,
} from 'react-icons/fi';
import './LabResultPage.css';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import labOrderApi from '../../api/labOrderApi';

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
  ordered: { label: 'Chờ xét nghiệm', color: 'lr-status--ordered', icon: FiClock },
  processing: { label: 'Đang xử lý', color: 'lr-status--processing', icon: FiActivity },
  completed: { label: 'Hoàn tất', color: 'lr-status--completed', icon: FiCheckCircle },
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
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
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

        // Map data — backend join: LabOrders → MedicalRecords → Appointments → Patients/Doctors/DoctorSlots
        const appt = data.MedicalRecords?.Appointments;
        const patientUser = appt?.Patients?.Users;
        const doctorUser = appt?.Doctors?.Users;

        const mapped = {
          lab_order_id: data.lab_order_id,
          record_id: data.record_id,
          test_name: data.LabServices?.name || '',
          result_summary: data.result_summary || '',
          result_file_url: data.result_file_url || '',
          status: data.status,
          created_at: data.created_at,
          appointment_date: appt?.DoctorSlots?.slot_date || '',
          // Patient info
          patient_name: patientUser?.full_name || 'N/A',
          patient_id: appt?.patient_id || '',
          gender: patientUser?.gender || '',
          phone: patientUser?.phone_number || '',
          age: calculateAge(patientUser?.dob),
          allergies: appt?.Patients?.allergies || '',
          // Doctor info
          doctor_name: doctorUser?.full_name || '',
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.match(/\.(xlsx|xls)$/)) {
        setMessage({ type: 'error', text: 'Vui lòng chọn file Excel (.xlsx hoặc .xls).' });
        setTimeout(() => setMessage(null), 3000);
        return;
      }
      setSelectedFile(file);
    }
  };

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

  // Lưu nháp → PATCH /lab-orders/:id { result_summary, result_file }
  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      setUploading(true);

      const formData = new FormData();
      formData.append('result_summary', resultSummary.trim());
      if (selectedFile) {
        formData.append('result_file', selectedFile);
      }

      const response = await labOrderApi.updateLabOrder(labOrderId, formData);
      const updatedData = response.data?.data || response.data;

      setLabOrder((prev) => ({ ...prev, ...updatedData }));
      setResultFileUrl(updatedData.result_file_url);
      setSelectedFile(null);
      setMessage({ type: 'success', text: 'Đã lưu nháp kết quả xét nghiệm.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Lỗi khi lưu nháp:', err);
      const msg = err.response?.data?.message || err.message || 'Không thể lưu nháp.';
      setMessage({ type: 'error', text: msg });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  // Hoàn tất → PATCH /lab-orders/:id { result_summary, result_file, status: 'completed' }
  const handleComplete = async () => {
    if (!resultSummary.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập kết quả xét nghiệm trước khi hoàn tất.' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      setSaving(true);
      setUploading(true);

      const formData = new FormData();
      formData.append('result_summary', resultSummary.trim());
      formData.append('status', 'completed');
      if (selectedFile) {
        formData.append('result_file', selectedFile);
      }

      const response = await labOrderApi.updateLabOrder(labOrderId, formData);
      const updatedData = response.data?.data || response.data;

      setLabOrder((prev) => ({ ...prev, status: 'completed', ...updatedData }));
      setResultFileUrl(updatedData.result_file_url);
      setSelectedFile(null);
      setMessage({ type: 'success', text: 'Hoàn tất xét nghiệm! Kết quả đã được gửi cho bác sĩ chỉ định.' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      console.error('Lỗi khi hoàn tất:', err);
      const msg = err.response?.data?.message || err.message || 'Không thể hoàn tất xét nghiệm.';
      setMessage({ type: 'error', text: msg });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  // ===== LOADING STATE =====
  if (pageLoading) {
    return (
      <div className="relative flex-1">
        <LoadingSpinner />
      </div>
    )
  }

  // ===== ERROR STATE =====
  if (pageError || !labOrder) {
    return (
      <main className="lr-main p-8">
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
    );
  }

  const isCompleted = labOrder.status === 'completed';
  const isProcessing = labOrder.status === 'processing';
  const isEditable = isProcessing;

  const statusInfo = STATUS_MAP[labOrder.status] || STATUS_MAP.ordered;
  const StatusIcon = statusInfo.icon;

  return (
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
                    disabled={!isEditable}
                  />
                </div>

                {/* result_file_url */}
                <div className="lr-field">
                  <label className="lr-field__label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>
                      <FiUpload size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                      File kết quả xét nghiệm (.xlsx)
                    </span>
                    <a
                      href="https://iechlwjalclhmnpjdafj.supabase.co/storage/v1/object/public/Template/Template-lab.xlsx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lr-template-link"
                      style={{
                        color: '#2563EB',
                        textDecoration: 'none',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: '#EFF6FF',
                        border: '1px solid #DBEAFE'
                      }}
                      download
                    >
                      <FiDownload size={12} />
                      Tải file mẫu (Template)
                    </a>
                  </label>

                  <div className="lr-upload-area" style={{
                    border: '1.5px dashed #E2E8F0',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    background: '#F8FAFC',
                    position: 'relative'
                  }}>
                    <input
                      id="resultFile"
                      type="file"
                      accept=".xlsx, .xls"
                      className="lr-file-input"
                      onChange={handleFileChange}
                      disabled={!isEditable || uploading}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0,
                        cursor: isEditable ? 'pointer' : 'not-allowed'
                      }}
                    />

                    <div style={{ position: 'relative', zIndex: 10 }}>
                      {!selectedFile && !resultFileUrl && (
                        <div style={{ color: '#94A3B8', fontSize: '13px' }}>
                          <FiUpload size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
                          <p>Nhấp để chọn file Excel kết quả</p>
                        </div>
                      )}

                      {selectedFile && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#2563EB', fontWeight: '600' }}>
                          <FiFile size={18} />
                          <span style={{ fontSize: '13px', }}>{selectedFile.name}</span>
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedFile(null); }}
                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      )}

                      {!selectedFile && resultFileUrl && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10B981', fontWeight: '600' }}>
                          <FiCheckCircle size={18} />
                          <a href={resultFileUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', fontSize: '13px', textDecoration: 'underline' }}>
                            Xem file đã tải lên
                          </a>
                          {isEditable && (
                            <span style={{ color: '#94A3B8', fontSize: '11px', fontWeight: 'normal' }}>(Nhấp để thay đổi)</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {uploading && (
                    <p style={{ fontSize: '11px', color: '#2563EB', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiLoader size={12} className="lr-spin" /> Đang tải file lên...
                    </p>
                  )}
                  <p className="lr-field__hint">Định dạng hỗ trợ: .xlsx, .xls</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Bar */}
        {isProcessing && (
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
  );
};

export default LabResultPage;
