import React, { useState } from 'react';
import Spinner from './Spinner';
import { updateOrder, deleteOrder } from '../services/orderService';
import './OrdersTable.css';

const INITIAL_EDIT = { product: '', quantity: '', price: '' };

function OrdersTable({ orders = [], loading = false, error = null, onOrderChanged }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(INITIAL_EDIT);
  const [editErrors, setEditErrors] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [rowStatus, setRowStatus] = useState({ id: null, type: null, message: '' });

  const showRowStatus = (id, type, message) => {
    setRowStatus({ id, type, message });
    setTimeout(() => setRowStatus({ id: null, type: null, message: '' }), 3500);
  };

  const openEdit = (order) => {
    setEditingId(order.id);
    setEditForm({
      product: order.product,
      quantity: String(order.quantity),
      price: String(order.price),
    });
    setEditErrors({});
    setRowStatus({ id: null, type: null, message: '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(INITIAL_EDIT);
    setEditErrors({});
  };

  const validateEdit = () => {
    const errs = {};
    if (!editForm.product.trim()) errs.product = 'Required';
    if (editForm.quantity === '' || Number(editForm.quantity) <= 0) errs.quantity = 'Must be > 0';
    if (editForm.price === '' || Number(editForm.price) < 0) errs.price = 'Must be ≥ 0';
    return errs;
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setEditErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleEditSubmit = async (orderId) => {
    const errs = validateEdit();
    if (Object.keys(errs).length > 0) {
      setEditErrors(errs);
      return;
    }
    setBusyId(orderId);
    try {
      await updateOrder(orderId, {
        product: editForm.product.trim(),
        quantity: Number(editForm.quantity),
        price: Number(editForm.price),
      });
      cancelEdit();
      showRowStatus(orderId, 'success', 'Order updated.');
      if (onOrderChanged) onOrderChanged();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update order.';
      showRowStatus(orderId, 'error', msg);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm(`Delete order #${orderId}? This cannot be undone.`)) return;
    setBusyId(orderId);
    try {
      await deleteOrder(orderId);
      if (onOrderChanged) onOrderChanged();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete order.';
      showRowStatus(orderId, 'error', msg);
      setBusyId(null);
    }
  };

  if (loading) return <Spinner message="Loading orders..." />;
  if (error) return <p className="orders-table__state orders-table__state--error">{error}</p>;
  if (orders.length === 0) return <p className="orders-table__state">No orders yet. Add one above!</p>;

  return (
    <div className="orders-table__wrapper">
      <table className="orders-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...orders].reverse().map((order) => {
            const isEditing = editingId === order.id;
            const isBusy = busyId === order.id;

            return (
              <React.Fragment key={order.id}>
                <tr className={isEditing ? 'orders-table__row--editing' : ''}>
                  <td>{order.id}</td>
                  <td>{order.product}</td>
                  <td>{order.quantity}</td>
                  <td>${order.price.toFixed(2)}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td className="orders-table__actions">
                    <button
                      className="orders-table__btn orders-table__btn--edit"
                      onClick={() => openEdit(order)}
                      disabled={isBusy || editingId !== null}
                      title="Edit order"
                    >
                      Edit
                    </button>
                    <button
                      className="orders-table__btn orders-table__btn--delete"
                      onClick={() => handleDelete(order.id)}
                      disabled={isBusy || editingId !== null}
                      title="Delete order"
                    >
                      {isBusy && editingId === null ? '…' : 'Delete'}
                    </button>
                  </td>
                </tr>

                {isEditing && (
                  <tr className="orders-table__edit-row">
                    <td colSpan={6}>
                      <div className="orders-table__edit-form">
                        <div className="orders-table__edit-fields">
                          <div className="orders-table__edit-field">
                            <label>Product</label>
                            <input
                              name="product"
                              value={editForm.product}
                              onChange={handleEditChange}
                              className={editErrors.product ? 'input--error' : ''}
                            />
                            {editErrors.product && (
                              <span className="orders-table__field-error">{editErrors.product}</span>
                            )}
                          </div>
                          <div className="orders-table__edit-field">
                            <label>Quantity</label>
                            <input
                              name="quantity"
                              type="number"
                              min="1"
                              value={editForm.quantity}
                              onChange={handleEditChange}
                              className={editErrors.quantity ? 'input--error' : ''}
                            />
                            {editErrors.quantity && (
                              <span className="orders-table__field-error">{editErrors.quantity}</span>
                            )}
                          </div>
                          <div className="orders-table__edit-field">
                            <label>Price ($)</label>
                            <input
                              name="price"
                              type="number"
                              min="0"
                              step="0.01"
                              value={editForm.price}
                              onChange={handleEditChange}
                              className={editErrors.price ? 'input--error' : ''}
                            />
                            {editErrors.price && (
                              <span className="orders-table__field-error">{editErrors.price}</span>
                            )}
                          </div>
                        </div>
                        <div className="orders-table__edit-actions">
                          <button
                            className="orders-table__btn orders-table__btn--save"
                            onClick={() => handleEditSubmit(order.id)}
                            disabled={isBusy}
                          >
                            {isBusy ? 'Saving…' : 'Save'}
                          </button>
                          <button
                            className="orders-table__btn orders-table__btn--cancel"
                            onClick={cancelEdit}
                            disabled={isBusy}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {rowStatus.id === order.id && (
                  <tr className="orders-table__status-row">
                    <td colSpan={6}>
                      <p className={`orders-table__row-status orders-table__row-status--${rowStatus.type}`}>
                        {rowStatus.message}
                      </p>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersTable;
