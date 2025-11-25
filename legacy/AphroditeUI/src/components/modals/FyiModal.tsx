import React, { FC } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface Props {
  title: string;
  body: string;
  buttonTitle: string;
  show: boolean;
  onClose: () => void;
}

export const FyiModal: FC<Props> = ({ show, title, body, buttonTitle, onClose}) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          {buttonTitle}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
