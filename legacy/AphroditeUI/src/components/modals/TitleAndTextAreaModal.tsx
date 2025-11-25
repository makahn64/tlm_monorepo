import React, {FC, useState} from 'react';
import {Button, Form, Modal} from 'react-bootstrap';

interface Props {
  modalTitle: string;
  textareaLabel?: string;
  titleInputLabel?: string;
  initialTextAreaValue?: string;
  initialTitleValue?: string;
  saveButtonTitle?: string;
  cancelButtonTitle?: string;
  onSave: (title: string, textArea: string) => void;
  show: boolean;
  onClose: () => void;
}

export const TitleAndTextAreaModal: FC<Props> = ({
                                                   show,
                                                   modalTitle,
                                                   initialTextAreaValue = '',
                                                   textareaLabel,
                                                   initialTitleValue = '',
                                                   titleInputLabel,
                                                   saveButtonTitle = 'Save',
                                                   cancelButtonTitle = 'Cancel',
                                                   onClose,
                                                   onSave
                                                 }) => {

  const [textAreaVal, setTextAreaVal] = useState(initialTextAreaValue);
  const [titleVal, setTitleVal] = useState(initialTitleValue);

  const handleSave = () => {
    onSave(titleVal, textAreaVal);
    resetAndClose();
  }

  const resetAndClose = () => {
    setTitleVal('');
    setTextAreaVal('');
    onClose();
  }

  return (
    <Modal show={show} onHide={resetAndClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          {titleInputLabel? <Form.Label>{titleInputLabel}</Form.Label> : null}
          <Form.Control as="input" placeholder="Name..." value={titleVal} onChange={(ev) => setTitleVal(ev.target.value)}
            className="mb-3"/>
          {textareaLabel ? <Form.Label>{textareaLabel}</Form.Label> : null}
          <Form.Control as="textarea" placeholder="Instructions..." rows={5} value={textAreaVal} onChange={(ev) => setTextAreaVal(ev.target.value)}/>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={resetAndClose}>{cancelButtonTitle}</Button>
        <Button variant="primary" onClick={handleSave} disabled={titleVal?.length<3}>
          {saveButtonTitle}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
