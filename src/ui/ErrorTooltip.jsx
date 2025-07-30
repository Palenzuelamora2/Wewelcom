
import React, { useState } from 'react';
import './ErrorTooltip.css';

const ErrorTooltip = ({ message, children }) => {
  if (!message) {
    return children;
  }

  return (
    <div
      className="error-tooltip-container"
    >
      {/* Usamos el children como referencia al input que necesitamos para utilizar el tooltip que es el que se renderiza */}
      {children}
      <div className="error-tooltip-content">
        {message}
      </div>

    </div>
  );
};

export default ErrorTooltip;