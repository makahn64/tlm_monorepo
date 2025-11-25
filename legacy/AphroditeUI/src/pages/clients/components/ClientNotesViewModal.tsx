import React, {FC, useState} from 'react';
import {Client, Timestamp} from 'tlm-common';
import {Button, ListGroup, ListGroupItem, Modal} from "react-bootstrap";
import {useClient} from "../../../hooks/useClient";
import {timestampToFormattedDate} from "../../../services/api/helpers";
import {ClientNotesEditor} from "../ClientNotesEditor";
import {TextAreaModal} from "../../../components/modals/TextAreaModal";
import {updateClientMetadata} from "../../../services/api/clients";

interface Props {
  client: Client;
  onComplete?: () => void;
}

export const ClientNotesViewModal: FC<Props> = ({client, onComplete}) => {

  const {notes, metadata, client: {firstName}, reload} = useClient(client.uid);
  const [showModal, setShowModal] = useState(false);
  const [showBkgInfoModal, setShowBkgInfoModal] = useState(false);

  const handleUpdateBkgInfo = async (newInfo: string) => {
    console.log(newInfo);
    await updateClientMetadata(client.uid, {
      clientBackgroundInfo: {
        notes: newInfo
      }
    });
    await reload();
  };

  const clientBackgroundInfo = metadata && metadata.clientBackgroundInfo && metadata.clientBackgroundInfo.notes;

  return (
    <div>
      <h5 className="mb-3">Client Background Info <Button className="float-right" size="sm"
                                         onClick={() => setShowBkgInfoModal(true)}>{clientBackgroundInfo ? 'Edit' : 'Add'}</Button>
      </h5>
        {clientBackgroundInfo ? <div style={{border: '1px solid #d0d0d0', padding: 10, borderRadius: 3, backgroundColor: '#ffffff'}}>
          { clientBackgroundInfo.split('\n').map( l => <p>{l}</p>) }
        </div> : <p className="text-muted font-italic">There is no background info for {firstName}.</p>}
      <h5 className="mt-5">Trainer Updates<Button className="float-right" size="sm" onClick={() => setShowModal(true)}>Add
        Update</Button></h5>
      {notes.length === 0 &&
      <p className="text-muted">There are no notes on {client.firstName}.</p>}
      {notes.length ?
        <ListGroup className="mt-3">
          {notes.map((n, idx) => <ListGroupItem key={idx}>
            <p className="text-muted">{timestampToFormattedDate(n.createdOn as Timestamp)} by {n.authorName}</p>
            <p>{n.note}</p>
          </ListGroupItem>)}
        </ListGroup> :
        null
      }
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Client Notes for {client.firstName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ClientNotesEditor client={client}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <TextAreaModal title="Client Background Info"
                     onSave={handleUpdateBkgInfo}
                     initialValue={clientBackgroundInfo}
                     show={showBkgInfoModal}
                     onClose={() => setShowBkgInfoModal(false)}/>
    </div>
  );
};


