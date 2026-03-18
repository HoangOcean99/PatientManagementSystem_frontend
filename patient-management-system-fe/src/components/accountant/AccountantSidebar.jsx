import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiGrid,
  FiDollarSign,
  FiFileText,
  FiUser,
  FiLogOut,
} from 'react-icons/fi';
import { toast, Toaster } from 'react-hot-toast';
import './AccountantSidebar.css';

const ACCOUNTANT_NAV = [
  { id: 'dashboard', label: 'Tổng quan', icon: FiGrid, path: '/accountant' },
  { id: 'deposits', label: 'Quản lý Đặt cọc', icon: FiDollarSign, path: '/accountant/deposits' },
  { id: 'invoices', label: 'Quản lý Hoá đơn', icon: FiFileText, path: '/accountant/invoices' },
  { id: 'profile', label: 'Hồ sơ cá nhân', icon: FiUser, path: '/accountant/profile' },
];

const AccountantSidebar = ({ activePage }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (item) => {
    if (activePage) return activePage === item.id;
    return location.pathname === item.path;
  };

  const handleClick = (item) => {
    if (item.id === 'profile') {
      toast('Tính năng đang phát triển', { icon: '🚧' });
      return;
    }
    if (item.path) navigate(item.path);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <aside className="acc-sidebar">
      <Toaster position="top-right" />
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
              key={item.id}
              className={`acc-sidebar__link ${active ? 'acc-sidebar__link--active' : ''}`}
              onClick={() => handleClick(item)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="acc-sidebar__logout">
        <button className="acc-sidebar__link" onClick={handleLogout}>
          <FiLogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default AccountantSidebar;
