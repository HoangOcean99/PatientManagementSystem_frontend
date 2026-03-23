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
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import labOrderApi from '../../api/labOrderApi';
import './LabQueuePage.css';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// ===== HELPERS =====
const STATUS_CONFIG = {
  ordered: { label: 'Chờ xét nghiệm', icon: FiClock, className: 'lq-status--ordered' },
  processing: { label: 'Đang xử lý', icon: FiActivity, className: 'lq-status--processing' },
  completed: { label: 'Hoàn tất', icon: FiCheckCircle, className: 'lq-status--completed' },
};

const FILTER_OPTIONS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'ordered', label: 'Chờ XN' },
  { key: 'processing', label: 'Đang xử lý' },
  { key: 'completed', label: 'Hoàn tất' },
];

const getInitials = (name) =>
  name ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(-2) : '?';

const getGenderLabel = (g) => (g === 'male' ? 'Nam' : g === 'female' ? 'Nữ' : 'Khác');

const formatTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const getToday = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // 'YYYY-MM-DD' local time
};

const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
};

const shiftDate = (dateStr, days) => {
  if (!dateStr) return getToday();
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // 'YYYY-MM-DD' local time
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
  const [selectedDate, setSelectedDate] = useState(getToday());

  const isToday = selectedDate === getToday();

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

        // Map data từ API — backend join: LabOrders → MedicalRecords → Appointments → Patients/Doctors/DoctorSlots
        const rawLabOrders = Array.isArray(data) ? data
          : data?.lab_orders ? data.lab_orders
          : [];

        const mapped = rawLabOrders.map((lo) => {
          const appt = lo.MedicalRecords?.Appointments;
          const patientUser = appt?.Patients?.Users;
          const doctorUser = appt?.Doctors?.Users;

          return {
            lab_order_id: lo.lab_order_id,
            record_id: lo.record_id,
            lab_service_id: lo.lab_service_id,
            lab_service_name: lo.LabServices?.name || '',
            status: lo.status,
            result_summary: lo.result_summary || '',
            result_file_url: lo.result_file_url || '',
            created_at: lo.created_at,
            appointment_date: appt?.DoctorSlots?.slot_date || '',
            // Patient info
            patient_name: patientUser?.full_name || 'N/A',
            patient_id: appt?.patient_id || '',
            gender: patientUser?.gender || '',
            phone: patientUser?.phone_number || '',
            age: calculateAge(patientUser?.dob),
            // Doctor info
            doctor_name: doctorUser?.full_name || '',
          };
        });

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

  const dateFilteredOrders = useMemo(() => {
    return labOrders.filter((lo) => {
      let dateMatch = false;
      if (lo.appointment_date) {
         dateMatch = lo.appointment_date === selectedDate;
      } else if (lo.created_at) {
         const createdDate = new Date(lo.created_at);
         const year = createdDate.getFullYear();
         const month = String(createdDate.getMonth() + 1).padStart(2, '0');
         const day = String(createdDate.getDate()).padStart(2, '0');
         const createdDateStr = `${year}-${month}-${day}`;
         dateMatch = createdDateStr === selectedDate;
      } else {
         dateMatch = true; 
      }
      return dateMatch;
    });
  }, [labOrders, selectedDate]);

  const filtered = useMemo(() => {
    return dateFilteredOrders.filter((lo) => {
      const matchSearch =
        lo.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lo.lab_service_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || lo.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [dateFilteredOrders, searchTerm, statusFilter]);

  // Stats
  const orderedCount = dateFilteredOrders.filter((l) => l.status === 'ordered').length;
  const processingCount = dateFilteredOrders.filter((l) => l.status === 'processing').length;
  const completedCount = dateFilteredOrders.filter((l) => l.status === 'completed').length;

  if (loading) {
    return (
      <div className="relative flex-1">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <main className="lq-main p-8">
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
              {isToday ? 'Xét nghiệm hôm nay' : 'Xét nghiệm'}
            </h1>
            <p className="lq-header__date">{formatDateDisplay(selectedDate)}</p>
          </div>
          <div className="lq-header__date-nav">
            <button
              className="lq-date-btn"
              onClick={() => setSelectedDate(prev => shiftDate(prev, -1))}
              title="Ngày trước"
            >
              <FiChevronLeft size={18} />
            </button>
            <input
              type="date"
              className="lq-date-picker"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button
              className="lq-date-btn"
              onClick={() => setSelectedDate(prev => shiftDate(prev, 1))}
              title="Ngày sau"
            >
              <FiChevronRight size={18} />
            </button>
            {!isToday && (
              <button
                className="lq-date-btn lq-date-btn--today"
                onClick={() => setSelectedDate(getToday())}
              >
                Hôm nay
              </button>
            )}
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
              <span className="lq-stat-card__label">{isToday ? 'Hoàn tất hôm nay' : 'Hoàn tất'}</span>
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
                          <span className="lq-test-name">{lo.lab_service_name}</span>
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
                Hiển thị {filtered.length} / {dateFilteredOrders.length} xét nghiệm
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
  );
};

export default LabQueuePage;
