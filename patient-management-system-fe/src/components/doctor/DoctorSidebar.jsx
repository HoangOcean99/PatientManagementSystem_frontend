import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiGrid,
  FiCalendar,
  FiClipboard,
  FiUser,
  FiLogOut,
  FiActivity,
} from 'react-icons/fi';
import './DoctorSidebar.css';

const DOCTOR_NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: FiGrid, path: '/doctor/dashboard' },
  { key: 'schedule', label: 'Lịch khám hôm nay', icon: FiCalendar, path: '/doctor/schedule' },
  { key: 'profile', label: 'Hồ sơ cá nhân', icon: FiUser, path: '/doctor/profile' },
];

const LAB_NAV = [
  { key: 'lab-queue', label: 'Danh sách chờ XN', icon: FiActivity, path: '/lab/queue' },
  { key: 'lab-profile', label: 'Hồ sơ cá nhân', icon: FiUser, path: '/lab/profile' },
];

const DoctorSidebar = ({ activePage, role = 'doctor' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = role === 'lab' ? LAB_NAV : DOCTOR_NAV;

  const isActive = (item) => {
    if (activePage) return activePage === item.key;
    if (item.path) return location.pathname === item.path;
    return false;
  };

  const handleClick = (item) => {
    if (item.path) navigate(item.path);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <aside className="doc-sidebar">
      <div className="doc-sidebar__brand">
        <div className="doc-sidebar__logo">
          <i className="fa-solid fa-heart-pulse"></i>
        </div>
        <span className="doc-sidebar__brand-text">MedSchedule</span>
      </div>

      <nav className="doc-sidebar__nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <button
              key={item.key}
              className={`doc-sidebar__link ${active ? 'doc-sidebar__link--active' : ''}`}
              onClick={() => handleClick(item)}
              disabled={!item.path}
              title={!item.path ? 'Truy cập từ lịch khám' : undefined}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="doc-sidebar__footer">
        <button className="doc-sidebar__logout" onClick={handleLogout}>
          <FiLogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default DoctorSidebar;
