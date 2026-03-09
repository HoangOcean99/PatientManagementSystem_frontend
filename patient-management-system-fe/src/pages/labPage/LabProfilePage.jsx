import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiSave,
  FiEdit3,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiAlertCircle,
  FiCamera,
  FiLoader,
} from 'react-icons/fi';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import { getDoctorById, updateDoctor } from '../../api/doctorApi';
import '../../pages/doctorPage/DoctorProfileSettingsPage.css';

// ===== HELPERS =====
const getInitials = (name) =>
  name ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(-2) : '?';

// ===== ANIMATION =====
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const fadeVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

const LabProfilePage = () => {
  const labUserId = localStorage.getItem('doctor_id') || localStorage.getItem('user_id') || '';

  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    specialization: '',
    description: '',
    avatar_url: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  // ===== FETCH =====
  useEffect(() => {
    if (!labUserId) {
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await getDoctorById(labUserId);
        const d = res.data?.data || res.data;
        if (d) {
          setProfile({
            full_name: d.Users?.full_name || '',
            email: d.Users?.email || '',
            phone_number: d.Users?.phone_number || '',
            specialization: d.specialization || 'Xét nghiệm',
            description: d.bio || d.description || '',
            avatar_url: d.Users?.avatar_url || '',
          });
        }
      } catch (err) {
        console.error('Failed to load lab profile:', err);
        setProfileMessage({ type: 'error', text: 'Không thể tải thông tin hồ sơ.' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [labUserId]);

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileSave = async () => {
    if (!labUserId) {
      setProfileMessage({ type: 'error', text: 'Không tìm thấy ID người dùng.' });
      return;
    }
    try {
      setSaving(true);
      setProfileMessage(null);
      const payload = {
        full_name: profile.full_name,
        phone_number: profile.phone_number,
        specialization: profile.specialization,
        bio: profile.description,
        avatar_url: profile.avatar_url,
      };
      await updateDoctor(labUserId, payload);
      setProfileMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      setTimeout(() => setProfileMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update lab profile:', err);
      setProfileMessage({ type: 'error', text: 'Cập nhật thất bại. Vui lòng thử lại.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="prof-layout" style={{ width: '100vw' }}>
      <DoctorSidebar activePage="lab-profile" role="lab" />

      <main className="prof-main">
        <motion.div
          className="prof-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Page Header */}
          <motion.div className="prof-header" variants={itemVariants}>
            <h1 className="prof-header__title">
              <FiUser size={22} />
              Hồ sơ cá nhân
            </h1>
          </motion.div>

          {/* Profile Card */}
          {loading ? (
            <div className="prof-card" style={{ justifyContent: 'center', opacity: 0.6 }}>
              <FiLoader size={24} className="lr-spin" />
            </div>
          ) : (
          <motion.div className="prof-card" variants={itemVariants}>
            <div className="prof-card__avatar">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} />
              ) : (
                getInitials(profile.full_name)
              )}
            </div>
            <div className="prof-card__info">
              <h2 className="prof-card__name">{profile.full_name || 'Kỹ thuật viên'}</h2>
              <p className="prof-card__specialty">{profile.specialization}</p>
              <p className="prof-card__email">{profile.email}</p>
            </div>
          </motion.div>
          )}

          {/* Profile Form */}
          <motion.div
            key="profile"
            className="prof-form-section"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="prof-form-section__header">
              <h3 className="prof-form-section__title">
                <FiEdit3 size={16} />
                Chỉnh sửa thông tin
              </h3>
            </div>
            <div className="prof-form-section__body">
              {profileMessage && (
                <div className={`prof-message prof-message--${profileMessage.type}`}>
                  {profileMessage.type === 'success' ? <FiCheckCircle size={16} /> : <FiAlertCircle size={16} />}
                  {profileMessage.text}
                </div>
              )}

              <div className="prof-field">
                <label className="prof-field__label">
                  <FiCamera size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  Ảnh đại diện (URL)
                </label>
                <div className="prof-avatar-input">
                  <div className="prof-avatar-input__preview">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar preview"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                    ) : null}
                    <div
                      className="prof-avatar-input__placeholder"
                      style={{ display: profile.avatar_url ? 'none' : 'flex' }}
                    >
                      <FiCamera size={20} />
                    </div>
                  </div>
                  <input
                    type="url"
                    className="prof-input"
                    value={profile.avatar_url}
                    onChange={(e) => handleProfileChange('avatar_url', e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div className="prof-field">
                <label className="prof-field__label">
                  Họ và tên<span>*</span>
                </label>
                <input
                  type="text"
                  className="prof-input"
                  value={profile.full_name}
                  onChange={(e) => handleProfileChange('full_name', e.target.value)}
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div className="prof-field-row">
                <div className="prof-field">
                  <label className="prof-field__label">
                    <FiMail size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    Email
                  </label>
                  <input
                    type="email"
                    className="prof-input"
                    value={profile.email}
                    disabled
                    placeholder="Email"
                  />
                </div>
                <div className="prof-field">
                  <label className="prof-field__label">
                    <FiPhone size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    className="prof-input"
                    value={profile.phone_number}
                    onChange={(e) => handleProfileChange('phone_number', e.target.value)}
                    placeholder="Số điện thoại"
                  />
                </div>
              </div>

              <div className="prof-field">
                <label className="prof-field__label">Chuyên khoa</label>
                <input
                  type="text"
                  className="prof-input"
                  value={profile.specialization}
                  disabled
                  placeholder="Chuyên khoa"
                />
              </div>

              <div className="prof-field">
                <label className="prof-field__label">Mô tả bản thân</label>
                <textarea
                  className="prof-textarea"
                  value={profile.description}
                  onChange={(e) => handleProfileChange('description', e.target.value)}
                  placeholder="Mô tả kinh nghiệm, chuyên môn..."
                  rows={4}
                />
              </div>

              <div className="prof-form-actions">
                <button className="prof-btn prof-btn--primary" onClick={handleProfileSave} disabled={saving}>
                  {saving ? <FiLoader size={16} className="lr-spin" /> : <FiSave size={16} />}
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.footer className="prof-footer" variants={itemVariants}>
            <p>&copy; 2026 MedSchedule. All rights reserved.</p>
          </motion.footer>
        </motion.div>
      </main>
    </div>
  );
};

export default LabProfilePage;
