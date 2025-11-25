import React, {FC, useState} from 'react';
import {PageContainer} from "../../components/containers/PageContainer";
import {useHistory, useParams} from "react-router-dom";
import {useClient} from "../../hooks/useClient";
import {SingleWorkoutTable} from "../../components/tables/WorkoutTable";
import {Button, Modal, Tab, Tabs} from "react-bootstrap";
import * as api from "../../services/api";
import {toast} from "react-toastify";
import {ClientActionMenu} from "../../components/ActionMenus/ClientActionMenu";

export const ClientWorkoutHistoryPage: FC = () => {

  const {id} = useParams<{ id: string }>();
  const {client, loading, unstartedWorkouts, inProgressWorkouts, finishedWorkouts, reload} = useClient(id);
  const [workoutToDelete, setWorkoutToDelete] = useState<string | undefined>();
  const history = useHistory();

  const handleDelete = async (workoutId: string) => {
    setWorkoutToDelete(workoutId);
  }

  const handleEdit = (workoutId: string) => {
    history.push(`/clients/addworkout/${client.uid}/${workoutId}`);
  }

  const handleClone = async (workoutId: string) => {
    try {
      const workout = await api.clients.getWorkout(id, workoutId);
      const clone = {...workout, createdAt: { seconds: new Date().getTime()/1000, nanoseconds: 0}, cloned: true}
      localStorage.setItem(`workout::${client.uid}`, JSON.stringify(clone));
      history.push(`/clients/addworkout/${client.uid}/new`);
    } catch (e) {
      toast.error('Problem cloning workout. Something went wrong with DNA sequencing.');
      toast.error(e.message);
    }
  }

  const confirmDelete = async (confirmed: boolean) => {
    if (confirmed) {
      await api.clients.deleteWorkout(id, workoutToDelete!);
      await reload();
      setWorkoutToDelete(undefined);
    } else {
      setWorkoutToDelete(undefined)
    }
  }

  return (
    <PageContainer title={`Workout History for ${client.firstName} ${client.lastName}`} loading={loading}
                   rightSide = {<ClientActionMenu clientId={client.uid}/>}>
      <Tabs defaultActiveKey="notstarted" id="uncontrolled-tab-example">
        <Tab eventKey="notstarted" title="New Workouts, Not Started">
          <div className="floatingcard">
            <h4 className="mt-3 mb-5">New Workouts</h4>
            {unstartedWorkouts.length ? unstartedWorkouts.map((w, idx) =>
                <SingleWorkoutTable workout={w} key={idx}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                    onClone={handleClone}/>) :
              <p className="text-muted">There are no new workouts.</p>}
          </div>
        </Tab>
        <Tab eventKey="inprogress" title="In Progress Workouts">
          <div className="floatingcard">
            <h4 className="mt-3 mb-5">In Progress Workouts</h4>
            {inProgressWorkouts.length ? inProgressWorkouts.map((w, idx) => <SingleWorkoutTable workout={w}
                                                                                                key={idx}/>) :
              <p className="text-muted">There are no in progress workouts.</p>}
          </div>
        </Tab>
        <Tab eventKey="completed" title="Completed Workouts">
          <div className="floatingcard">
            <h3 className="mt-3 mb-5">Finished Workouts</h3>
            {finishedWorkouts.length ?
              finishedWorkouts.map((w, idx) => <SingleWorkoutTable workout={w} key={idx}/>) :
              <p className="text-muted">There are no in finished workouts.</p>
            }
          </div>
        </Tab>
      </Tabs>
      <Modal show={workoutToDelete} onHide={() => setWorkoutToDelete(undefined)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to delete workout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => confirmDelete(false)}>
            No thanks!
          </Button>
          <Button variant="danger" onClick={() => confirmDelete(true)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </PageContainer>

  );
};
