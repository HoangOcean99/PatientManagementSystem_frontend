import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiDollarSign,
  FiFileText,
  FiCheckSquare,
  FiClock,
  FiArrowRight,
  FiTrendingUp,
  FiUser,
  FiCalendar,
} from 'react-icons/fi';
import AccountantSidebar from '../../components/accountant/AccountantSidebar';
import './AccountantDashboardPage.css';

const getTodayFormatted = () => {
  const d = new Date();
  const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
  return d.toLocaleDateString('vi-VN', options);
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const MOCK_RECENT_TRANSACTIONS = [
  { id: 'TXN001', patient: 'Nguyễn Văn An', type: 'deposit', amount: 500000, date: '2026-03-02', status: 'confirmed' },
  { id: 'TXN002', patient: 'Trần Thị Bình', type: 'invoice', amount: 1250000, date: '2026-03-02', status: 'paid' },
  { id: 'TXN003', patient: 'Lê Hoàng Cường', type: 'transfer', amount: 800000, date: '2026-03-02', status: 'pending' },
  { id: 'TXN004', patient: 'Phạm Minh Đức', type: 'invoice', amount: 2100000, date: '2026-03-01', status: 'unpaid' },
  { id: 'TXN005', patient: 'Hoàng Thị Em', type: 'deposit', amount: 300000, date: '2026-03-01', status: 'confirmed' },
  { id: 'TXN006', patient: 'Vũ Quang Phú', type: 'transfer', amount: 1500000, date: '2026-03-01', status: 'confirmed' },
];

const TYPE_LABELS = { deposit: 'Đặt cọc', invoice: 'Hoá đơn', transfer: 'Chuyển khoản' };
const STATUS_LABELS = {
  confirmed: 'Đã xác nhận',
  paid: 'Đã thanh toán',
  pending: 'Chờ xử lý',
  unpaid: 'Chưa thanh toán',
};

const AccountantDashboardPage = () => {
  const navigate = useNavigate();

  const stats = {
    totalRevenue: 15800000,
    totalDeposits: 4200000,
    unpaidInvoices: 7,
    pendingTransfers: 3,
  };

  return (
    <div className="acc-dash-layout">
      <AccountantSidebar activePage="dashboard" />

      <main className="acc-dash-main">
        <motion.div
          className="acc-dash-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Banner */}
          <motion.div className="acc-dash-welcome" variants={itemVariants}>
            <h1 className="acc-dash-welcome__greeting">
              Xin chào, Kế toán! 💰
            </h1>
            <p className="acc-dash-welcome__date">{getTodayFormatted()}</p>
          </motion.div>

          {/* Stat Cards */}
          <motion.div className="acc-dash-stats" variants={itemVariants}>
            <div className="acc-dash-stat-card">
              <div className="acc-dash-stat-card__icon acc-dash-stat-card__icon--revenue">
                <FiTrendingUp size={22} />
              </div>
              <div className="acc-dash-stat-card__info">
                <p className="acc-dash-stat-card__label">Tổng thu hôm nay</p>
                <p className="acc-dash-stat-card__value">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>

            <div className="acc-dash-stat-card">
              <div className="acc-dash-stat-card__icon acc-dash-stat-card__icon--deposit">
                <FiDollarSign size={22} />
              </div>
              <div className="acc-dash-stat-card__info">
                <p className="acc-dash-stat-card__label">Tổng đặt cọc</p>
                <p className="acc-dash-stat-card__value">{formatCurrency(stats.totalDeposits)}</p>
              </div>
            </div>

            <div className="acc-dash-stat-card">
              <div className="acc-dash-stat-card__icon acc-dash-stat-card__icon--unpaid">
                <FiFileText size={22} />
              </div>
              <div className="acc-dash-stat-card__info">
                <p className="acc-dash-stat-card__label">Hoá đơn chưa TT</p>
                <p className="acc-dash-stat-card__value">{stats.unpaidInvoices}</p>
              </div>
            </div>

            <div className="acc-dash-stat-card">
              <div className="acc-dash-stat-card__icon acc-dash-stat-card__icon--pending">
                <FiClock size={22} />
              </div>
              <div className="acc-dash-stat-card__info">
                <p className="acc-dash-stat-card__label">Chờ xác nhận CK</p>
                <p className="acc-dash-stat-card__value">{stats.pendingTransfers}</p>
              </div>
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div className="acc-dash-section" variants={itemVariants}>
            <div className="acc-dash-section__header">
              <h2 className="acc-dash-section__title">
                <FiCalendar size={18} />
                Giao dịch gần đây
              </h2>
            </div>

            <div className="acc-dash-transactions">
              {MOCK_RECENT_TRANSACTIONS.map((txn) => (
                <div key={txn.id} className="acc-dash-txn-item">
                  <div className={`acc-dash-txn-item__type-icon acc-dash-txn-item__type-icon--${txn.type}`}>
                    {txn.type === 'deposit' && <FiDollarSign size={16} />}
                    {txn.type === 'invoice' && <FiFileText size={16} />}
                    {txn.type === 'transfer' && <FiCheckSquare size={16} />}
                  </div>
                  <div className="acc-dash-txn-item__info">
                    <p className="acc-dash-txn-item__patient">{txn.patient}</p>
                    <span className="acc-dash-txn-item__meta">
                      {TYPE_LABELS[txn.type]} • {txn.date}
                    </span>
                  </div>
                  <span className="acc-dash-txn-item__amount">
                    {formatCurrency(txn.amount)}
                  </span>
                  <span className={`acc-dash-txn-item__status acc-dash-txn-item__status--${txn.status}`}>
                    {STATUS_LABELS[txn.status]}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div className="acc-dash-section" variants={itemVariants}>
            <div className="acc-dash-section__header">
              <h2 className="acc-dash-section__title">Thao tác nhanh</h2>
            </div>
            <div className="acc-dash-quick-actions">
              <button className="acc-dash-quick-btn" onClick={() => navigate('/accountant/deposits')}>
                <div className="acc-dash-quick-btn__icon">
                  <FiDollarSign size={20} />
                </div>
                <div>
                  <div className="acc-dash-quick-btn__label">Quản lý đặt cọc</div>
                  <div className="acc-dash-quick-btn__desc">Xem và quản lý tiền cọc</div>
                </div>
              </button>
              <button className="acc-dash-quick-btn" onClick={() => navigate('/accountant/invoices')}>
                <div className="acc-dash-quick-btn__icon">
                  <FiFileText size={20} />
                </div>
                <div>
                  <div className="acc-dash-quick-btn__label">Quản lý hoá đơn</div>
                  <div className="acc-dash-quick-btn__desc">Tạo và xuất hoá đơn</div>
                </div>
              </button>
              <button className="acc-dash-quick-btn" onClick={() => navigate('/accountant/payments')}>
                <div className="acc-dash-quick-btn__icon">
                  <FiCheckSquare size={20} />
                </div>
                <div>
                  <div className="acc-dash-quick-btn__label">Xác nhận CK</div>
                  <div className="acc-dash-quick-btn__desc">Xác nhận chuyển khoản</div>
                </div>
              </button>
              <button className="acc-dash-quick-btn" onClick={() => navigate('/accountant/profile')}>
                <div className="acc-dash-quick-btn__icon">
                  <FiUser size={20} />
                </div>
                <div>
                  <div className="acc-dash-quick-btn__label">Hồ sơ cá nhân</div>
                  <div className="acc-dash-quick-btn__desc">Cập nhật thông tin</div>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.footer className="acc-dash-footer" variants={itemVariants}>
            <p>&copy; 2026 MedSchedule. All rights reserved.</p>
          </motion.footer>
        </motion.div>
      </main>
    </div>
  );
};

export default AccountantDashboardPage;
