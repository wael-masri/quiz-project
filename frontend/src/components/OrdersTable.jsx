import React from 'react';
import './OrdersTable.css';

function OrdersTable({ orders = [], loading = false, error = null }) {
  if (loading) {
    return <p className="orders-table__state">Loading orders...</p>;
  }

  if (error) {
    return <p className="orders-table__state orders-table__state--error">{error}</p>;
  }

  if (orders.length === 0) {
    return <p className="orders-table__state">No orders found.</p>;
  }

  return (
    <div className="orders-table__wrapper">
      <table className="orders-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {[...orders].reverse().map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.product}</td>
              <td>{order.quantity}</td>
              <td>${order.price.toFixed(2)}</td>
              <td>{new Date(order.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersTable;
