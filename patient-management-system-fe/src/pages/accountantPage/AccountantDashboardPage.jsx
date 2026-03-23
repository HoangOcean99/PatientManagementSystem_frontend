import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import { getDashboardStats } from '../../api/accountantApi';
import { toast, Toaster } from 'react-hot-toast';
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

const TYPE_LABELS = { deposit: 'Đặt cọc', invoice: 'Hoá đơn', transfer: 'Chuyển khoản' };
const STATUS_LABELS = {
  confirmed: 'Đã xác nhận',
  paid: 'Đã thanh toán',
  pending: 'Chờ xử lý',
  unpaid: 'Chưa thanh toán',
};

const SkeletonCard = () => (
  <div className="acc-dash-stat-card" style={{ background: '#f8fafc', borderColor: '#e2e8f0', opacity: 0.7 }}>
    <div className="acc-dash-stat-card__icon" style={{ background: '#e2e8f0' }}></div>
    <div className="acc-dash-stat-card__info" style={{ width: '100%' }}>
      <div style={{ height: '12px', background: '#cbd5e1', borderRadius: '4px', width: '60%', marginBottom: '8px' }}></div>
      <div style={{ height: '24px', background: '#cbd5e1', borderRadius: '4px', width: '80%' }}></div>
    </div>
  </div>
);

const AccountantDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalDeposits: 0,
    unpaidInvoices: 0,
    pendingTransfers: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboardStats();
        if (res.data) {
          setStats(res.data.stats);
          setRecentTransactions(res.data.recentTransactions);
        }
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu tổng quan!');
        console.error('Lỗi dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="acc-dash-layout" style={{ width: '100%' }}>
      <Toaster position="top-right" />

      <main className="acc-dash-main" style={{ width: '100%' }}>
        <motion.div
          className="acc-dash-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Banner */}
          <motion.div className="acc-dash-welcome shadow-lg" variants={itemVariants}>
            <h1 className="acc-dash-welcome__greeting">
              Xin chào, Kế toán! 💰
            </h1>
            <p className="acc-dash-welcome__date">{getTodayFormatted()}</p>
          </motion.div>

          {/* Stat Cards */}
          <motion.div className="acc-dash-stats" variants={itemVariants}>
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                <div className="acc-dash-stat-card hover:shadow-xl transition-shadow">
                  <div className="acc-dash-stat-card__icon acc-dash-stat-card__icon--revenue">
                    <FiTrendingUp size={22} />
                  </div>
                  <div className="acc-dash-stat-card__info">
                    <p className="acc-dash-stat-card__label">Tổng thu hôm nay</p>
                    <p className="acc-dash-stat-card__value">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                </div>

                <div className="acc-dash-stat-card hover:shadow-xl transition-shadow">
                  <div className="acc-dash-stat-card__icon acc-dash-stat-card__icon--deposit">
                    <FiDollarSign size={22} />
                  </div>
                  <div className="acc-dash-stat-card__info">
                    <p className="acc-dash-stat-card__label">Tổng đặt cọc</p>
                    <p className="acc-dash-stat-card__value">{formatCurrency(stats.totalDeposits)}</p>
                  </div>
                </div>

                <div className="acc-dash-stat-card hover:shadow-xl transition-shadow">
                  <div className="acc-dash-stat-card__icon acc-dash-stat-card__icon--unpaid">
                    <FiFileText size={22} />
                  </div>
                  <div className="acc-dash-stat-card__info">
                    <p className="acc-dash-stat-card__label">Hoá đơn chưa TT</p>
                    <p className="acc-dash-stat-card__value">{stats.unpaidInvoices}</p>
                  </div>
                </div>

                <div className="acc-dash-stat-card hover:shadow-xl transition-shadow">
                  <div className="acc-dash-stat-card__icon acc-dash-stat-card__icon--pending">
                    <FiClock size={22} />
                  </div>
                  <div className="acc-dash-stat-card__info">
                    <p className="acc-dash-stat-card__label">Chờ xác nhận CK</p>
                    <p className="acc-dash-stat-card__value">{stats.pendingTransfers}</p>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Recent Transactions */}
          <motion.div className="acc-dash-section shadow-sm" variants={itemVariants}>
            <div className="acc-dash-section__header">
              <h2 className="acc-dash-section__title">
                <FiCalendar size={18} />
                Giao dịch gần đây
              </h2>
            </div>

            <div className="acc-dash-transactions">
              {loading ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</div>
              ) : recentTransactions.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Chưa có giao dịch nào gần đây.</div>
              ) : (
                <AnimatePresence>
                  {recentTransactions.map((txn, idx) => (
                    <motion.div
                      key={txn.id + idx}
                      className="acc-dash-txn-item hover:bg-slate-50 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className={`acc-dash-txn-item__type-icon acc-dash-txn-item__type-icon--${txn.type}`}>
                        {txn.type === 'deposit' && <FiDollarSign size={16} />}
                        {txn.type === 'invoice' && <FiFileText size={16} />}
                        {txn.type === 'transfer' && <FiCheckSquare size={16} />}
                      </div>
                      <div className="acc-dash-txn-item__info">
                        <p className="acc-dash-txn-item__patient">{txn.patient}</p>
                        <span className="acc-dash-txn-item__meta">
                          {TYPE_LABELS[txn.type] || txn.type} • {txn.date}
                        </span>
                      </div>
                      <span className="acc-dash-txn-item__amount">
                        {formatCurrency(txn.amount)}
                      </span>
                      <span className={`acc-dash-txn-item__status acc-dash-txn-item__status--${txn.status}`}>
                        {STATUS_LABELS[txn.status] || txn.status}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
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
