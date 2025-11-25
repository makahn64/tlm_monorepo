import React, {FC, useEffect, useState} from 'react';
import {PageContainer} from "../../components/containers/PageContainer";
import {useHistory, useParams} from "react-router-dom";
import * as api from "../../services/api";
import {toast} from "react-toastify";
import JSONPretty from "react-json-pretty";
import {Button, Modal} from "react-bootstrap";
import {Workout} from "tlm-common";

interface Props {
}

export const ClientWorkoutDetailPage: FC<Props> = (props) => {

  const [workout, setWorkout] = useState<Workout | null>(null);
  const {id, workoutId} = useParams<{ id: string; workoutId: string }>();
  const [loading, setLoading] = useState(false);
  const [ showModal, setShowModal ] = useState(false);
  const history = useHistory();

  useEffect(() => {

    async function load() {
      try {
        setLoading(true);
        const w = await api.clients.getWorkout(id, workoutId);
        setWorkout(w);
      } catch (e) {
        toast(e.message, {type: toast.TYPE.ERROR});
      } finally {
        setLoading(false);
      }
    }

    load();

  }, []);

  const handleDelete = async () => {
    setShowModal(true);
  }

  const confirmDelete = async (confirmed: boolean) => {
    setShowModal(false);
    if (confirmed) {
      await api.clients.deleteWorkout(id, workoutId);
      history.goBack();
    }
  }

  return (
    <PageContainer title="Workout Details" loading={loading}>
      <Button onClick={handleDelete} variant="danger">DELETE</Button>
      <JSONPretty json={workout}/>
      <Modal show={showModal} onHide={()=>confirmDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to delete workout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>confirmDelete(false)}>
            Hell NO!
          </Button>
          <Button variant="danger" onClick={()=>confirmDelete(true)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </PageContainer>);
};
