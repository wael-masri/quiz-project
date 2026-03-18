import React from 'react';
import './Spinner.css';

function Spinner({ message = 'Loading...' }) {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" role="status" aria-label={message} />
      <p className="spinner-label">{message}</p>
    </div>
  );
}

export default Spinner;
