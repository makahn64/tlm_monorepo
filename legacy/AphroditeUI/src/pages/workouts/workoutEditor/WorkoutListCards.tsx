import React, {FC} from 'react';
import {Exercise} from "tlm-common";
import {ExerciseCard} from "../../../components/cards/ExerciseCardHz";

interface Props {
  exercises: Exercise[];
}

export const WorkoutListCards: FC<Props> = ({exercises}) => {

  return (
    <div>
      <div className="mt-2 overflow-auto p-2" style={{height: 500, backgroundColor: '#f0f0f0'}}>
        {exercises.map(e => <ExerciseCard exercise={e}/>)}
      </div>
    </div>
  );
};
