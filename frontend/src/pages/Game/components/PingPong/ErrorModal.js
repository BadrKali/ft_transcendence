import React from 'react';

const ErrorModal = ({ message, onClose }) => {
    const handleOverlayClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };
  
    return (
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <p>{message}</p>
        </div>
      </div>
    );
}
export default ErrorModal;
