import React, { useState } from 'react';
import { createOrder } from '../services/orderService';
import './AddOrderForm.css';

const INITIAL_FORM = { product: '', quantity: '', price: '' };

function AddOrderForm({ onOrderAdded }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.product.trim()) errs.product = 'Product is required.';
    if (form.quantity === '') {
      errs.quantity = 'Quantity is required.';
    } else if (Number(form.quantity) <= 0) {
      errs.quantity = 'Quantity must be a positive number.';
    }
    if (form.price === '') {
      errs.price = 'Price is required.';
    } else if (Number(form.price) < 0) {
      errs.price = 'Price must be a non-negative number.';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setStatus(null);
    try {
      const newOrder = await createOrder({
        product: form.product.trim(),
        quantity: Number(form.quantity),
        price: Number(form.price),
      });
      setForm(INITIAL_FORM);
      setErrors({});
      setStatus({ type: 'success', message: `Order #${newOrder.id} added successfully.` });
      if (onOrderAdded) onOrderAdded(newOrder);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add order. Please try again.';
      setStatus({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="add-order-form" onSubmit={handleSubmit} noValidate>
      <h2 className="add-order-form__title">Add Order</h2>

      <div className="add-order-form__field">
        <label htmlFor="product">Product</label>
        <input
          id="product"
          name="product"
          type="text"
          placeholder="e.g. Widget A"
          value={form.product}
          onChange={handleChange}
          className={errors.product ? 'input--error' : ''}
        />
        {errors.product && <span className="field-error">{errors.product}</span>}
      </div>

      <div className="add-order-form__field">
        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          placeholder="e.g. 5"
          min="1"
          value={form.quantity}
          onChange={handleChange}
          className={errors.quantity ? 'input--error' : ''}
        />
        {errors.quantity && <span className="field-error">{errors.quantity}</span>}
      </div>

      <div className="add-order-form__field">
        <label htmlFor="price">Price ($)</label>
        <input
          id="price"
          name="price"
          type="number"
          placeholder="e.g. 19.99"
          min="0"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          className={errors.price ? 'input--error' : ''}
        />
        {errors.price && <span className="field-error">{errors.price}</span>}
      </div>

      {status && (
        <p className={`add-order-form__status add-order-form__status--${status.type}`}>
          {status.message}
        </p>
      )}

      <button type="submit" className="add-order-form__submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Add Order'}
      </button>
    </form>
  );
}

export default AddOrderForm;
