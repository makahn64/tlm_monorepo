import React, {FC, useState} from 'react';
import {Client, Timestamp } from 'tlm-common';
import {Button, Col, Container, Form, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import {useClient} from "../../hooks/useClient";
import {useAuthState} from "../../services/firebase/AuthProvider2State";
import {VerticalGap} from "../../components/layout/VerticalGap";
import {useUI} from "../../services/ui/UIProvider";
import {toast} from "react-toastify";
import {timestampToFormattedDate} from "../../services/api/helpers";

const REC_TYPE_OPTIONS = [
  {value: 'video', description: 'Educational Video'},
  {value: 'link', description: 'Web Link'},
  {value: 'text', description: 'Message'}
];

interface Props {
  client: Client;
  onComplete?: () => void;
}

export const ClientNotesEditor: FC<Props> = ({client, onComplete}) => {

  const {notes, addNote, reload} = useClient(client.uid);
  const {userProfile} = useAuthState();
  const [newNote, setNewNote] = useState<string>('');
  const { showLoader } = useUI();

  const createNote = async () => {
    try {
      showLoader(true);
      await addNote(client.uid, newNote);
      toast.success('Note entered!');
      setNewNote('');
      await reload();
      if (onComplete){
        onComplete();
      }
    } catch (e) {
      toast.error('Note save failure!');
      toast.error(e.message);
    } finally {
      showLoader(false);
    }
  }

  return (
    <Container className="mt-5" fluid>
      <Row>
        <Col className="border-right">
          <h4>Create Trainer Update
            <Button
              size="sm"
              variant="primary"
              className="float-right"
              onClick={createNote}
              disabled={newNote.length < 2}>SAVE
            </Button>
          </h4>
          <VerticalGap gapSize={20}/>
            <Form.Group controlId="body">
              <Form.Label>Note</Form.Label>
              <Form.Control type="text" placeholder="note" onChange={event => {
                setNewNote(event.target.value)
              }} value={newNote}/>
            </Form.Group>
        </Col>
        <Col>
          <h4>Updates</h4>
          {notes.length === 0 &&
          <p className="text-muted">There are no updates for {client.firstName}.</p>}
          {notes.length ?
            <ListGroup>
              {notes.map(n => <ListGroupItem>
                <h5>{timestampToFormattedDate(n.createdOn as Timestamp)} by {n.authorName}</h5>
                <hr/>
                <p>{n.note}</p>
              </ListGroupItem>)}
            </ListGroup> :
            null
          }
        </Col>
      </Row>
    </Container>
  );
};


