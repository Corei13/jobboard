import React from 'react';

const Alert = ({ state: [[type, message], setAlert], showClose = true }) =>
  !message ? <></> : (
    <div className={`jy-alert ${type}-alert`}>
      <div className="icon">
        <i className="fas fa-check-circle"></i>
      </div>
      <p>{message}</p>
      {
        showClose && (
          <div className="close_">
            <a href="#" onClick={() => setAlert([])}><i className="fas fa-times"></i></a>
          </div>
        )
      }
    </div>
  );

export default Alert;
