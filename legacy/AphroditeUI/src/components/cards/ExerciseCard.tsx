import React, {FC} from 'react';
import {Exercise} from "tlm-common";

interface Props {
  exercise: Exercise | { name: string };
  onClick?(): void;
}

export const ExerciseCard: FC<Props> = ({exercise, onClick}) => {

  if (exercise.name === 'break') {
    return (
      <div className="exercise-card break" onClick={onClick}>
        <p>BREAK</p>
      </div>
    )
  }

  return (
    <div className="exercise-card justify-content-center" onClick={onClick}>
      <p>{(exercise as Exercise).movementPattern}<br/>{(exercise as Exercise).name}</p>
    </div>
  );
};
