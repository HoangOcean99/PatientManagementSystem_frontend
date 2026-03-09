import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiSearch,
  FiPlay,
  FiEye,
  FiInbox,
  FiLoader,
  FiAlertCircle,
} from 'react-icons/fi';
import { getAppointmentsByDoctorId } from '../../api/doctorApi';
import './DoctorSchedulePage.css';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// ===== HELPERS =====
const STATUS_LABELS = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  checked_in: 'Đã check-in',
  ready: 'Sẵn sàng',
  waiting: 'Chờ khám',
  in_progress: 'Đang khám',
  completed: 'Hoàn tất',
  cancelled: 'Đã hủy',
  missed: 'Vắng mặt',
};

const getGenderLabel = (g) => (g === 'male' ? 'Nam' : g === 'female' ? 'Nữ' : 'Khác');

const getInitials = (name) =>
  name ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(-2) : '?';

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

const formatTime = (t) => {
  if (!t) return '';
  return t.length > 5 ? t.slice(0, 5) : t;
};

const FILTER_OPTIONS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'waiting', label: 'Chờ khám' },
  { key: 'ready', label: 'Sẵn sàng' },
  { key: 'in_progress', label: 'Đang khám' },
  { key: 'completed', label: 'Hoàn tất' },
];

// ===== ANIMATION =====
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const DoctorSchedulePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Lấy doctor_id từ auth context thay vì hardcode
        const doctorId = localStorage.getItem('doctor_id') || '85be2ff0-0b7d-489f-a63a-9a0538338773';
        const response = await getAppointmentsByDoctorId(doctorId);
        const data = response.data?.data || response.data || [];

        const mapped = (Array.isArray(data) ? data : []).map((appt) => ({
          appointment_id: appt.appointment_id,
          queue_number: appt.queue_number,
          patient_name: appt.Patients?.Users?.full_name || 'N/A',
          patient_id: appt.Patients?.patient_id || appt.patient_id,
          gender: appt.Patients?.gender || '',
          age: calculateAge(appt.Patients?.dob),
          phone: appt.Patients?.Users?.phone_number || '',
          start_time: formatTime(appt.start_time),
          end_time: formatTime(appt.end_time),
          status: appt.status,
          service: appt.ClinicServices?.name || '',
        }));

        setAppointments(mapped);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError('Không thể tải danh sách lịch khám. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filtered = useMemo(() => {
    return appointments.filter((appt) => {
      const matchSearch = appt.patient_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || appt.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [appointments, searchTerm, statusFilter]);
  if (loading) {
    return (
      <div className="relative flex-1">
        <LoadingSpinner />
      </div>
    )
  }
  return (
    <div className="sched-layout">

      <main className="sched-main p-8">
        <motion.div
          className="sched-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Page Header */}
          <motion.div className="sched-header" variants={itemVariants}>
            <div className="sched-header__left">
              <h1 className="sched-header__title">
                <FiCalendar size={22} />
                Lịch khám hôm nay
              </h1>
              <p className="sched-header__date">{getTodayFormatted()}</p>
            </div>
          </motion.div>

          {/* Filter Bar */}
          <motion.div className="sched-filters" variants={itemVariants}>
            <div className="sched-search">
              <FiSearch size={16} className="sched-search__icon" />
              <input
                type="text"
                className="sched-search__input"
                placeholder="Tìm kiếm bệnh nhân..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="sched-filter-tabs">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  className={`sched-filter-tab ${statusFilter === opt.key ? 'sched-filter-tab--active' : ''}`}
                  onClick={() => setStatusFilter(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Patient Table */}
          <motion.div className="sched-table-wrap" variants={itemVariants}>
            {loading ? (
              <div className="sched-empty">
                <div className="sched-empty__icon">
                  <FiLoader size={24} className="sched-spin" />
                </div>
                <p className="sched-empty__text">Đang tải danh sách lịch khám...</p>
              </div>
            ) : error ? (
              <div className="sched-empty">
                <div className="sched-empty__icon" style={{ background: '#FEF2F2', color: '#EF4444' }}>
                  <FiAlertCircle size={24} />
                </div>
                <p className="sched-empty__text" style={{ color: '#EF4444' }}>{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="sched-empty">
                <div className="sched-empty__icon">
                  <FiInbox size={24} />
                </div>
                <p className="sched-empty__text">Không tìm thấy bệnh nhân nào.</p>
              </div>
            ) : (
              <>
                <table className="sched-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Bệnh nhân</th>
                      <th>Giờ hẹn</th>
                      <th>Dịch vụ</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((appt) => (
                      <tr key={appt.appointment_id}>
                        <td data-label="STT">
                          <span className="sched-queue">{appt.queue_number}</span>
                        </td>
                        <td data-label="Bệnh nhân">
                          <div className="sched-patient-cell">
                            <div className="sched-patient-avatar">
                              {getInitials(appt.patient_name)}
                            </div>
                            <div>
                              <div className="sched-patient-name">{appt.patient_name}</div>
                              <div className="sched-patient-meta">
                                {getGenderLabel(appt.gender)} • {appt.age} tuổi
                              </div>
                            </div>
                          </div>
                        </td>
                        <td data-label="Giờ hẹn">
                          <span className="sched-time">{appt.start_time} - {appt.end_time}</span>
                        </td>
                        <td data-label="Dịch vụ">{appt.service}</td>
                        <td data-label="Trạng thái">
                          <span className={`sched-status sched-status--${appt.status}`}>
                            {STATUS_LABELS[appt.status]}
                          </span>
                        </td>
                        <td data-label="Hành động">
                          <div className="sched-actions">
                            {(appt.status === 'waiting' || appt.status === 'ready') && (
                              <button
                                className="sched-action-btn sched-action-btn--start"
                                onClick={() => navigate(`/doctor/examine/${appt.appointment_id}`)}
                              >
                                <FiPlay size={14} />
                                Bắt đầu khám
                              </button>
                            )}
                            {appt.status === 'in_progress' && (
                              <button
                                className="sched-action-btn sched-action-btn--start"
                                onClick={() => navigate(`/doctor/examine/${appt.appointment_id}`)}
                              >
                                <FiPlay size={14} />
                                Tiếp tục khám
                              </button>
                            )}
                            <button
                              className="sched-action-btn sched-action-btn--view"
                              onClick={() => navigate(`/doctor/patient/${appt.patient_id}`)}
                            >
                              <FiEye size={14} />
                              Xem hồ sơ
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="sched-result-count">
                  Hiển thị {filtered.length} / {appointments.length} bệnh nhân
                </div>
              </>
            )}
          </motion.div>

          {/* Footer */}
          <motion.footer className="sched-footer" variants={itemVariants}>
            <p>&copy; 2026 MedSchedule. All rights reserved.</p>
          </motion.footer>
        </motion.div>
      </main>
    </div>
  );
};

export default DoctorSchedulePage;
