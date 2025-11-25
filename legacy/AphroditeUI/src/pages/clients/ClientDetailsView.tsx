import React, {FC, useState} from 'react';
import {Client} from 'tlm-common';
import {Badge, Button, Collapse, Container, Table, Row, Col, Tabs, Tab} from 'react-bootstrap';
import {BadgesFromArray} from "../../components/badges/BadgesfromArray";
import {mapBinaryInjuriesToStringArray, mapEquipmentToStringArray} from 'tlm-common';
import moment from "moment";
import {ProfileCard} from "../../components/cards/ProfileCard";
import {MissingData} from "../../components/dataDisplay/MissingData";
import {ClientNotesViewModal} from "./components/ClientNotesViewModal";
import {WorkoutHistoryTable} from "../workouts/WorkoutHistoryTable";
import {useClient} from "../../hooks/useClient";


interface Props {
  client: Client;
  startsOpen?: boolean;
  canCollapse?: boolean;
}

export const ClientDetailsView: FC<Props> = ({client, startsOpen = false, canCollapse=true}) => {

  const [ isCollapsed, setCollapsed] = useState(!startsOpen);

  const {uid} = client;
  const { finishedWorkouts, inProgressWorkouts, unstartedWorkouts } = useClient(uid);

  return (
    <div className="floatingcard w-100">
      { canCollapse ?
        <Button size="sm" variant="primary" onClick={()=>setCollapsed(!isCollapsed)}>{!isCollapsed ? 'Hide' : 'Show Profile, History and Notes'}</Button> :
        null }
      <Collapse in={!isCollapsed || !canCollapse}>
        <Container className="mt-3" fluid>
          <Row className="mt-3">
            <Col className="border-right col-12 col-md-6 col-lg-4" >
              <ProfileCard client={client}/>
              <hr/>
              <ClientNotesViewModal client={client}/>
            </Col>
            <Col className="col-12 col-md-6 col-lg-8">
              <h5>Completed Workouts</h5>
              <Tabs defaultActiveKey="new">
                <Tab eventKey="new" title="Not Started">
                  <WorkoutHistoryTable workouts={unstartedWorkouts} client={client}/>
                </Tab>
                <Tab eventKey="inProgress" title="In Process">
                  <WorkoutHistoryTable workouts={inProgressWorkouts} client={client}/>
                </Tab>
                <Tab eventKey="finished" title="Finished">
                  <WorkoutHistoryTable workouts={finishedWorkouts} client={client}/>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Container>
      </Collapse>
    </div>
  );
};

// old, will be removed
export const ClientDetailsTable: FC<Props> = ({client}) => {

  const {uid} = client;

  return (
    <Table striped bordered>
      <thead>
      <tr>
        <th>Due</th>
        <th>Fitness Level</th>
        <th>Injuries/Conditions</th>
        <th>Equipment</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{client.dueDate ? moment(client.dueDate).format('MM/DD/YYYY') : <MissingData id={uid}/>}</td>
        <td>{client.fitnessLevel ? client.fitnessLevel : <MissingData id={uid}/>}</td>
        <td>
          <BadgesFromArray data={mapBinaryInjuriesToStringArray(client)}/>
          <Badge variant="primary" className="mr-1">Back pain: {client.backPain}</Badge>
          <Badge variant="primary" className="mr-1">Sciatica: {client.sciatica}</Badge>
          <Badge variant="primary" className="mr-1">cSection: {client.cSection || 'no'}</Badge>
          <Badge variant="primary" className="mr-1">Posture: {client.posture}</Badge>
        </td>
        <td>
          <BadgesFromArray data={mapEquipmentToStringArray(client)}/>
        </td>
      </tr>
      </tbody>
    </Table>
  );
};
