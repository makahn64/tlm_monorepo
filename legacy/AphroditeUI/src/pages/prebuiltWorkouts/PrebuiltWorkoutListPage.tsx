import React, {FC, useEffect, useState} from 'react';
import {PageContainer} from "../../components/containers/PageContainer";
import * as api from "../../services/api";
import {Dropdown, Button, DropdownButton, Table} from 'react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
import {toast} from 'react-toastify';
import {FaPlusCircle} from "react-icons/fa";
import { PrebuiltWorkout, durationFromSeconds, WorkoutVisibility } from 'tlm-common';
import {BadgesFromArray} from "../../components/badges/BadgesfromArray";
import {OKCancelModal} from "../../components/modals/OKCancelModal";
import {useAuthState} from "../../services/firebase/AuthProvider2State";
import {BsPencilSquare, BsTrashFill} from "react-icons/all";


export const PrebuiltWorkoutList: FC = () => {
  const [workouts, setWorkouts] = useState<PrebuiltWorkout[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState<PrebuiltWorkout|undefined>(undefined);
  const { isAdmin, userId } = useAuthState();

  const history = useHistory();

  useEffect(() => {
    if (userId){
      loadWorkouts();
    }
  }, [userId])

  async function loadWorkouts() {
    try {
      setLoading(true);
      const l = await api.prebuiltWorkouts.getAll() as PrebuiltWorkout[];
      const filtered = l.filter((w) => {
        return (isAdmin && w.visibility === 'TLM') || (w.authorId === userId);
      })
      setWorkouts(filtered);
    } catch (e) {
      toast(e.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = (workout: PrebuiltWorkout) => {
    setToDelete(workout);
  }

  const handleDeleteConfirmation = async () => {
    try {
      await api.prebuiltWorkouts.destroy(toDelete!);
      toast.success('Buh bye  🙋‍️');
      await loadWorkouts();
    } catch (e) {
      toast.error('Uh oh, something unforeseen happened! Nerd stuff below!');
      toast.error(e.message);
    } finally {
      setToDelete(undefined);
    }
  }

  const handleVizChange = async (workout: PrebuiltWorkout, visibility: WorkoutVisibility) => {
    try {
      await api.prebuiltWorkouts.update(workout.id!, { visibility });
      toast.success('Visibility updated 👀️');
      await loadWorkouts();
    } catch (e) {
      toast.error('Uh oh, something unforeseen happened! Nerd stuff below!');
      toast.error(e.message);
    }
  }


  //onClick={()=>history.push(`/clients/edit/${client.docId}`)}
  const buildRow = (workout: PrebuiltWorkout, idx: number) => (
    <tr key={idx}>
      <td>{workout.name}</td>
      <td><DropdownButton id="dropdown-basic-button" title={workout.visibility.toUpperCase()}>
        { isAdmin ? <Dropdown.Item onClick={()=>handleVizChange(workout, 'TLM')}>All TLM</Dropdown.Item> : null }
        <Dropdown.Item onClick={()=>handleVizChange(workout, 'shared')}>Shared</Dropdown.Item>
        <Dropdown.Item onClick={()=>handleVizChange(workout, 'private')}>Private</Dropdown.Item>
      </DropdownButton></td>
      <td><BadgesFromArray data={workout.exercises.map(e=>e.name)} variant="primary"/></td>
      <td>{durationFromSeconds(workout.duration)}</td>
      <td width="120px">
        { (isAdmin || workout.authorId === userId) ? <>
        <Button variant="primary" onClick={()=>history.push(`/workouts/edit/${workout.id}`)}><BsPencilSquare/></Button>
        <Button variant="danger" onClick={() => handleDelete(workout)} className="ml-2"><BsTrashFill/></Button>
          </> : null }
      </td>
    </tr>
  );

  return (
    <PageContainer title="Prebuilt Workouts"
                   loading={loading}>
      {/*<Form.Group>*/}
      {/*  <Form.Control type="text" placeholder="search" onChange={event => {*/}
      {/*    setSearch(event.target.value.toLowerCase())*/}
      {/*  }} value={search}/>*/}
      {/*</Form.Group>*/}
      <Link to="/workouts/edit/new"><FaPlusCircle/> Add new workout</Link>
      { workouts.length ?
        <Table striped bordered hover className="mt-3">
          <thead>
          <tr>
            <th>Name</th>
            <th>Visibility</th>
            <th>Exercises</th>
            <th>Duration</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          {workouts.map(buildRow)}
          </tbody>
        </Table> :
        <p className="text-muted font-italic mt-5">No prebuilt workouts found.</p>}
        <OKCancelModal title="Really Delete?"
                       body={`Are you sure you want to delete workout "${toDelete?.name}"`}
                       show={!!toDelete}
                       onOK={handleDeleteConfirmation}
                       okButtonVariant="danger"
                       okButtonTitle="DELETE!"
                       onCancel={() => setToDelete(undefined)} />
    </PageContainer>
  );
};
