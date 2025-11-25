import React, {FC} from 'react';
import {Workout} from "tlm-common";
import {Badge, Col, Container, Row} from "react-bootstrap";
import {WorkoutCard} from "./WorkoutCard";

interface Props {
  workouts: Workout[],
  title?: string;
  showCount?: boolean;
  onStart: (w: Workout) => void;
}

export const WorkoutDeck: FC<Props> = ({workouts, title, showCount, onStart}) => {

  return (
    <Container className="pr-sm-0 pr-md-5">
      <Row>
        <Col>
          {title && <h2 className="antipasto-medium">{title}</h2>}
          {showCount && <Badge variant="primary">{workouts.length} workouts available</Badge>}
        </Col>
      </Row>
      <Row>
        {workouts.map((w, idx) => (
          <Col sm={12} md={6} xl={4}>
            <WorkoutCard workout={w}
                         key={idx}
                         onStart={() => onStart(w)}/>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
