import React from 'react';
import './StatCard.css';

function StatCard({ title, value, subtitle }) {
  return (
    <div className="stat-card">
      <p className="stat-card__title">{title}</p>
      <p className="stat-card__value" title={typeof value === 'string' ? value : undefined}>
        {value}
      </p>
      {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
    </div>
  );
}

export default StatCard;
