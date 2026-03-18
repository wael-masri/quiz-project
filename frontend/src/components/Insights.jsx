import React from 'react';
import Spinner from './Spinner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './Insights.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BAR_OPTIONS = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
      grid: { color: '#f0f2f5' },
    },
    x: { grid: { display: false } },
  },
};

function Insights({ insights = null, loading = false, error = null }) {
  if (loading) return <Spinner message="Loading insights..." />;
  if (error) return <p className="insights__state insights__state--error">{error}</p>;
  if (!insights) return <p className="insights__state">No insights data yet. Add some orders first.</p>;

  const hasTopProducts = insights.topProducts && Object.keys(insights.topProducts).length > 0;
  const hasBusiestHours = insights.busiestHours && Object.keys(insights.busiestHours).length > 0;
  const hasRecommendations = insights.recommendations?.length > 0;

  if (!hasTopProducts && !hasBusiestHours && !hasRecommendations) {
    return <p className="insights__state">No insights data yet. Add some orders first.</p>;
  }

  const topProductsChartData = hasTopProducts
    ? {
        labels: Object.keys(insights.topProducts),
        datasets: [
          {
            label: 'Units Sold',
            data: Object.values(insights.topProducts),
            backgroundColor: '#e94560cc',
            borderColor: '#e94560',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      }
    : null;

  const allHours = Array.from({ length: 24 }, (_, i) => i);
  const busiestHoursChartData = hasBusiestHours
    ? {
        labels: allHours.map((h) => `${String(h).padStart(2, '0')}:00`),
        datasets: [
          {
            label: 'Orders',
            data: allHours.map((h) => insights.busiestHours[h] || 0),
            backgroundColor: '#1a1a2ecc',
            borderColor: '#1a1a2e',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      }
    : null;

  const sortedTopProducts = hasTopProducts
    ? Object.entries(insights.topProducts).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <div className="insights">
      <div className="insights__grid">
        {hasTopProducts && (
          <div className="insights__card insights__card--chart">
            <h2 className="insights__card-title">Top Selling Products</h2>
            <div className="insights__chart-wrapper">
              <Bar data={topProductsChartData} options={BAR_OPTIONS} />
            </div>
            <ul className="insights__product-list">
              {sortedTopProducts.map(([product, qty], i) => (
                <li key={product} className="insights__product-item">
                  <span className="insights__rank">#{i + 1}</span>
                  <span className="insights__product-name">{product}</span>
                  <span className="insights__product-qty">{qty} units</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasBusiestHours && (
          <div className="insights__card insights__card--chart">
            <h2 className="insights__card-title">Busiest Hours</h2>
            <div className="insights__chart-wrapper">
              <Bar data={busiestHoursChartData} options={BAR_OPTIONS} />
            </div>
          </div>
        )}

        {hasRecommendations && (
          <div className="insights__card">
            <h2 className="insights__card-title">Restock Recommendations</h2>
            <ul className="insights__restock-list">
              {insights.recommendations.map((rec) => (
                <li key={rec.product} className="insights__restock-item">
                  <div className="insights__restock-header">
                    <span className="insights__restock-badge">⚠ Restock</span>
                    <strong>{rec.product}</strong>
                  </div>
                  <p className="insights__restock-detail">
                    {rec.totalQuantitySold} units sold — {rec.recommendation}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Insights;
