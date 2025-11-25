import React, {FC} from 'react';
import {Table} from "react-bootstrap";
import * as api from '../../services/api';
import {BadgesFromArray} from "../../components/badges/BadgesfromArray";
import {Client, Workout} from "tlm-common";


interface Props {
  workouts: Workout[];
  client: Client;
}

export const WorkoutHistoryTable: FC<Props> = ({workouts, client}) => {

  if (workouts.length === 0) return <p>No workouts for this client</p>;

  const buildRow = (workout: Workout, idx: number) => (
    <tr key={idx}>
      <td>{api.helpers.timestampToFormattedDate(workout.createdAt as firebase.firestore.Timestamp)}</td>
      <td>{api.helpers.timestampToFormattedDate(workout.completedOn as firebase.firestore.Timestamp) || 'not done'}</td>
      <td>{workout.createdBy}</td>
      <td><BadgesFromArray data={workout.exercises.map(e => e.name)}/></td>
    </tr>
  );

  return (
    <Table striped bordered hover className="mt-3">
      <thead>
      <tr>
        <th style={{width: '15%'}}>Date Created</th>
        <th style={{width: '15%'}}>Date Completed</th>
        <th>Trainer</th>
        <th>Exercises</th>
      </tr>
      </thead>
      <tbody>
      {workouts.map(buildRow)}
      </tbody>
    </Table>
  );
};
