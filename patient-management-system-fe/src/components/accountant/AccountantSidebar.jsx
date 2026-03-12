import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiGrid,
  FiDollarSign,
  FiFileText,
  FiCheckSquare,
  FiUser,
  FiLogOut,
} from 'react-icons/fi';
import './AccountantSidebar.css';

const ACCOUNTANT_NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: FiGrid, path: '/accountant/dashboard' },
  { key: 'deposits', label: 'Tiền đặt cọc', icon: FiDollarSign, path: '/accountant/deposits' },
  { key: 'invoices', label: 'Hoá đơn', icon: FiFileText, path: '/accountant/invoices' },
  { key: 'payments', label: 'Xác nhận CK', icon: FiCheckSquare, path: '/accountant/payments' },
  { key: 'profile', label: 'Hồ sơ cá nhân', icon: FiUser, path: '/accountant/profile' },
];

const AccountantSidebar = ({ activePage }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
    <aside className="acc-sidebar">
      <div className="acc-sidebar__brand">
        <div className="acc-sidebar__logo">
          <i className="fa-solid fa-heart-pulse"></i>
        </div>
        <span className="acc-sidebar__brand-text">MedSchedule</span>
      </div>

      <div className="acc-sidebar__role-badge">
        <FiDollarSign size={14} />
        <span>Kế toán</span>
      </div>

      <nav className="acc-sidebar__nav">
        {ACCOUNTANT_NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <button
              key={item.key}
              className={`acc-sidebar__link ${active ? 'acc-sidebar__link--active' : ''}`}
              onClick={() => handleClick(item)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="acc-sidebar__footer">
        <button className="acc-sidebar__logout" onClick={handleLogout}>
          <FiLogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default AccountantSidebar;
