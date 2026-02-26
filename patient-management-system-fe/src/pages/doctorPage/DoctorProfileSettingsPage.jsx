import React, { useState } from 'react';
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
} from 'react-icons/fi';
 import './DoctorProfileSettingsPage.css';

// ===== MOCK DATA =====
const MOCK_DOCTOR = {
  user_id: 'u-d001',
  doctor_id: 'd-001',
  full_name: 'Nguyễn Văn Bác Sĩ',
  email: 'doctor.nguyen@medschedule.vn',
  phone_number: '0909123456',
  specialization: 'Nội khoa',
  description: 'Bác sĩ chuyên khoa nội, 10 năm kinh nghiệm tại bệnh viện Chợ Rẫy.',
  avatar_url: null,
};

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

const DoctorProfileSettingsPage = () => {
  // Profile form state
  const [profile, setProfile] = useState({
    full_name: MOCK_DOCTOR.full_name,
    email: MOCK_DOCTOR.email,
    phone_number: MOCK_DOCTOR.phone_number,
    specialization: MOCK_DOCTOR.specialization,
    description: MOCK_DOCTOR.description,
    avatar_url: MOCK_DOCTOR.avatar_url || '',
  });

  // Messages
  const [profileMessage, setProfileMessage] = useState(null);

  // ===== HANDLERS =====
  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileSave = () => {
    // TODO: API call with updateDoctor
    console.log('Save profile:', profile);
    setProfileMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
    setTimeout(() => setProfileMessage(null), 3000);
  };

  return (
    <div className="prof-layout">

      <main className="prof-main p-8">
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
          <motion.div className="prof-card" variants={itemVariants}>
            <div className="prof-card__avatar">
              {MOCK_DOCTOR.avatar_url ? (
                <img src={MOCK_DOCTOR.avatar_url} alt={MOCK_DOCTOR.full_name} />
              ) : (
                getInitials(MOCK_DOCTOR.full_name)
              )}
            </div>
            <div className="prof-card__info">
              <h2 className="prof-card__name">{MOCK_DOCTOR.full_name}</h2>
              <p className="prof-card__specialty">{MOCK_DOCTOR.specialization}</p>
              <p className="prof-card__email">{MOCK_DOCTOR.email}</p>
            </div>
          </motion.div>

          {/* Profile Content */}
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

                  {/* Avatar URL */}
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
                      onChange={(e) => handleProfileChange('specialization', e.target.value)}
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
                    <button className="prof-btn prof-btn--primary" onClick={handleProfileSave}>
                      <FiSave size={16} />
                      Lưu thay đổi
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

export default DoctorProfileSettingsPage;
