import React, { useState, useEffect, useCallback } from 'react';
import Spinner from '../components/Spinner';
import StatCard from '../components/StatCard';
import AddOrderForm from '../components/AddOrderForm';
import OrdersTable from '../components/OrdersTable';
import Insights from '../components/Insights';
import { getAllOrders } from '../services/orderService';
import { getInsights } from '../services/insightService';
import './DashboardPage.css';

function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback(async () => {
    setError(null);
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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  const handleOrderAdded = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.price * o.quantity, 0);
  const totalQuantity = orders.reduce((sum, o) => sum + o.quantity, 0);
  const topProduct = insights && Object.keys(insights.topProducts).length > 0
    ? Object.entries(insights.topProducts).sort((a, b) => b[1] - a[1])[0]
    : null;
  const busiestHour = insights && Object.keys(insights.busiestHours).length > 0
    ? Object.entries(insights.busiestHours).sort((a, b) => b[1] - a[1])[0]
    : null;

  if (loading) return <Spinner message="Loading dashboard..." />;

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

      <div className="dashboard__columns">
        <section className="dashboard__section dashboard__section--form">
          <h2>New Order</h2>
          <AddOrderForm onOrderAdded={handleOrderAdded} />
        </section>

        <section className="dashboard__section dashboard__section--table">
          <h2>Recent Orders</h2>
          <OrdersTable orders={orders} loading={loading} error={error} onOrderChanged={handleOrderAdded} />
        </section>
      </div>

      <section className="dashboard__section">
        <h2>Insights</h2>
        <Insights insights={insights} loading={loading} error={error} />
      </section>
    </div>
  );
}

export default DashboardPage;
