import React, {FC, useEffect, useState} from 'react';
import {Button, Modal, Form} from 'react-bootstrap';

interface Props {
  title: string;
  textareaLabel?: string;
  initialValue?: string;
  saveButtonTitle?: string;
  cancelButtonTitle?: string;
  onSave: (s: string) => void;
  show: boolean;
  onClose: () => void;
}

export const TextAreaModal: FC<Props> = ({show, title, initialValue = '', saveButtonTitle = 'Save',
                                           cancelButtonTitle = 'Cancel', onClose, textareaLabel, onSave}) => {

  const [ textVal, setTextVal ] = useState(initialValue);

  const handleSave = () => {
    onSave(textVal);
    onClose();
  }

  useEffect(() => {
    setTextVal(initialValue);
  }, [initialValue]);

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          { textareaLabel ? <Form.Label>{textareaLabel}</Form.Label> : null }
          <Form.Control as="textarea" rows={5} value={textVal} onChange={(ev)=>setTextVal(ev.target.value)} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onClose}>{cancelButtonTitle}</Button>
        <Button variant="primary" onClick={handleSave}>
          {saveButtonTitle}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
