import React from 'react';

const ErrorComponent = ({ message }) => {
  if (!message) return null;

  return (
    <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
      {message}
    </div>
  );
};

export default ErrorComponent;
