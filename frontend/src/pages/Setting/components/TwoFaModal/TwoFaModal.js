import React from 'react';
import './TwoFaModal.css'; // Assuming you'll add CSS here

const TwoFaModal = ({ show, handleClose }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <div className="modal-main">
        
      </div>
    </div>
  );
};

export default TwoFaModal;
