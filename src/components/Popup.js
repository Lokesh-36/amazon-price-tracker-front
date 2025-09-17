import React from 'react';

const Popup = ({ message, type = 'success', isVisible, onClose }) => {
  if (!isVisible) return null;

  const getPopupClass = () => {
    switch (type) {
      case 'success':
        return 'popup popup-success';
      case 'error':
        return 'popup popup-error';
      case 'warning':
        return 'popup popup-warning';
      case 'info':
        return 'popup popup-info';
      default:
        return 'popup popup-success';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '✅';
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className={getPopupClass()} onClick={(e) => e.stopPropagation()}>
        <div className="popup-content">
          <span className="popup-icon">{getIcon()}</span>
          <span className="popup-message">{message}</span>
          <button className="popup-close" onClick={onClose}>
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
