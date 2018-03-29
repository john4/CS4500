import React, { Component } from 'react';
import './Modal.css';

class Modal extends Component {
  render() {
    const { children, onClose } = this.props;

    return (
      <div className="Modal-backdrop">
        <div className="Modal-container">
          <div className="Modal-body">
            <div className="Modal-close" onClick={onClose}>
              <i className="fas fa-times"></i>
            </div>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

  export default Modal;