import React, { useState, useEffect } from 'react';
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
  FiLoader,
  FiAlertCircle,
} from 'react-icons/fi';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import { getAppointmentsByDoctorId } from '../../api/doctorApi';
import { supabase } from '../../../supabaseClient';
import './DoctorDashboardPage.css';

// ===== HELPERS =====
const STATUS_LABELS = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  checked_in: 'Đã check-in',
  in_progress: 'Đang khám',
  completed: 'Hoàn tất',
  cancelled: 'Đã hủy',
  missed: 'Vắng mặt',
};

const getGenderLabel = (g) => (g === 'male' ? 'Nam' : g === 'female' ? 'Nữ' : 'Khác');

const getTodayFormatted = () => {
  const d = new Date();
  const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
  return d.toLocaleDateString('vi-VN', options);
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

  const [doctorId, setDoctorId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== Lấy doctor_id từ Supabase session =====
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const uid = data?.session?.user?.id;
        if (uid) {
          setDoctorId(uid);
        } else {
          console.error('[DoctorDashboard] Không tìm thấy session');
          setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
          setLoading(false);
        }
      } catch (err) {
        console.error('[DoctorDashboard] Session error:', err);
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setLoading(false);
      }
    };
    getSession();
  }, []);

  // ===== Fetch appointments khi có doctorId =====
  useEffect(() => {
    if (!doctorId) return;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAppointmentsByDoctorId(doctorId);
        const data = response.data?.data || response.data || [];

        const mapped = (Array.isArray(data) ? data : []).map((appt, idx) => ({
          appointment_id: appt.appointment_id,
          queue_number: idx + 1,
          patient_name: appt.Patients?.Users?.full_name || 'N/A',
          patient_id: appt.Patients?.patient_id || appt.patient_id,
          gender: appt.Patients?.Users?.gender || '',
          age: calculateAge(appt.Patients?.Users?.dob) || 'Không rõ',
          phone: appt.Patients?.Users?.phone_number || '',
          // Lấy time từ DoctorSlots (qua slot_id FK)
          start_time: formatTime(
            appt.DoctorSlots?.start_time ||
            appt.DoctorSlot?.start_time ||
            appt.start_time
          ),
          end_time: formatTime(
            appt.DoctorSlots?.end_time ||
            appt.DoctorSlot?.end_time ||
            appt.end_time
          ),
          appointment_date:
            appt.DoctorSlots?.slot_date ||
            appt.DoctorSlot?.slot_date ||
            appt.appointment_date,
          status: appt.status,
          service: appt.ClinicServices?.name || '',
        }));

        setAppointments(mapped);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError('Không thể tải lịch khám. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  const totalToday = appointments.length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const waitingCount = appointments.filter(
    (a) => a.status === 'checked_in' || a.status === 'in_progress'
  ).length;

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
              {loading ? (
                <div className="dash-empty" style={{ opacity: 0.6 }}>
                  <FiLoader size={24} className="lr-spin" />
                  <p className="dash-empty__text" style={{ marginTop: 12 }}>Đang tải lịch khám...</p>
                </div>
              ) : error ? (
                <div className="dash-empty" style={{ color: '#EF4444' }}>
                  <FiAlertCircle size={24} />
                  <p className="dash-empty__text" style={{ marginTop: 12 }}>{error}</p>
                </div>
              ) : appointments.length === 0 ? (
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
                    {appt.status === 'checked_in' && (
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
