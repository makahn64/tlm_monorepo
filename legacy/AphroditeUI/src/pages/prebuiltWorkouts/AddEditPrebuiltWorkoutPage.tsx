import React, {FC} from 'react';
import {useHistory, useParams} from "react-router-dom";
import {PageContainer} from "../../components/containers/PageContainer";
import {WorkoutEditor} from "../workouts/WorkoutEditor";
import {PrebuiltWorkout, Workout} from "tlm-common";
import {toast} from "react-toastify";
import * as api from '../../services/api';
import {useAuthState} from "../../services/firebase/AuthProvider2State";

export const AddEditPrebuiltWorkoutPage: FC = () => {
  const {id} = useParams<{ id: string }>();
  const history = useHistory();
  const { userId } = useAuthState();


  const handleWorkoutSave = async (wo: Workout) => {
    try {
      const workout: PrebuiltWorkout = {...wo, visibility: (wo as PrebuiltWorkout).visibility || 'private', authorId: userId! };
      await api.prebuiltWorkouts.createOrUpdate(workout);
      toast.success('Sweet! Prebuilt workout added.');
      history.goBack();
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <PageContainer title={`${id !== 'new' ? 'Edit':'Add New'} Prebuilt Workout`}>
      <WorkoutEditor onSave={handleWorkoutSave} inboundWorkoutId={id} prebuilt={true}/>
    </PageContainer>
  );
};
