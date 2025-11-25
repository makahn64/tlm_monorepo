import React, {FC, useEffect, useState} from 'react';
import {PageContainer} from "../../components/containers/PageContainer";
import {useHistory, useParams} from 'react-router-dom';
import {Alert, Button, Col, Form, Modal, Row, Tab, Tabs} from "react-bootstrap";
import * as api from '../../services/api';
import {Media} from "tlm-common";
import {Selector} from "../../components/formElements/Selector";
import {TabContainer} from "../../components/containers/TabContainer";
import {GCSFilePicker} from "../../components/pickers/GCSFilePicker";
import {GoogleCloudImg} from "../../components/images/GoogleCloudImg";
import {GoogleCloudVideo} from "../../components/images/GoogleCloudVideo";
import {GCSFile} from "tlm-common";
import {GapSize, VerticalGap} from "../../components/layout/VerticalGap";
import JSONPretty from "react-json-pretty";

const BARE_MEDIA_ENTRY: Media = {
  description: "",
  duration: 0,
  id: "",
  metadata: {},
  name: "",
  thumbnail: {},
  type: "educational",
  video: {}
}

export const AddEditMediaPage: FC = () => {

  const {id} = useParams<{ id: string }>();
  const [media, setMedia] = useState<Media>(BARE_MEDIA_ENTRY);
  const [alertText, setAlertText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMimeType, setPickerMimeType] = useState('');
  const [pickerPrefix, setPickerPrefix] = useState('');
  const [targetPickerField, setTargetPickerField] = useState('');

  const history = useHistory();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const m = await api.media.getMedia(id) as Media;
      setMedia(m);
      setLoading(false);
    }

    if (id !== 'new') {
      load();
    }

  }, [id]);

  const existing = id !== 'new';
  const pageTitle = existing ? `Edit Media: ${media.name}` : `Add Media`;

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!existing) {
      console.log('Adding media');
      await api.media.createNewMedia(media);
      history.goBack();
    } else {
      console.log('Modifying media');
      await api.media.modifyFields(id, media);
      history.goBack();
    }
  }

  const handleDelete = async () => {
    setShowModal(true);
  }

  const confirmDelete = async (confirmed: boolean) => {
    setShowModal(false);
    if (confirmed) {
      await api.media.deleteMedia(id);
      history.go(-2);
    }
  }

  const updateField = (field: string, value: any) => {
    console.log('Updating field ', field, ' to ', value);
    setMedia({...media, [field]: value});
  }

  const handleMediaChange = (mediaField: string, prefix: string, type: string) => {
    setTargetPickerField(mediaField);
    setPickerPrefix(prefix);
    setPickerMimeType(type);
    setShowPicker(true);
  }

  const handleMediaPick = (pickedMedia: GCSFile | {}) => {
    setMedia({...media, [targetPickerField]: pickedMedia});
  }

  const removeMedia = (fieldName: string) => {
    setMedia({...media, [fieldName]: {}});
  }

  return (
    <PageContainer title={pageTitle} loading={loading}>
      <Button variant="primary" onClick={handleSubmit} className="float-right">
        SAVE
      </Button>
      {alertText && <Alert variant="danger" onClose={() => setAlertText('')} dismissible>
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
        <p>{alertText}</p>
      </Alert>}
      {existing && <Button variant="danger" onClick={handleDelete}>Delete Media</Button>}
      <Form className="mt-5" onSubmit={handleSubmit}>
        <Tabs>
          <Tab eventKey="basic" title="Basic Info">
            <TabContainer>
              <Form.Group controlId="title">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Media Name" onChange={event => {
                  updateField('name', event.target.value)
                }} value={media.name}/>
              </Form.Group>
              <Form.Group controlId="des">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" placeholder="Media Description" onChange={event => {
                  updateField('description', event.target.value)
                }} value={media.description}/>
                <Form.Group controlId="dur">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control type="number" placeholder="Duration (seconds)" onChange={event => {
                    updateField('duration', event.target.value)
                  }} value={media.duration}/>
                </Form.Group>
                <Selector label="Type" onChange={updateField} value={media.type}
                          options={['educational', 'foryou']} fieldName="type"/>
              </Form.Group>
            </TabContainer>
          </Tab>
          <Tab eventKey="media" title="Media">
            <VerticalGap gapSize={GapSize.md}/>
            <GoogleCloudImg meta={media?.thumbnail} style={{width: '25vw'}} label="Thumbnail"/>
            <Button size="sm"
                    onClick={() => handleMediaChange('thumbnail', '', 'image')}
                    variant="primary"
                    className="mt-2">
              Change Thumb</Button>
            <Button size="sm"
                    onClick={() => removeMedia('thumbnail')}
                    variant="danger"
                    className="mt-2 ml-1">
              Remove Thumb</Button>
            <VerticalGap gapSize={GapSize.md}/>
            <GoogleCloudVideo meta={media?.video} label="Video"/>
            <Button size="sm"
                    onClick={() => handleMediaChange('video', '', 'vid')}
                    variant="primary"
                    className="mt-2">
              Change Video
            </Button>
            <Button size="sm"
                    onClick={() => removeMedia('video')}
                    variant="danger"
                    className="mt-2 ml-1">
              Remove Video</Button>
            <VerticalGap gapSize={GapSize.md}/>
          </Tab>
          <Tab eventKey={"developer"} title={"JSON"}>
            <TabContainer>
              <Row>
                <Col>
                  <JSONPretty json={media}/>
                </Col>
              </Row>
            </TabContainer>
          </Tab>
        </Tabs>
      </Form>
      <Modal show={showModal} onHide={() => confirmDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Media</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to media exercise {media.name}? This does not delete the file, just the Media database entry referring to it.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => confirmDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => confirmDelete(true)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <GCSFilePicker show={showPicker}
                     onPick={handleMediaPick}
                     onHide={() => setShowPicker(false)}
                     prefix={pickerPrefix}
                     mimeType={pickerMimeType}/>
    </PageContainer>
);
};

