import React, {FC} from 'react';
import {Col, Container, Form, Row} from "react-bootstrap";
import {Exercise, Workout, WorkoutType} from "tlm-common";
import {WorkoutListCards} from "./WorkoutListCards";

interface Props {
  workout: Workout;
  onFieldChange: (field: string, value: string) => void;
  prebuilt?: boolean;
}

export const WorkoutNotesEditor: FC<Props> = ({ workout, onFieldChange, prebuilt= false}) => {

  return (
    <Container fluid className="mt-3">
        <Row>
          <Col sm={12} md={6}>
            <h5>{workout.workoutType === WorkoutType.normal ? "Normal" : "Mobility"} Workout</h5>
            <WorkoutListCards exercises={workout.exercises as Exercise[]}/>
          </Col>
          <Col className="ml-3">
            <h5>Add A Workout Name/Title { prebuilt ? '(REQUIRED)' : '(optional)'}</h5>
            <Form.Group controlId="name" >
              <Form.Control type="text" placeholder="Workout name..." onChange={event => {
                onFieldChange('name', event.target.value)
              }} value={workout.name}/>
            </Form.Group>
            { prebuilt ?
              <>
              <h5 className="mt-5">Add Prebuilt Workout Description</h5>
              <Form.Group controlId="internalDesc">
              <Form.Label>Internal prebuilt workout description (client does not see)</Form.Label>
              <Form.Control type="text" as="textarea"  placeholder="Prebuilt workout description..." onChange={event => {
                onFieldChange('internalDescription', event.target.value)
              }} value={workout.internalDescription}/>
            </Form.Group></> : null }
            <h5 className="mt-5">Add Notes</h5>
            <Form.Group controlId="title">
              <Form.Label>Notes for Client</Form.Label>
              <Form.Control type="text" as="textarea" placeholder="Notes" onChange={event => {
                onFieldChange('clientNotes', event.target.value)
              }} value={workout.clientNotes}/>
            </Form.Group>
            <Form.Group controlId="w">
              <Form.Label>Notes for TLM (client will not see these)</Form.Label>
              <Form.Control type="text" as="textarea"  placeholder="Notes" onChange={event => {
                onFieldChange('internalNotes', event.target.value)
              }} value={workout.internalNotes}/>
            </Form.Group>
          </Col>
        </Row>
    </Container>
  );
};
