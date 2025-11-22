import React, { useState } from 'react';
import './PaymentModal.css';
import MyButtonShortAction from './MyButtonShortAction';

export default function PaymentModal({ isOpen, onClose, reservation, onPaymentSuccess }) {
  const [formData, setFormData] = useState({
    amount: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  if (!isOpen || !reservation) return null;

  const remainingAmount = (parseFloat(reservation.current_price) - parseFloat(reservation.paid_amount)).toFixed(2);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.replace(/\s/g, '').length > 16) return;
    } else if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
      }
      if (formattedValue.length > 5) return;
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    } else if (name === 'amount') {
      formattedValue = value.replace(/[^\d.]/g, '');
      if ((formattedValue.match(/\./g) || []).length > 1) return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Ingrese un monto válido';
    } else if (parseFloat(formData.amount) > parseFloat(remainingAmount)) {
      newErrors.amount = `El monto no puede exceder $${remainingAmount}`;
    }

    const cardNumberClean = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumberClean || cardNumberClean.length !== 16) {
      newErrors.cardNumber = 'Número de tarjeta inválido';
    }

    if (!formData.cardHolder || formData.cardHolder.trim().length < 3) {
      newErrors.cardHolder = 'Nombre del titular requerido';
    }

    if (!formData.expiryDate || formData.expiryDate.length !== 5) {
      newErrors.expiryDate = 'Fecha de expiración inválida';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Mes inválido';
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Tarjeta expirada';
      }
    }

    if (!formData.cvv || formData.cvv.length !== 3) {
      newErrors.cvv = 'CVV inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setProcessing(true);

    try {
      await onPaymentSuccess({
        amount: parseFloat(formData.amount),
        card_number: formData.cardNumber.replace(/\s/g, ''),
        card_holder: formData.cardHolder,
        expiry_date: formData.expiryDate,
        cvv: formData.cvv
      });

      setFormData({
        amount: '',
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
      });
    } catch (error) {
      setErrors({ submit: error.message || 'Error al procesar el pago' });
    } finally {
      setProcessing(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="payment-modal-overlay" onClick={handleOverlayClick}>
      <div className="payment-modal-container">
        <div className="payment-modal-header">
          <h2>Procesar Pago</h2>
          <MyButtonShortAction type="close" title="Cerrar" onClick={onClose} />
        </div>

        <div className="payment-modal-body">
          <div className="payment-info">
            <div className="info-row">
              <span className="info-label">Evento:</span>
              <span className="info-value">{reservation.event_variant_name || reservation.event_name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Total:</span>
              <span className="info-value">${parseFloat(reservation.current_price).toFixed(2)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Pagado:</span>
              <span className="info-value">${parseFloat(reservation.paid_amount).toFixed(2)}</span>
            </div>
            <div className="info-row highlight">
              <span className="info-label">Saldo pendiente:</span>
              <span className="info-value">${remainingAmount}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-group">
              <label htmlFor="amount">Monto a pagar *</label>
              <input
                type="text"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                className={errors.amount ? 'error' : ''}
              />
              {errors.amount && <span className="error-message">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="cardNumber">Número de tarjeta *</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                className={errors.cardNumber ? 'error' : ''}
              />
              {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="cardHolder">Titular de la tarjeta *</label>
              <input
                type="text"
                id="cardHolder"
                name="cardHolder"
                value={formData.cardHolder}
                onChange={handleInputChange}
                placeholder="Nombre como aparece en la tarjeta"
                className={errors.cardHolder ? 'error' : ''}
                style={{ textTransform: 'uppercase' }}
              />
              {errors.cardHolder && <span className="error-message">{errors.cardHolder}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiryDate">Fecha de expiración *</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/AA"
                  className={errors.expiryDate ? 'error' : ''}
                />
                {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="cvv">CVV *</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  className={errors.cvv ? 'error' : ''}
                />
                {errors.cvv && <span className="error-message">{errors.cvv}</span>}
              </div>
            </div>

            {errors.submit && (
              <div className="error-message submit-error">{errors.submit}</div>
            )}

            <div className="payment-modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={onClose}
                disabled={processing}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={processing}
              >
                {processing ? 'Procesando...' : `Pagar $${formData.amount || '0.00'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
