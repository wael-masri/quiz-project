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

const LABEL_MAX = 14;

const truncateLabel = (label) =>
  label.length > LABEL_MAX ? `${label.slice(0, LABEL_MAX)}…` : label;

const BAR_OPTIONS = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        title: (items) => items.map((i) => i.label),
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
      grid: { color: '#f0f2f5' },
    },
    x: {
      grid: { display: false },
      ticks: {
        callback: function (val) {
          const label = this.getLabelForValue(val);
          return truncateLabel(label);
        },
        maxRotation: 30,
        minRotation: 0,
      },
    },
  },
};

function Insights({ insights = null, loading = false, error = null }) {
  const [showAllProducts, setShowAllProducts] = React.useState(false);
  const [showAllRecommendations, setShowAllRecommendations] = React.useState(false);

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

  const displayedProducts = showAllProducts ? sortedTopProducts : sortedTopProducts.slice(0, 3);
  const displayedRecommendations = showAllRecommendations
    ? insights.recommendations
    : insights.recommendations?.slice(0, 4) || [];

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
              {displayedProducts.map(([product, qty], i) => (
                <li key={product} className="insights__product-item">
                  <span className="insights__rank">#{i + 1}</span>
                  <span className="insights__product-name" title={product}>{product}</span>
                  <span className="insights__product-qty">{qty} units</span>
                </li>
              ))}
            </ul>
            {sortedTopProducts.length > 3 && (
              <button
                className="insights__expand-btn"
                onClick={() => setShowAllProducts(!showAllProducts)}
              >
                {showAllProducts ? 'Show Less' : `See More (${sortedTopProducts.length - 3} more)`}
              </button>
            )}
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
            <h2 className="insights__card-title">Recommendations</h2>
            <ul className="insights__restock-list">
              {displayedRecommendations.map((rec) => (
                <li
                  key={rec.product}
                  className={`insights__restock-item insights__restock-item--${rec.type}`}
                >
                  <div className="insights__restock-header">
                    <span className={`insights__restock-badge insights__restock-badge--${rec.type}`}>
                      {rec.type === 'restock' ? '⚠ Restock' : '↓ Review'}
                    </span>
                    <strong>{rec.product}</strong>
                  </div>
                  <p className="insights__restock-detail">{rec.message}</p>
                </li>
              ))}
            </ul>
            {insights.recommendations.length > 4 && (
              <button
                className="insights__expand-btn"
                onClick={() => setShowAllRecommendations(!showAllRecommendations)}
              >
                {showAllRecommendations ? 'Show Less' : `See More (${insights.recommendations.length - 4} more)`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Insights;
