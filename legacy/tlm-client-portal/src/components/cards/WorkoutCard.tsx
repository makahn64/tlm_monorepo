import React, {CSSProperties, FC} from 'react';
import {Workout, Exercise, Timestamp} from "tlm-common";
import { Card, Button } from 'react-bootstrap';
import {gcsUrlForFileName} from "../../services/gcf/gcsUrlForFileName";
import {timestampToFormattedDate} from "../../services/api/helpers";
import { BsFillPlayFill, BsFillHeartFill, BsHeart } from 'react-icons/bs';

interface Props {
  workout: Workout;
  title?: string;
  onStart: (w: Workout) => void;
}

export const WorkoutCard: FC<Props> = ({workout, title, onStart}) => {
  const { exercises } = workout;
  const firstE = exercises[0];
  const { prenatalThumb, postnatalThumb } = firstE as Exercise;

  return (
    <Card className="mr-sm-0 mr-md-2 mb-2">
      <div style={{ position: 'relative'}}>
        <Card.Img variant="top" src={gcsUrlForFileName(prenatalThumb.name)} />
        <Card.ImgOverlay>
          {/*{ !workout.favorite && <BsHeart style={styles.heart} className="float-right"/> }*/}
          {/*{ workout.favorite && <BsFillHeartFill style={styles.heartFill} className="float-right"/> }*/}
          <BsFillPlayFill style={styles.playButton} onClick={()=>onStart(workout)}/>
        </Card.ImgOverlay>
      </div>
      <Card.Body>
        { title && <Card.Title>{title}</Card.Title> }
        <Card.Text className="text-muted">
          From {workout.createdBy} on {timestampToFormattedDate(workout.createdAt as Timestamp)}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

const styles = {
  playButton: {
    fontSize: '10px',
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
    width: '100%',
    height: '50%',
    marginTop: '10%'
  } as CSSProperties,
  heartFill: {
    color: '#de6363',
    fontSize: 20
  },
  heart: {
    color: 'white',
    fontSize: 20
  }
}
