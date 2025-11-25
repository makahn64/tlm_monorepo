import React, {FC} from 'react';
import {Button, Modal} from 'react-bootstrap';
import {Exercise} from 'tlm-common';
import {GoogleCloudVideo} from "../images/GoogleCloudVideo2";

interface Props {
  title: string;
  exercise: Exercise;
  buttonTitle: string;
  show: boolean;
  onClose: () => void;
}

export const PreviewModal: FC<Props> = ({show, title, exercise, buttonTitle, onClose}) => {
  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        { exercise?.name !== 'break' ?
        <div className="d-flex flex-column">
          <div style={{ alignSelf: 'center'}}>
            <GoogleCloudVideo meta={exercise?.prenatalVideo} label="Prenatal Video"/>
          </div>
          <div style={{ alignSelf: 'center', marginTop: 20}}>
            <GoogleCloudVideo meta={exercise?.postnatalVideo} label="Postnatal Video"/>
          </div>
        </div> : <h3>Really? You need to see what a break looks like? You win employee of the day. 💁‍♀️</h3> }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          {buttonTitle}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
