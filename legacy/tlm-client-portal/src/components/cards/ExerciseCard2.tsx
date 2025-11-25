import React, {CSSProperties, FC} from 'react';
import {Exercise, WorkoutEntry} from "tlm-common";
import { Card } from 'react-bootstrap';
import {gcsUrlForFileName} from "../../services/gcf/gcsUrlForFileName";
import exerciseImg from '../../../src/assets/images/exercise.png';
import breakImg from '../../../src/assets/images/break.png';

interface Props {
  exercise: WorkoutEntry;
  onClick?(): void;
  title?: string;
}

export const ExerciseCard: FC<Props> = ({title, exercise, onClick}) => {

  const thumbName = (exercise as Exercise).prenatalThumb.name;
  let url = (exercise.name !== 'break') ? exerciseImg : breakImg;
  if (thumbName) {
    url = gcsUrlForFileName(thumbName);
  }

  return (
    <Card style={{ width: '10rem', margin: 10 }} className="float-left" onClick={onClick}>
      <Card.Img variant="top" src={url} />
      { title && <p style={styles.number}>{title}</p> }
      <Card.Body style={{padding: 0}}>
        <Card.Text style={{fontSize: 12, textAlign: 'center'}}>{exercise.name}</Card.Text>
      </Card.Body>
    </Card>
  );
};

const styles ={
  number: {
    marginTop: -40,
    marginLeft: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    color: '#000000',
    padding: 5,
    borderRadius: 30,
    width: 30,
    marginBottom: 8
  } as CSSProperties
};
