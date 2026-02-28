import React, { useState, useMemo } from 'react';
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
} from 'react-icons/fi';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import './LabQueuePage.css';

// ===== MOCK DATA =====
// In production: GET /api/lab-orders?status=ordered,processing
// Joins: LabOrders → MedicalRecords → Patients (+ Users)
const MOCK_LAB_ORDERS = [
  {
    lab_order_id: 'lo-001',
    record_id: 'r-001',
    test_name: 'Xét nghiệm máu tổng quát',
    status: 'ordered',       // lab_status enum
    created_at: '2026-02-28T08:15:00',
    // Joined from MedicalRecords → Patients → Users
    patient_name: 'Nguyễn Thị An',
    patient_id: 'p-001',
    gender: 'female',
    age: 34,
    doctor_name: 'BS. Nguyễn Văn Bác Sĩ',
  },
  {
    lab_order_id: 'lo-002',
    record_id: 'r-001',
    test_name: 'Xét nghiệm nước tiểu',
    status: 'ordered',
    created_at: '2026-02-28T08:15:00',
    patient_name: 'Nguyễn Thị An',
    patient_id: 'p-001',
    gender: 'female',
    age: 34,
    doctor_name: 'BS. Nguyễn Văn Bác Sĩ',
  },
  {
    lab_order_id: 'lo-003',
    record_id: 'r-002',
    test_name: 'Xét nghiệm đường huyết',
    status: 'processing',
    created_at: '2026-02-28T08:30:00',
    patient_name: 'Trần Văn Bình',
    patient_id: 'p-002',
    gender: 'male',
    age: 52,
    doctor_name: 'BS. Lê Minh Hoàng',
  },
  {
    lab_order_id: 'lo-004',
    record_id: 'r-003',
    test_name: 'Xét nghiệm chức năng gan',
    status: 'ordered',
    created_at: '2026-02-28T09:00:00',
    patient_name: 'Phạm Thị Dung',
    patient_id: 'p-003',
    gender: 'female',
    age: 45,
    doctor_name: 'BS. Nguyễn Văn Bác Sĩ',
  },
  {
    lab_order_id: 'lo-005',
    record_id: 'r-004',
    test_name: 'Xét nghiệm mỡ máu',
    status: 'ordered',
    created_at: '2026-02-28T09:15:00',
    patient_name: 'Hoàng Văn Phú',
    patient_id: 'p-004',
    gender: 'male',
    age: 60,
    doctor_name: 'BS. Lê Minh Hoàng',
  },
  {
    lab_order_id: 'lo-006',
    record_id: 'r-005',
    test_name: 'Xét nghiệm công thức máu',
    status: 'completed',
    created_at: '2026-02-28T07:45:00',
    patient_name: 'Vũ Thị Mai',
    patient_id: 'p-005',
    gender: 'female',
    age: 28,
    doctor_name: 'BS. Nguyễn Văn Bác Sĩ',
  },
];

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

  // TODO: Replace with API call
  const labOrders = MOCK_LAB_ORDERS;

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
            {filtered.length === 0 ? (
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
                                  {getGenderLabel(lo.gender)} • {lo.age} tuổi
                                </div>
                              </div>
                            </div>
                          </td>
                          <td data-label="Tên xét nghiệm">
                            <span className="lq-test-name">{lo.test_name}</span>
                          </td>
                          <td data-label="BS chỉ định">
                            <span className="lq-doctor-name">{lo.doctor_name}</span>
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
