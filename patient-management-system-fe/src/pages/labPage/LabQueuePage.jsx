import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiActivity,
  FiSearch,
  FiPlay,
  FiEye,
  FiInbox,
  FiCheckCircle,
  FiClock,
  FiLoader,
  FiAlertCircle,
} from 'react-icons/fi';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import labOrderApi from '../../api/labOrderApi';
import './LabQueuePage.css';

// ===== HELPERS =====
const STATUS_CONFIG = {
  ordered:    { label: 'Chờ xét nghiệm', icon: FiClock,       className: 'lq-status--ordered' },
  processing: { label: 'Đang xử lý',     icon: FiActivity,    className: 'lq-status--processing' },
  completed:  { label: 'Hoàn tất',        icon: FiCheckCircle, className: 'lq-status--completed' },
};

const FILTER_OPTIONS = [
  { key: 'all',        label: 'Tất cả' },
  { key: 'ordered',    label: 'Chờ XN' },
  { key: 'processing', label: 'Đang xử lý' },
  { key: 'completed',  label: 'Hoàn tất' },
];

const getInitials = (name) =>
  name ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(-2) : '?';

const getGenderLabel = (g) => (g === 'male' ? 'Nam' : g === 'female' ? 'Nữ' : 'Khác');

const formatTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const getTodayFormatted = () => {
  const d = new Date();
  return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
};

const calculateAge = (dob) => {
  if (!dob) return '';
  const today = new Date();
  const b = new Date(dob);
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
  return age;
};

