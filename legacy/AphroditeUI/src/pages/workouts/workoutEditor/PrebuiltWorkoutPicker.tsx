import React, {FC, useEffect, useState} from 'react';
import { PrebuiltWorkout, durationFromSeconds } from 'tlm-common';
import * as api from "../../../services/api";
import {toast} from "react-toastify";
import {BadgesFromArray} from "../../../components/badges/BadgesfromArray";
import {Table} from "react-bootstrap";
import { Tabs, Tab } from 'react-bootstrap';
import {useAuthState} from "../../../services/firebase/AuthProvider2State";
import {User} from "firebase";

interface SinglePickerTableProps {
  workouts: PrebuiltWorkout[];
  onWorkoutPicked: (workout: PrebuiltWorkout) => void;
}

const WorkoutPickerTable: FC<SinglePickerTableProps> = ({ workouts, onWorkoutPicked }) => {

  const buildRow = (workout: PrebuiltWorkout, idx: number) => (
    <tr key={idx} onClick={()=>onWorkoutPicked(workout)}>
      <td>{workout.name}</td>
      <td>{workout.internalDescription}</td>
      <td><BadgesFromArray data={workout.exercises.map(e=>e.name)} variant="primary"/></td>
      <td>{durationFromSeconds(workout.duration)}</td>
    </tr>
  );

  return (
    <>
      { workouts.length ?
        <Table striped bordered hover className="mt-3">
          <thead>
          <tr>
            <th>Name</th>
            <th>Internal Description</th>
            <th>Exercises</th>
            <th>Duration</th>
          </tr>
          </thead>
          <tbody>
          {workouts.map(buildRow)}
          </tbody>
        </Table> :
        <p className="text-muted font-italic mt-5">No prebuilt workouts found.</p>}
    </>
  )
}

interface Props {
  onWorkoutPicked: (workout: PrebuiltWorkout) => void;
}

export const PrebuiltWorkoutPicker: FC<Props> = ({ onWorkoutPicked }) => {

  const [workouts, setWorkouts] = useState<PrebuiltWorkout[]>([]);
  const [loading, setLoading] = useState(false);
  const { userProfile  } = useAuthState();

  useEffect(() => {
    loadWorkouts();
  }, [])

  async function loadWorkouts() {
    try {
      setLoading(true);
      const l = await api.prebuiltWorkouts.getAll();
      setWorkouts(l as PrebuiltWorkout[]);
    } catch (e) {
      toast(e.message);
    } finally {
      setLoading(false);
    }
  }

  const workoutsForAll = workouts.filter( (w: PrebuiltWorkout) => w.visibility === 'TLM');
  const workoutsShared = workouts.filter( (w: PrebuiltWorkout) => w.visibility === 'shared');
  const myWorkouts = workouts.filter( (w: PrebuiltWorkout) => ( w.authorId === userProfile?.uid));

  return (
    <div className="mt-4">
      <Tabs defaultActiveKey="TLM" variant="pills">
        <Tab eventKey="TLM" title="From Caitlin">
          <WorkoutPickerTable workouts={workoutsForAll} onWorkoutPicked={onWorkoutPicked} />
        </Tab>
        <Tab eventKey="private" title="My Workouts">
          <WorkoutPickerTable workouts={myWorkouts} onWorkoutPicked={onWorkoutPicked} />
        </Tab>
        <Tab eventKey="shared" title="Shared">
          <WorkoutPickerTable workouts={workoutsShared} onWorkoutPicked={onWorkoutPicked} />
        </Tab>
      </Tabs>
    </div>
  );
};
