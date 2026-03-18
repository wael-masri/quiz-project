import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { getAllOrders } from '../services/orderService';
import { getInsights } from '../services/insightService';
import './DashboardPage.css';

function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, insightsData] = await Promise.all([
          getAllOrders(),
          getInsights(),
        ]);
        setOrders(ordersData);
        setInsights(insightsData);
      } catch (err) {
        setError('Failed to load dashboard data. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.price * o.quantity, 0);
  const totalQuantity = orders.reduce((sum, o) => sum + o.quantity, 0);
  const topProduct = insights
    ? Object.entries(insights.topProducts).sort((a, b) => b[1] - a[1])[0]
    : null;
  const busiestHour = insights
    ? Object.entries(insights.busiestHours).sort((a, b) => b[1] - a[1])[0]
    : null;

  if (loading) {
    return <div className="dashboard-status">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-status dashboard-status--error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1>Dashboard</h1>
        <p>Overview of your orders and sales insights</p>
      </header>

      <section className="dashboard__stats">
        <StatCard title="Total Orders" value={orders.length} subtitle="All time" />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          subtitle="All time"
        />
        <StatCard title="Units Sold" value={totalQuantity} subtitle="All time" />
        <StatCard
          title="Top Product"
          value={topProduct ? topProduct[0] : '—'}
          subtitle={topProduct ? `${topProduct[1]} units sold` : 'No data yet'}
        />
        <StatCard
          title="Busiest Hour"
          value={busiestHour ? `${busiestHour[0]}:00` : '—'}
          subtitle={busiestHour ? `${busiestHour[1]} orders` : 'No data yet'}
        />
      </section>

      {insights?.recommendations?.length > 0 && (
        <section className="dashboard__section">
          <h2>Restock Recommendations</h2>
          <ul className="dashboard__restock-list">
            {insights.recommendations.map((rec) => (
              <li key={rec.product} className="dashboard__restock-item">
                <span className="restock-badge">⚠ Restock</span>
                <strong>{rec.product}</strong>
                <span>{rec.totalQuantitySold} units sold</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="dashboard__section">
        <h2>Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="dashboard__empty">No orders yet.</p>
        ) : (
          <div className="dashboard__table-wrapper">
            <table className="dashboard__table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Qty</th>
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
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
