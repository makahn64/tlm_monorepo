import React, {FC} from 'react';
import {useClient} from "../../hooks/useClient";
import {useAuthState} from "../../services/firebase/AuthProvider";
import {Container, Row, Col, TabContainer, Tab, Nav} from "react-bootstrap";
import {WorkoutCard} from "../../components/cards/WorkoutCard";
import { auth } from '../../services/firebase/firebaseCore';
import {Workout} from "tlm-common";
import { useHistory } from 'react-router-dom';
import {ClientPortalContainer} from "../clientPortal/components/ClientPortalContainer";
import {WorkoutDeck} from "../../components/cards/WorkoutDeck";
import {VerticalGap} from "../../components/layout/VerticalGap";

export const ClientLandingPage: FC = () => {
  const {userProfile} = useAuthState();
  const {client, loading, addWorkout, unfinishedWorkouts: workouts} = useClient(userProfile!.uid);
  const history = useHistory();

  const handleLogout = async  () => {
    await auth.signOut();
  }

  const handleStart = (w: Workout) => {
    history.push(`/playworkout/${w.id}`);
  }

  return (
    <ClientPortalContainer>
      <VerticalGap gapSize={30}/>
      <WorkoutDeck workouts={workouts} onStart={handleStart} title={'Your Workouts'}/>

      {/*<Tab.Container defaultActiveKey="new">*/}
      {/*  <Row>*/}
      {/*    <Col sm={2} className="mt-3">*/}
      {/*      <Nav variant="pills" className="flex-column m-2">*/}
      {/*        <Nav.Item>*/}
      {/*          <Nav.Link eventKey="new">Current</Nav.Link>*/}
      {/*        </Nav.Item>*/}
      {/*        <Nav.Item>*/}
      {/*          <Nav.Link eventKey="favorites">Favorites</Nav.Link>*/}
      {/*        </Nav.Item>*/}
      {/*        <Nav.Item>*/}
      {/*          <Nav.Link eventKey="history">History</Nav.Link>*/}
      {/*        </Nav.Item>*/}
      {/*      </Nav>*/}
      {/*    </Col>*/}
      {/*    <Col sm={10} className="mt-4">*/}
      {/*      <Tab.Content>*/}
      {/*        <Tab.Pane eventKey="new">*/}
      {/*          <WorkoutDeck workouts={workouts} onStart={handleStart} title={'New Workouts'}/>*/}
      {/*        </Tab.Pane>*/}
      {/*        <Tab.Pane eventKey="favorites">*/}
      {/*          <WorkoutDeck workouts={workouts} onStart={handleStart} title={'Favorites'}/>*/}
      {/*        </Tab.Pane>*/}
      {/*        <Tab.Pane eventKey="history">*/}
      {/*          <WorkoutDeck workouts={workouts} onStart={handleStart} title={'Workouts History'}/>*/}
      {/*        </Tab.Pane>*/}
      {/*      </Tab.Content>*/}
      {/*    </Col>*/}
      {/*  </Row>*/}
      {/*</Tab.Container>*/}
    </ClientPortalContainer>
  );
};


