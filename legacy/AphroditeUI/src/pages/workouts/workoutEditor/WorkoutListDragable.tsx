import React, {FC} from 'react';
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {Exercise, Workout} from "tlm-common";
import {Draggable, Droppable} from 'react-beautiful-dnd';

interface Props {
  workout: Workout;
  isEditable: boolean;
  onRemoveExercise?: (idx: number) => void;
  onChange?: (workout: Workout) => void;
}

export const WorkoutListDraggable: FC<Props> = ({workout, isEditable, onRemoveExercise}) => {
  return (
    <div style={{minHeight: 900, border: '1px solid red'}}>

      <Droppable droppableId={"workout"}>
        {(provided) => (
          <ListGroup {...provided.droppableProps} ref={provided.innerRef}>
            {workout.exercises.map((e, idx) =>
              <Draggable draggableId={(e as Exercise).docId} index={idx} key={idx}>
                {(provided) => (
                  <ListGroupItem {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    {idx + 1}. {e.name}{isEditable && <span className="float-right text-danger"
                                                            onClick={() => onRemoveExercise!(idx)}>X</span>}
                  </ListGroupItem>
                )}
              </Draggable>)}
            {provided.placeholder}
          </ListGroup>
        )}
      </Droppable>
    </div>
  );
};
