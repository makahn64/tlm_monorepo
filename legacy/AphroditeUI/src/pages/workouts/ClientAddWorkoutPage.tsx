import React, {FC, useEffect, useState} from 'react';
import {useClient} from "../../hooks/useClient";
import {useHistory, useParams} from "react-router-dom";
import {PageContainer} from "../../components/containers/PageContainer";
import {WorkoutEditor} from "./WorkoutEditor";
import {Workout} from "tlm-common";
import {ClientDetailsView} from "../clients/ClientDetailsView";
import {toast} from "react-toastify";
import {Alert} from 'react-bootstrap';
import {ClientActionMenu} from "../../components/ActionMenus/ClientActionMenu";

export const ClientAddWorkoutPage: FC = () => {
  const {clientId, workoutId} = useParams<{ clientId: string; workoutId: string }>();
  const {client, loading, addOrUpdateWorkout, workouts} = useClient(clientId);
  const history = useHistory();
  const [showFyi, setShowFyi] = useState(false);

  useEffect(() => {
    const newFeatureShown = localStorage.getItem('showFyiAssembler');
    if (!newFeatureShown) {
      setShowFyi(true);
    }
  }, [])

  const handleWorkoutSave = async (wo: Workout) => {
    try {
      await addOrUpdateWorkout(wo);
      toast.success('Sweet! Workout added.');
      history.goBack();
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <PageContainer title={`${workoutId !== 'new' ? 'Edit' : 'Add'} Workout for ${client.firstName} ${client.lastName}`}
                   loading={loading}
                   rightSide={<ClientActionMenu clientId={clientId}/>}>
      <ClientDetailsView client={client}/>
      {showFyi ?
        <Alert variant="danger" onClose={() => {
          setShowFyi(false);
          localStorage.setItem('showFyiAssembler', 'did');
        }} dismissible>
          <Alert.Heading>New Feature Alert!</Alert.Heading>
          <p>
            Check it! You can preview a workout by long clicking it now.
            And to add a workout, you need to DOUBLE click it now. Because, why not?
          </p>
        </Alert> : null}
      <WorkoutEditor client={client} onSave={handleWorkoutSave} inboundWorkoutId={workoutId}/>
    </PageContainer>
  );
};
