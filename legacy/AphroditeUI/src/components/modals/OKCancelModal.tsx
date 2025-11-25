import React, { FC } from 'react';
import { Modal, Button, ButtonProps } from 'react-bootstrap';

interface Props {
  title: string;
  body: string;
  okButtonTitle?: string;
  okButtonVariant?: 'danger' | 'primary' | 'secondary' | 'warning';
  cancelButtonTitle?: string;
  show: boolean;
  onOK: () => void;
  onCancel: () => void;
}

export const OKCancelModal: FC<Props> = ({ show, title, body, okButtonTitle = 'OK', onOK,
                                           onCancel, cancelButtonTitle = 'Cancel', okButtonVariant = 'primary' }) => {
  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant={okButtonVariant} onClick={onOK}>
          {okButtonTitle}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          {cancelButtonTitle}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
