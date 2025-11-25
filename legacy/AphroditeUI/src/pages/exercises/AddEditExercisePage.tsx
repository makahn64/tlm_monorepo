import React, {FC, useEffect, useState} from 'react';
import {PageContainer} from "../../components/containers/PageContainer";
import {useHistory, useParams} from 'react-router-dom';
import {Alert, Button, Col, Form, Modal, Row, Tab, Tabs} from "react-bootstrap";
import * as api from '../../services/api';
import {GCSFile, Exercise, ACTIVATES, BARE_EXERCISE_ENTRY, MOVEMENT_PATTERNS, RELEASES, STRESSES, EQUIPMENT, EQUIPMENT_DESCRIPTION_MAP} from 'tlm-common';
import {Selector} from "../../components/formElements/Selector";
import {CheckboxGroupStringArrays} from "../../components/formElements/CheckboxGroupStringArrays";
import {TabContainer} from "../../components/containers/TabContainer";
import {GCSFilePicker} from "../../components/pickers/GCSFilePicker";
import {GoogleCloudImg} from "../../components/images/GoogleCloudImg";
import {GoogleCloudVideo} from "../../components/images/GoogleCloudVideo";
import {GapSize, VerticalGap} from "../../components/layout/VerticalGap";
import {CheckboxGroupValueDescriptionArrays} from "../../components/formElements/CheckboxGroupValueDescriptionArrays";
import JSONPretty from "react-json-pretty";

