import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiUser,
  FiArrowRight,
  FiInbox,
} from 'react-icons/fi';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import './DoctorDashboardPage.css';

// ===== MOCK DATA =====
const MOCK_APPOINTMENTS = [
  {
    appointment_id: 'a-001',
    queue_number: 1,
    patient_name: 'Nguyễn Văn A',
    patient_id: 'p-001',
    gender: 'male',
    age: 35,
    start_time: '08:00',
    end_time: '08:30',
    status: 'completed',
  },
  {
    appointment_id: 'a-002',
    queue_number: 2,
    patient_name: 'Trần Thị B',
    patient_id: 'p-002',
    gender: 'female',
    age: 28,
    start_time: '08:30',
    end_time: '09:00',
    status: 'completed',
  },
  {
    appointment_id: 'a-003',
    queue_number: 3,
    patient_name: 'Lê Minh C',
    patient_id: 'p-003',
    gender: 'male',
    age: 45,
    start_time: '09:00',
    end_time: '09:30',
    status: 'in_progress',
  },
  {
    appointment_id: 'a-004',
    queue_number: 4,
    patient_name: 'Phạm Thị D',
    patient_id: 'p-004',
    gender: 'female',
    age: 52,
    start_time: '09:30',
    end_time: '10:00',
    status: 'waiting',
  },
  {
    appointment_id: 'a-005',
    queue_number: 5,
    patient_name: 'Hoàng Văn E',
    patient_id: 'p-005',
    gender: 'male',
    age: 30,
    start_time: '10:00',
    end_time: '10:30',
    status: 'waiting',
  },
];

// ===== HELPERS =====
const STATUS_LABELS = {
  waiting: 'Chờ khám',
  in_progress: 'Đang khám',
  completed: 'Hoàn tất',
};

const getGenderLabel = (g) => (g === 'male' ? 'Nam' : g === 'female' ? 'Nữ' : 'Khác');

const getTodayFormatted = () => {
  const d = new Date();
  const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
  return d.toLocaleDateString('vi-VN', options);
};

// ===== ANIMATION =====
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const DoctorDashboardPage = () => {
  const navigate = useNavigate();

  // TODO: Replace with API call
  const appointments = MOCK_APPOINTMENTS;
  const totalToday = appointments.length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const waitingCount = appointments.filter((a) => a.status === 'waiting' || a.status === 'in_progress').length;

  return (
    <div className="dash-layout" style={{ width: '100vw' }}>
      <DoctorSidebar activePage="dashboard" />

      <main className="dash-main">
        <motion.div
          className="dash-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Banner */}
          <motion.div className="dash-welcome" variants={itemVariants}>
            <h1 className="dash-welcome__greeting">
              Xin chào, Bác sĩ! 👋
            </h1>
            <p className="dash-welcome__date">{getTodayFormatted()}</p>
          </motion.div>

          {/* Stat Cards */}
          <motion.div className="dash-stats" variants={itemVariants}>
            <div className="dash-stat-card">
              <div className="dash-stat-card__icon dash-stat-card__icon--total">
                <FiUsers size={22} />
              </div>
              <div className="dash-stat-card__info">
                <p className="dash-stat-card__label">Tổng bệnh nhân hôm nay</p>
                <p className="dash-stat-card__value">{totalToday}</p>
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-card__icon dash-stat-card__icon--done">
                <FiCheckCircle size={22} />
              </div>
              <div className="dash-stat-card__info">
                <p className="dash-stat-card__label">Đã khám xong</p>
                <p className="dash-stat-card__value">{completedCount}</p>
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-card__icon dash-stat-card__icon--waiting">
                <FiClock size={22} />
              </div>
              <div className="dash-stat-card__info">
                <p className="dash-stat-card__label">Đang chờ khám</p>
                <p className="dash-stat-card__value">{waitingCount}</p>
              </div>
            </div>
          </motion.div>

          {/* Today's Appointments */}
          <motion.div className="dash-section" variants={itemVariants}>
            <div className="dash-section__header">
              <h2 className="dash-section__title">
                <FiCalendar size={18} />
                Lịch khám hôm nay
              </h2>
              <button
                className="dash-section__action"
                onClick={() => navigate('/doctor/schedule')}
              >
                Xem tất cả
                <FiArrowRight size={14} />
              </button>
            </div>

            <div className="dash-appointments">
              {appointments.length === 0 ? (
                <div className="dash-empty">
                  <div className="dash-empty__icon">
                    <FiInbox size={24} />
                  </div>
                  <p className="dash-empty__text">Không có lịch hẹn nào hôm nay.</p>
                </div>
              ) : (
                appointments.slice(0, 5).map((appt) => (
                  <div key={appt.appointment_id} className="dash-appt-item">
                    <div className="dash-appt-item__queue">{appt.queue_number}</div>
                    <div className="dash-appt-item__info">
                      <p className="dash-appt-item__name">{appt.patient_name}</p>
                      <span className="dash-appt-item__meta">
                        {getGenderLabel(appt.gender)} • {appt.age} tuổi
                      </span>
                    </div>
                    <span className="dash-appt-item__time">
                      {appt.start_time} - {appt.end_time}
                    </span>
                    <span className={`dash-appt-item__status dash-appt-item__status--${appt.status}`}>
                      {STATUS_LABELS[appt.status]}
                    </span>
                    {appt.status === 'waiting' && (
                      <button
                        className="dash-appt-item__btn dash-appt-item__btn--primary"
                        onClick={() => navigate(`/doctor/examine/${appt.appointment_id}`)}
                      >
                        Bắt đầu khám
                      </button>
                    )}
                    {appt.status === 'completed' && (
                      <button
                        className="dash-appt-item__btn dash-appt-item__btn--outline"
                        onClick={() => navigate(`/doctor/patient/${appt.patient_id}`)}
                      >
                        <FiUser size={14} />
                        Xem hồ sơ
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div className="dash-section" variants={itemVariants}>
            <div className="dash-section__header">
              <h2 className="dash-section__title">Thao tác nhanh</h2>
            </div>
            <div className="dash-quick-actions">
              <button className="dash-quick-btn" onClick={() => navigate('/doctor/schedule')}>
                <div className="dash-quick-btn__icon">
                  <FiCalendar size={20} />
                </div>
                <div>
                  <div className="dash-quick-btn__label">Lịch khám hôm nay</div>
                  <div className="dash-quick-btn__desc">Xem danh sách bệnh nhân</div>
                </div>
              </button>
              <button className="dash-quick-btn" onClick={() => navigate('/doctor/profile')}>
                <div className="dash-quick-btn__icon">
                  <FiUser size={20} />
                </div>
                <div>
                  <div className="dash-quick-btn__label">Hồ sơ cá nhân</div>
                  <div className="dash-quick-btn__desc">Cập nhật thông tin</div>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.footer className="dash-footer" variants={itemVariants}>
            <p>&copy; 2026 MedSchedule. All rights reserved.</p>
          </motion.footer>
        </motion.div>
      </main>
    </div>
  );
};

export default DoctorDashboardPage;
