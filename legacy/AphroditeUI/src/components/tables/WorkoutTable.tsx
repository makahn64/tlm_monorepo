import React, {FC} from 'react';
import {Timestamp, Workout} from 'tlm-common';
import {Button, Dropdown, Table} from "react-bootstrap";
import {BadgesFromArray} from "../badges/BadgesfromArray";
import {timestampToFormattedDate} from "../../services/api/helpers";
import {THEME_COLORS} from "../../assets/styles/themecolors";
import {useHistory} from 'react-router-dom';
import {BsFillTrashFill} from "react-icons/all";
import JSONPretty from "react-json-pretty";

interface Props {
  workouts: Workout[];
  onDelete?: (workoutId: string) => void;
}

export const WorkoutTable: FC<Props> = ({workouts, onDelete}) => {

  return (
    <Table striped responsive>
      <thead>
      <th>Date</th>
      <th>By</th>
      <th>Exercises</th>
      <th>Notes to Client</th>
      <th>TLM Notes</th>
      {onDelete ? <th/> : null}
      </thead>
      <tbody>
      {workouts.map(w => <tr>
          <td width={'10%'}>{timestampToFormattedDate(w.createdAt as Timestamp)}</td>
          <td width={'10%'}>{w.createdBy}</td>
          <td width={'30%'}><BadgesFromArray data={w.exercises.map(e => e.name)}/></td>
          <td>{w.clientNotes}</td>
          <td>{w.internalNotes}</td>
          {onDelete ? <td><Button onClick={() => onDelete(w.id!)} variant="danger" size="sm"><BsFillTrashFill/></Button>
          </td> : null}
        </tr>
      )}
      </tbody>
    </Table>
  );
};

interface SingleWorkoutTableProps {
  workout: Workout;
  onDelete?: (workoutId: string) => void;
  onEdit?: (workoutId: string) => void;
  onClone?: (workoutId: string) => void;
}

export const SingleWorkoutTable: FC<SingleWorkoutTableProps> = ({
                                                                  workout,
                                                                  onDelete,
                                                                  onEdit,
                                                                  onClone
                                                                }) => {

  //const creationDate = timestampToFormattedDate(w.createdAt as Timestamp);
  const history = useHistory();

  return (
    <>
      <div style={{width: '100%', padding: 10, backgroundColor: THEME_COLORS.purple, marginBottom: 30}}
           className="floatingcard">
        <h3 className="text-white">Workout {workout.name ? `"${workout.name}" ` : null}Created
          on: {timestampToFormattedDate(workout.createdAt as Timestamp)}
          <Dropdown className="float-right">
            <Dropdown.Toggle variant="outline-light"></Dropdown.Toggle>
            <Dropdown.Menu>
              {onEdit ? <Dropdown.Item onClick={() => onEdit(workout.id!)}>Edit</Dropdown.Item> : null}
              {onClone ? <Dropdown.Item variant="success"
                                        onClick={() => onClone(workout.id!)}>Clone</Dropdown.Item> : null}
              <Dropdown.Divider/>
              {onDelete ? <Dropdown.Item onClick={() => onDelete(workout.id!)}>
                <span className="text-danger">Delete</span>
              </Dropdown.Item> : null}
            </Dropdown.Menu>
          </Dropdown>


        </h3>
        <p className="text-white mb-0">Created by: {workout.createdBy}</p>
        {/*<p className="text-muted mb-0">Client started on: {timestampToFormattedDate(workout.startedOn as Timestamp)}</p>*/}
      </div>
      <Table striped responsive>
        <thead>
        <tr>
          <th>Exercise</th>
          <th>Notes</th>
          <th/>
        </tr>
        </thead>
        <tbody>
        {workout.exercises.map((e, idx) => <tr key={idx}>
            <td width={'10%'}>{idx + 1}</td>
            <td width={'10%'}>
              <span style={{color: e.isCustom ? THEME_COLORS.neonPink : undefined}}>{e.name}</span><br/>
              {e.isCustom ? <span className="text-muted">{e.description}</span> : null}
            </td>
            <td width={'30%'}>{e.clientNotes}</td>
          </tr>
        )}
        </tbody>
      </Table>
      <div style={{width: '100%', padding: 10, backgroundColor: '#f0f0f0', marginBottom: 30}} className="floatingcard">
        <h5>Trainer Note</h5>
        <p className="text-muted  mb-0">{workout.internalNotes || 'There are no trainer notes.'}</p>
        <h5 className="mt-2">Client Notes</h5>
        <p className="text-muted  mb-0">{workout.clientNotes || 'There are no client notes.'}</p>
        {/*<JSONPretty json={workout}/>*/}
      </div>
    </>

  );
};