export const AddEditExercisePage: FC = () => {

  const {id} = useParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise>(BARE_EXERCISE_ENTRY);
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
      const ex = await api.exercises.getExercise(id) as Exercise;
      setExercise(ex);
      setLoading(false);
    }

    if (id!=='new') {
      load();
    }

  }, [id]);

  const existing = id !== 'new';
  const pageTitle = existing ? `Edit Exercise: ${exercise.name}` : `Add Exercise ${exercise.name}`;

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(exercise);
    if (!existing) {
      console.log('Adding exercise');
      const name = exercise.title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'"\s]/g,"_");
      await api.exercises.createNewExercise({...exercise, name});
      history.goBack();
    } else {
      console.log('Modifying exercise');
      await api.exercises.modifyFields(id, exercise);
      history.goBack();
    }
  }

  const handleDelete = async () => {
    setShowModal(true);
  }

  const confirmDelete = async (confirmed: boolean) => {
    setShowModal(false);
    if (confirmed) {
      await api.exercises.deleteExercise(id);
      history.go(-2);
    }
  }

  const updateField = (field: string, value: any) => {
    console.log('Updating field ', field, ' to ', value);
    setExercise({...exercise, [field]: value});
  }

  const handlePrecompChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Precomp changed to ${ev.target.checked}`);
    setExercise({...exercise, preComposited: ev.target.checked});
  }

  const handleMediaChange = (mediaField: string, prefix: string, type: string) => {
    setTargetPickerField(mediaField);
    setPickerPrefix(prefix);
    setPickerMimeType(type);
    setShowPicker(true);
  }

  const handleMediaPick = (media: GCSFile | {}) => {
    setExercise({...exercise, [targetPickerField]: media});
  }

  const removeMedia = (fieldName: string) => {
    setExercise({...exercise, [fieldName]: {}});
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
      {existing && <Button variant="danger" onClick={handleDelete}>Delete Exercise</Button>}
      <Form className="mt-5" onSubmit={handleSubmit}>
        <Tabs>
          <Tab eventKey="basic" title="Basic Info">
            <TabContainer>
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" placeholder="Exercise Title" onChange={event => {
                  updateField('title', event.target.value)
                }} value={exercise.title}/>
              </Form.Group>
              <Selector label="Movement Pattern" onChange={updateField} value={exercise.movementPattern}
                        options={MOVEMENT_PATTERNS} fieldName="movementPattern"/>
              <Selector label="Intensity" onChange={updateField} value={exercise.intensity}
                        options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} fieldName="intensity"/>
            </TabContainer>
          </Tab>
          <Tab eventKey="physio" title="Stress/Release/Activate">
            <TabContainer>
              <Row>
                <Col>
                  <CheckboxGroupStringArrays label="Stress" onChange={updateField} value={exercise.stress || []}
                                             fieldName="stress" allChoices={STRESSES}/>
                </Col>
                <Col>
                  <CheckboxGroupStringArrays label="Releases" onChange={updateField} value={exercise.releases || []}
                                             fieldName="releases" allChoices={RELEASES}/>
                </Col>
                <Col>
                  <CheckboxGroupStringArrays label="Activates" onChange={updateField} value={exercise.activates || []}
                                             fieldName="activates" allChoices={ACTIVATES}/>
                </Col>
              </Row>
            </TabContainer>
          </Tab>
          <Tab eventKey="eqt" title="Equipment">
            <TabContainer>
              <Row>
                <Col>
                  <CheckboxGroupValueDescriptionArrays
                    value={exercise.equipment}
                    allChoices={EQUIPMENT_DESCRIPTION_MAP}
                    fieldName={'equipment'}
                    onChange={updateField}
                    label={'Required Equipment'}
                  />
                </Col>
                <Col>
                  <CheckboxGroupValueDescriptionArrays
                    value={exercise.optionalEquipment}
                    allChoices={EQUIPMENT_DESCRIPTION_MAP}
                    fieldName={'optionalEquipment'}
                    onChange={updateField}
                    label={'Optional Equipment'}
                  />
                </Col>
              </Row>

            </TabContainer>
          </Tab>
          <Tab eventKey="media" title="Media">
            <VerticalGap gapSize={GapSize.md}/>
            <GoogleCloudImg meta={exercise?.prenatalThumb} style={{width: '25vw'}} label="Prenatal Thumbnail"/>
            <Button size="sm"
                    onClick={() => handleMediaChange('prenatalThumb', 'pre', 'image')}
                    variant="primary"
                    className="mt-2">
              Change Prenatal
              Thumb</Button>
            <Button size="sm"
                    onClick={() => removeMedia('prenatalThumb')}
                    variant="danger"
                    className="mt-2 ml-1">
              Remove Thumb</Button>
            <VerticalGap gapSize={GapSize.md}/>
            <GoogleCloudVideo meta={exercise?.prenatalVideo} label="Prenatal Video"/>
            <Button size="sm"
                    onClick={() => handleMediaChange('prenatalVideo', 'pre', 'vid')}
                    variant="primary"
                    className="mt-2">
              Change Prenatal Video
            </Button>
            <Button size="sm"
                    onClick={() => removeMedia('prenatalVideo')}
                    variant="danger"
                    className="mt-2 ml-1">
              Remove Video</Button>
            <VerticalGap gapSize={GapSize.md}/>
            <GoogleCloudImg meta={exercise?.postnatalThumb} style={{width: '25vw'}} label="Postnatal Thumbnail"/>
            <Button size="sm"
                    onClick={() => handleMediaChange('postnatalThumb', 'post', 'image')}
                    variant="primary"
                    className="mt-2">Change Postnatal
              Thumb</Button>
            <Button size="sm"
                    onClick={() => removeMedia('postnatalThumb')}
                    variant="danger"
                    className="mt-2 ml-1">
              Remove Thumb</Button>
            <VerticalGap gapSize={GapSize.md}/>
            <GoogleCloudVideo meta={exercise?.postnatalVideo} label="Postnatal Video"/>
            <Button className="mt-2" size="sm" onClick={() => handleMediaChange('postnatalVideo', 'post', 'vid')}
                    variant="primary">Change Postnatal
              Video</Button>
            <Button size="sm"
                    onClick={() => removeMedia('postnatalVideo')}
                    variant="danger"
                    className="mt-2 ml-1">
              Remove Video</Button>
            <VerticalGap gapSize={GapSize.md}/>
            <GoogleCloudImg meta={exercise?.instructionThumb} style={{width: '25vw'}} label="Instructions Thumbnail"/>
            <Button size="sm"
                    className="mt-2"
                    onClick={() => handleMediaChange('instructionThumb', '', 'image')}
                    variant="primary">Change Instruction
              Thumb</Button>
            <Button size="sm"
                    onClick={() => removeMedia('instructionThumb')}
                    variant="danger"
                    className="mt-2 ml-1">
              Remove Thumb</Button>
            <VerticalGap gapSize={GapSize.md}/>
            <GoogleCloudVideo meta={exercise?.instructionVideo} label="Instructions Video"/>
            <Button size="sm"
                    className="mt-2"
                    onClick={() => handleMediaChange('instructionVideo', '', 'vid')} variant="primary">Change
              Instruction
              Video</Button>
            <Button size="sm"
                    onClick={() => removeMedia('instructionVideo')}
                    variant="danger"
                    className="mt-2 ml-1">
              Remove Video</Button>
          </Tab>
          <Tab eventKey="meta" title="Metadata">
            <TabContainer>
              <Form.Check
                type="switch"
                id="composite-switch"
                label="Pre-composited (legacy videos)"
                checked={exercise?.preComposited}
                onChange={handlePrecompChange}
              />
              <p className="text-muted font-italic">Pre-composited videos have the title and % completed in the video
                itself. Future versions will do this in the app.</p>
            </TabContainer>
          </Tab>
          <Tab eventKey={"developer"} title={"JSON"}>
            <TabContainer>
              <Row>
                <Col>
                  <JSONPretty json={exercise}/>
                </Col>
              </Row>
            </TabContainer>
          </Tab>
        </Tabs>
      </Form>
      <Modal show={showModal} onHide={() => confirmDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Exercise</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to delete exercise {exercise.title}?</Modal.Body>
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

