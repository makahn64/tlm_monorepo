import React, { FC } from 'react';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {Workout} from "tlm-common";

interface Props {
  workout: Workout;
  isEditable: boolean;
  onRemoveExercise?: (idx: number) => void;
}

// DEPRECATED in favor of WorkoutListCards

export const WorkoutList: FC<Props> = ({ workout, isEditable, onRemoveExercise}) => {

  return (
    <ListGroup>
      <TransitionGroup>
        {workout.exercises.map((e, idx) =>
          <CSSTransition
            key={`${e.name}:${idx}`}
            timeout={200}
            classNames="item"
          >
            <ListGroupItem>{idx + 1}. {e.name}{ isEditable && <span className="float-right text-danger"
                                                     onClick={() => onRemoveExercise!(idx)}>X</span>}
            </ListGroupItem>
          </CSSTransition>
        )}
      </TransitionGroup>
    </ListGroup>
  );
};
