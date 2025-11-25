import React, {FC, useState, useEffect } from 'react';
import {Button, Col, Container, Row, Form } from "react-bootstrap";
import * as api from '../../services/api';
import JSONPretty from "react-json-pretty";
import {Exercise} from "tlm-common";
import * as _ from 'lodash';
import {PageContainer} from "../../components/containers/PageContainer";

interface OwnProps {
}

type Props = OwnProps;

export const FirestorePage: FC<Props> = (props) => {

  const [ exercises, setExercises ] = useState<Exercise[]>([]);

  useEffect(()=> {
    getExercises();
  }, [])

  async function getExercises(){
    const e = await api.exercises.getAllExercises();
    // @ts-ignore
    setExercises(e);
  }

  const writeRandomDoc = async () => {
    const newId = await api.exercises.createNewExercise({ title: 'Random', description: 'by button'});
    console.log(`New doc ${newId}`);
    await getExercises();
  }

  const changeDoc = async ( ev: React.ChangeEvent<HTMLSelectElement> ) => {
    const id = ev.target.value;
    const newName = _.sample(['alice', 'betty', 'cindy', 'dee', 'elise']);
    await api.exercises.modifyFields(id, { title: newName });
    await getExercises();
  }

  const deleteDoc = async ( ev: React.ChangeEvent<HTMLSelectElement> ) => {
    const id = ev.target.value;
    await api.exercises.deleteExercise(id);
    await getExercises();
  }

  const options = exercises.map( e => <option key={e.docId}>{e.docId}</option>)

  return (
    <PageContainer title="Firebase Testing">
      <Container>
        <Row>
          <Col>
            <h1>Exercises</h1>
            <JSONPretty json={exercises}/>
            <Button onClick={writeRandomDoc}>New Exercise</Button>
          </Col>
          <Col>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Change Name Of...</Form.Label>
              <Form.Control as="select" onChange={changeDoc}>
                {options}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Nuke...</Form.Label>
              <Form.Control as="select" onChange={deleteDoc}>
                {options}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Container>
    </PageContainer>
  );
};


