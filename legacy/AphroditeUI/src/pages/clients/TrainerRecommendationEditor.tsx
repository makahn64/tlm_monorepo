import React, {FC, useState} from 'react';
import {Client, Media, TrainerRecommendation} from 'tlm-common';
import {Button, Col, Container, Form, ListGroup, Row} from "react-bootstrap";
import {useClient} from "../../hooks/useClient";
import {TrainerRecCell} from "../../components/cells/TrainerRecCell";
import {Selector} from "../../components/formElements/Selector";
import {useAuthState} from "../../services/firebase/AuthProvider2State";
import {MediaPicker} from "../../components/pickers/MediaPicker";
import {GoogleCloudImg} from "../../components/images/GoogleCloudImg";
import {VerticalGap} from "../../components/layout/VerticalGap";
import {useUI} from "../../services/ui/UIProvider";
import {toast} from "react-toastify";
import * as api from '../../services/api';
import {on} from "cluster";

const REC_TYPE_OPTIONS = [
  {value: 'video', description: 'Educational Video'},
  {value: 'link', description: 'Web Link'},
  {value: 'text', description: 'Message'}
];

interface Props {
  client: Client;
  onComplete?: () => void;
}

export const TrainerRecommendationEditor: FC<Props> = ({client, onComplete}) => {

  const {recommendations, reload} = useClient(client.uid);
  const {userProfile} = useAuthState();
  const [newRec, setNewRec] = useState<TrainerRecommendation>({
    body: "",
    createdBy: "",
    createdOn: new Date(),
    id: "",
    media: undefined,
    recommendationType: 'video'
  });
  const [showPicker, setShowPicker] = useState(false);
  const { showLoader } = useUI();

  const updateField = (field: string, value: any) => {
    console.log('Updating field ', field, ' to ', value);
    setNewRec({...newRec, [field]: value});
  }

  const handleMediaPick = (media: Media | {}) => {
    // @ts-ignore
    setNewRec({...newRec, media});
  }

  const createRec = async () => {
    try {
      showLoader(true);
      const rec: TrainerRecommendation = { ...newRec, createdBy: userProfile?.displayName ||'TLM'};
      await api.clients.addRecommendationToClient(client.uid, rec);
      toast.success('Recommendation sent!');
      setNewRec({ ...newRec, body: '', media: undefined});
      await reload();
      if (onComplete){
        onComplete();
      }
    } catch (e) {
      toast.error('Recommendation send failure!');
      toast.error(e.message);
    } finally {
      showLoader(false);
    }
  }

  const handleDelete = async (rec: TrainerRecommendation) => {
    try {
      showLoader(true);
      await api.clients.deleteRecommendation(client.uid, rec.id);
      toast.success('Recommendation deleted!');
      await reload();
    } catch (e) {
      toast.error('Recommendation delete failure!');
      toast.error(e.message);
    } finally {
      showLoader(false);
    }
  }

  let notValid = true;
  switch (newRec.recommendationType) {
    case "video":
      notValid = !(newRec.body && newRec.media && newRec.media.name);
      break;
    case "text":
    case "link":
      notValid = !(newRec.body);
      break;
  }

  return (
    <Container className="mt-3 p-4">
      <Row>
        <Col className="border-right">
          <h4>Create Recommendation
            <Button
              size="sm"
              variant="primary"
              className="float-right"
              onClick={createRec}
              disabled={notValid}>SEND
            </Button>
          </h4>
          <VerticalGap gapSize={20}/>
          <Selector label="Type of Recommendation" onChange={updateField} value={newRec.recommendationType}
                    options={REC_TYPE_OPTIONS} fieldName="recommendationType"/>
          {newRec.recommendationType === 'video' &&
          <>
            <Form.Group controlId="body">
              <Form.Label>Note</Form.Label>
              <Form.Control type="text" placeholder="note" onChange={event => {
                updateField('body', event.target.value)
              }} value={newRec.body}/>
            </Form.Group>
            {newRec.media?.name ?
              <GoogleCloudImg meta={newRec.media.thumbnail} style={{width: '25vw'}} label={newRec.media.name}/> :
              null}
            <Button size="sm"
                    onClick={() => setShowPicker(true)}
                    variant="secondary"
                    className="mt-2">Pick Media</Button>
          </>
          }
          {newRec.recommendationType === 'text' &&
          <>
            <Form.Group controlId="body">
              <Form.Label>Message</Form.Label>
              <Form.Control type="text" placeholder="note" onChange={event => {
                updateField('body', event.target.value)
              }} value={newRec.body}/>
            </Form.Group>
          </>
          }
          {newRec.recommendationType === 'link' &&
          <>
            <Form.Group controlId="link">
              <Form.Label>Link</Form.Label>
              <Form.Control type="text" placeholder="link URL" onChange={event => {
                updateField('body', event.target.value)
              }} value={newRec.body}/>
            </Form.Group>
          </>
          }

        </Col>
        <Col>
          <h4>Recommendation History</h4>
          {recommendations.length === 0 &&
          <p className="text-muted">There are no recommendations for {client.firstName}.</p>}
          {recommendations.length ?
            <ListGroup>
              {recommendations.map(r => <TrainerRecCell rec={r} onDelete={handleDelete} key={r.id}/>)}
            </ListGroup> :
            null
          }
        </Col>
      </Row>
      <MediaPicker show={showPicker}
                   onPick={handleMediaPick}
                   onHide={() => setShowPicker(false)}/>
    </Container>
  );
};


