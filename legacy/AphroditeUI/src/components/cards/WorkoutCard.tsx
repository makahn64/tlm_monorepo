import React, {FC} from 'react';
import {Workout} from "tlm-common";

interface Props {
  workout: Workout;
  onClick?(): void;
}

// NOT USED NOT DONE GONNA USE A TABLE for Alice rev
export const WorkoutCard: FC<Props> = ({workout, onClick}) => {
  return (
    <div className="exercise-card justify-content-center" onClick={onClick}>
    </div>
  );
};