// ===== ANIMATION =====
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const LabQueuePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // API states
  const [labOrders, setLabOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch lab orders on mount
  useEffect(() => {
    const fetchLabOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await labOrderApi.getAllLabOrders();
        const data = response.data?.data || response.data || [];

        // Map data từ API — backend join MedicalRecords → Patients → Users
        const mapped = (Array.isArray(data) ? data : []).map((lo) => ({
          lab_order_id: lo.lab_order_id,
          record_id: lo.record_id,
          test_name: lo.test_name,
          status: lo.status,
          result_summary: lo.result_summary || '',
          result_file_url: lo.result_file_url || '',
          created_at: lo.created_at,
          // Joined patient info (nested from backend)
          patient_name: lo.MedicalRecord?.Patient?.User?.full_name
            || lo.MedicalRecords?.Patients?.Users?.full_name
            || lo.patient_name
            || 'N/A',
          patient_id: lo.MedicalRecord?.Patient?.patient_id
            || lo.MedicalRecords?.Patients?.patient_id
            || lo.patient_id
            || '',
          gender: lo.MedicalRecord?.Patient?.gender
            || lo.MedicalRecords?.Patients?.gender
            || lo.gender
            || '',
          age: calculateAge(
            lo.MedicalRecord?.Patient?.dob
            || lo.MedicalRecords?.Patients?.dob
            || lo.dob
          ),
          // Joined doctor info
          doctor_name: lo.MedicalRecord?.Doctor?.User?.full_name
            || lo.MedicalRecords?.Doctors?.Users?.full_name
            || lo.doctor_name
            || '',
        }));

        setLabOrders(mapped);
      } catch (err) {
        console.error('Failed to fetch lab orders:', err);
        setError('Không thể tải danh sách xét nghiệm. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchLabOrders();
  }, []);

  const filtered = useMemo(() => {
    return labOrders.filter((lo) => {
      const matchSearch =
        lo.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lo.test_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || lo.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [labOrders, searchTerm, statusFilter]);

  // Stats
  const orderedCount = labOrders.filter((l) => l.status === 'ordered').length;
  const processingCount = labOrders.filter((l) => l.status === 'processing').length;
  const completedCount = labOrders.filter((l) => l.status === 'completed').length;

  return (
    <div className="lq-layout">
      <DoctorSidebar activePage="lab-queue" role="lab" />

      <main className="lq-main">
        <motion.div
          className="lq-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Page Header */}
          <motion.div className="lq-header" variants={itemVariants}>
            <div className="lq-header__left">
              <h1 className="lq-header__title">
                <FiActivity size={22} />
                Danh sách chờ xét nghiệm
              </h1>
              <p className="lq-header__date">{getTodayFormatted()}</p>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div className="lq-stats" variants={itemVariants}>
            <div className="lq-stat-card lq-stat-card--ordered">
              <div className="lq-stat-card__icon">
                <FiClock size={20} />
              </div>
              <div className="lq-stat-card__info">
                <span className="lq-stat-card__value">{orderedCount}</span>
                <span className="lq-stat-card__label">Chờ xét nghiệm</span>
              </div>
            </div>
            <div className="lq-stat-card lq-stat-card--processing">
              <div className="lq-stat-card__icon">
                <FiActivity size={20} />
              </div>
              <div className="lq-stat-card__info">
                <span className="lq-stat-card__value">{processingCount}</span>
                <span className="lq-stat-card__label">Đang xử lý</span>
              </div>
            </div>
            <div className="lq-stat-card lq-stat-card--completed">
              <div className="lq-stat-card__icon">
                <FiCheckCircle size={20} />
              </div>
              <div className="lq-stat-card__info">
                <span className="lq-stat-card__value">{completedCount}</span>
                <span className="lq-stat-card__label">Hoàn tất hôm nay</span>
              </div>
            </div>
          </motion.div>

          {/* Filter Bar */}
          <motion.div className="lq-filters" variants={itemVariants}>
            <div className="lq-search">
              <FiSearch size={16} className="lq-search__icon" />
              <input
                type="text"
                className="lq-search__input"
                placeholder="Tìm theo tên bệnh nhân hoặc xét nghiệm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="lq-filter-tabs">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  className={`lq-filter-tab ${statusFilter === opt.key ? 'lq-filter-tab--active' : ''}`}
                  onClick={() => setStatusFilter(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Table */}
          <motion.div className="lq-table-wrap" variants={itemVariants}>
            {loading ? (
              <div className="lq-empty">
                <div className="lq-empty__icon">
                  <FiLoader size={24} className="lq-spin" />
                </div>
                <p className="lq-empty__text">Đang tải danh sách xét nghiệm...</p>
              </div>
            ) : error ? (
              <div className="lq-empty">
                <div className="lq-empty__icon" style={{ background: '#FEF2F2', color: '#EF4444' }}>
                  <FiAlertCircle size={24} />
                </div>
                <p className="lq-empty__text" style={{ color: '#EF4444' }}>{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="lq-empty">
                <div className="lq-empty__icon">
                  <FiInbox size={24} />
                </div>
                <p className="lq-empty__text">Không tìm thấy yêu cầu xét nghiệm nào.</p>
              </div>
            ) : (
              <>
                <table className="lq-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Bệnh nhân</th>
                      <th>Tên xét nghiệm</th>
                      <th>BS chỉ định</th>
                      <th>Thời gian</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((lo, idx) => {
                      const statusConf = STATUS_CONFIG[lo.status] || STATUS_CONFIG.ordered;
                      const StatusIcon = statusConf.icon;
                      return (
                        <tr key={lo.lab_order_id}>
                          <td data-label="#">
                            <span className="lq-queue">{idx + 1}</span>
                          </td>
                          <td data-label="Bệnh nhân">
                            <div className="lq-patient-cell">
                              <div className="lq-patient-avatar">
                                {getInitials(lo.patient_name)}
                              </div>
                              <div>
                                <div className="lq-patient-name">{lo.patient_name}</div>
                                <div className="lq-patient-meta">
                                  {getGenderLabel(lo.gender)} {lo.age ? `• ${lo.age} tuổi` : ''}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td data-label="Tên xét nghiệm">
                            <span className="lq-test-name">{lo.test_name}</span>
                          </td>
                          <td data-label="BS chỉ định">
                            <span className="lq-doctor-name">{lo.doctor_name || '—'}</span>
                          </td>
                          <td data-label="Thời gian">
                            <span className="lq-time">{formatTime(lo.created_at)}</span>
                          </td>
                          <td data-label="Trạng thái">
                            <span className={`lq-status ${statusConf.className}`}>
                              <StatusIcon size={12} />
                              {statusConf.label}
                            </span>
                          </td>
                          <td data-label="Hành động">
                            <div className="lq-actions">
                              {lo.status === 'ordered' && (
                                <button
                                  className="lq-action-btn lq-action-btn--start"
                                  onClick={() => navigate(`/lab/result/${lo.lab_order_id}`)}
                                >
                                  <FiPlay size={14} />
                                  Tiếp nhận
                                </button>
                              )}
                              {lo.status === 'processing' && (
                                <button
                                  className="lq-action-btn lq-action-btn--start"
                                  onClick={() => navigate(`/lab/result/${lo.lab_order_id}`)}
                                >
                                  <FiPlay size={14} />
                                  Tiếp tục
                                </button>
                              )}
                              {lo.status === 'completed' && (
                                <button
                                  className="lq-action-btn lq-action-btn--view"
                                  onClick={() => navigate(`/lab/result/${lo.lab_order_id}`)}
                                >
                                  <FiEye size={14} />
                                  Xem kết quả
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="lq-result-count">
                  Hiển thị {filtered.length} / {labOrders.length} xét nghiệm
                </div>
              </>
            )}
          </motion.div>

          {/* Footer */}
          <motion.footer className="lq-footer" variants={itemVariants}>
            <p>&copy; 2026 MedSchedule. All rights reserved.</p>
          </motion.footer>
        </motion.div>
      </main>
    </div>
  );
};

export default LabQueuePage;
