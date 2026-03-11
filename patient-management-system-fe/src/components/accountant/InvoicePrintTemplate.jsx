import React, { useEffect } from 'react';
import './InvoicePrintTemplate.css';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const getTodayFormatted = () => {
  const d = new Date();
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

const InvoicePrintTemplate = ({ invoice, onAfterPrint }) => {
  useEffect(() => {
    const handler = () => {
      if (onAfterPrint) onAfterPrint();
    };
    window.addEventListener('afterprint', handler);
    return () => window.removeEventListener('afterprint', handler);
  }, [onAfterPrint]);

  if (!invoice) return null;

  const subtotal = invoice.items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const depositApplied = invoice.deposit_applied || 0;
  const remaining = subtotal - depositApplied;

  return (
    <div className="print-invoice-wrapper">
      <div className="print-invoice">
        {/* Header */}
        <div className="print-invoice__header">
          <div className="print-invoice__clinic">
            <h2 className="print-invoice__clinic-name">PHÒNG KHÁM ĐA KHOA MEDSCHEDULE</h2>
            <p>Địa chỉ: 123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM</p>
            <p>Điện thoại: (028) 1234 5678 — Email: contact@medschedule.vn</p>
          </div>
          <div className="print-invoice__title-block">
            <h1 className="print-invoice__title">HOÁ ĐƠN THANH TOÁN</h1>
            <p className="print-invoice__invoice-id">Số: {invoice.id}</p>
            <p className="print-invoice__date">Ngày: {getTodayFormatted()}</p>
          </div>
        </div>

        <div className="print-invoice__divider"></div>

        {/* Patient Info */}
        <div className="print-invoice__patient">
          <div className="print-invoice__patient-row">
            <span className="print-invoice__patient-label">Họ tên bệnh nhân:</span>
            <span className="print-invoice__patient-value">{invoice.patient_name}</span>
          </div>
          <div className="print-invoice__patient-row">
            <span className="print-invoice__patient-label">Mã bệnh nhân:</span>
            <span className="print-invoice__patient-value">{invoice.patient_code}</span>
          </div>
        </div>

        {/* Items Table */}
        <table className="print-invoice__table">
          <thead>
            <tr>
              <th className="print-invoice__th-stt">STT</th>
              <th className="print-invoice__th-name">Dịch vụ / Thuốc</th>
              <th className="print-invoice__th-qty">SL</th>
              <th className="print-invoice__th-price">Đơn giá</th>
              <th className="print-invoice__th-total">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={idx}>
                <td className="print-invoice__td-center">{idx + 1}</td>
                <td>{item.name}</td>
                <td className="print-invoice__td-center">{item.qty}</td>
                <td className="print-invoice__td-right">{formatCurrency(item.price)}</td>
                <td className="print-invoice__td-right print-invoice__td-bold">
                  {formatCurrency(item.qty * item.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="print-invoice__summary">
          <div className="print-invoice__summary-row">
            <span>Tổng cộng:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {depositApplied > 0 && (
            <div className="print-invoice__summary-row">
              <span>Tiền đặt cọc đã trừ:</span>
              <span>-{formatCurrency(depositApplied)}</span>
            </div>
          )}
          <div className="print-invoice__summary-row print-invoice__summary-row--total">
            <span>SỐ TIỀN PHẢI TRẢ:</span>
            <span>{formatCurrency(remaining)}</span>
          </div>
        </div>

        {/* Signatures */}
        <div className="print-invoice__signatures">
          <div className="print-invoice__sig-block">
            <p className="print-invoice__sig-title">Người lập hoá đơn</p>
            <p className="print-invoice__sig-note">(Ký, ghi rõ họ tên)</p>
            <div className="print-invoice__sig-space"></div>
          </div>
          <div className="print-invoice__sig-block">
            <p className="print-invoice__sig-title">Bệnh nhân</p>
            <p className="print-invoice__sig-note">(Ký, ghi rõ họ tên)</p>
            <div className="print-invoice__sig-space"></div>
          </div>
        </div>

        {/* Footer */}
        <div className="print-invoice__footer">
          <p>Cảm ơn quý khách đã sử dụng dịch vụ tại MedSchedule.</p>
          <p>Hoá đơn này có giá trị thanh toán kể từ ngày xuất.</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrintTemplate;
