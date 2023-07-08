import React, { useEffect, useState } from 'react';
import './AlertBox.css';

const AlertBox = ({showAlert, setShowAlert, message}) => {
  // const [showAlert, setShowAlert] = useState(false);

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };


  return (
    <div>
      {showAlert && (
        <div className="alert-box">
          <div className="alert-content">
            <span className="close-btn" onClick={handleCloseAlert}>&times;</span>
            <h3 className="alert-title">Alert</h3>
            <p className="alert-message">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertBox;
