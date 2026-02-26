import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiSearch,
  FiPlay,
  FiEye,
  FiInbox,
} from 'react-icons/fi';
import './DoctorSchedulePage.css';

// ===== MOCK DATA =====
const MOCK_APPOINTMENTS = [
  {
    appointment_id: 'a-001',
    queue_number: 1,
    patient_name: 'Nguyễn Văn A',
    patient_id: 'p-001',
    gender: 'male',
    age: 35,
    phone: '0901234001',
    start_time: '08:00',
    end_time: '08:30',
    status: 'completed',
    service: 'Khám tổng quát',
  },
  {
    appointment_id: 'a-002',
    queue_number: 2,
    patient_name: 'Trần Thị B',
    patient_id: 'p-002',
    gender: 'female',
    age: 28,
    phone: '0901234002',
    start_time: '08:30',
    end_time: '09:00',
    status: 'completed',
    service: 'Nội khoa',
  },
  {
    appointment_id: 'a-003',
    queue_number: 3,
    patient_name: 'Lê Minh C',
    patient_id: 'p-003',
    gender: 'male',
    age: 45,
    phone: '0901234003',
    start_time: '09:00',
    end_time: '09:30',
    status: 'in_progress',
    service: 'Nội khoa',
  },
  {
    appointment_id: 'a-004',
    queue_number: 4,
    patient_name: 'Phạm Thị D',
    patient_id: 'p-004',
    gender: 'female',
    age: 52,
    phone: '0901234004',
    start_time: '09:30',
    end_time: '10:00',
    status: 'waiting',
    service: 'Tim mạch',
  },
  {
    appointment_id: 'a-005',
    queue_number: 5,
    patient_name: 'Hoàng Văn E',
    patient_id: 'p-005',
    gender: 'male',
    age: 30,
    phone: '0901234005',
    start_time: '10:00',
    end_time: '10:30',
    status: 'waiting',
    service: 'Khám tổng quát',
  },
  {
    appointment_id: 'a-006',
    queue_number: 6,
    patient_name: 'Ngô Thị F',
    patient_id: 'p-006',
    gender: 'female',
    age: 40,
    phone: '0901234006',
    start_time: '10:30',
    end_time: '11:00',
    status: 'waiting',
    service: 'Nội khoa',
  },
  {
    appointment_id: 'a-007',
    queue_number: 7,
    patient_name: 'Vũ Đức G',
    patient_id: 'p-007',
    gender: 'male',
    age: 60,
    phone: '0901234007',
    start_time: '11:00',
    end_time: '11:30',
    status: 'waiting',
    service: 'Tim mạch',
  },
];

// ===== HELPERS =====
const STATUS_LABELS = {
  waiting: 'Chờ khám',
  in_progress: 'Đang khám',
  completed: 'Hoàn tất',
};

const getGenderLabel = (g) => (g === 'male' ? 'Nam' : g === 'female' ? 'Nữ' : 'Khác');

const getInitials = (name) =>
  name ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(-2) : '?';

const getTodayFormatted = () => {
  const d = new Date();
  return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
};

const FILTER_OPTIONS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'waiting', label: 'Chờ khám' },
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

  // TODO: Replace with API call
  const appointments = MOCK_APPOINTMENTS;

  const filtered = useMemo(() => {
    return appointments.filter((appt) => {
      const matchSearch = appt.patient_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || appt.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [appointments, searchTerm, statusFilter]);

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
            {filtered.length === 0 ? (
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
                            {appt.status === 'waiting' && (
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
