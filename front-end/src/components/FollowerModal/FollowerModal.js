import React, { Component } from 'react';
import Modal from '../Modal/Modal';

class FollowerModal extends Component {

  render() {
    const { onClose } = this.props;

    return (
      <Modal onClose={onClose}>
        <p>children</p>
      </Modal>
    );
  }
}

  export default FollowerModal;