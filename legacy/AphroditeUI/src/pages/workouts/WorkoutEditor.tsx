import React, {FC, useEffect, useState} from 'react';
import {BARE_WORKOUT, Client, Exercise, Workout} from "tlm-common";
import {Button, Col, Container, Row} from "react-bootstrap";
import {WorkoutAssembler} from "./workoutEditor/WorkoutAssembler";
import {WorkoutNotesEditor} from "./workoutEditor/WorkoutNotesEditor";
import {useAuthState} from "../../services/firebase/AuthProvider2State";
import {toast} from "react-toastify";
import {getWorkout} from "../../services/api/clients";
import * as api from '../../services/api';

interface Props {
  client?: Client;
  inboundWorkoutId?: string;
  onSave: (workout: Workout) => void;
  prebuilt?: boolean;
}

export const WorkoutEditor: FC<Props> = ({client, inboundWorkoutId, onSave, prebuilt}) => {
  const {userProfile} = useAuthState();
  const [workout, setWorkout] = useState<Workout>({...BARE_WORKOUT, createdBy: userProfile?.displayName || 'TLM'});
  const [step, setStep] = useState(0);

  useEffect(() => {
    const notNewWorkout = inboundWorkoutId && inboundWorkoutId !== 'new';
    if (notNewWorkout && client && client.uid) {
      console.log('Editing existing workout!')
      getWorkout(client.uid, inboundWorkoutId!)
        .then(setWorkout);
    }
    if (prebuilt && notNewWorkout) {
      api.prebuiltWorkouts.getWorkout(inboundWorkoutId!)
        .then(setWorkout);
    }
    // if (inboundWorkoutId === 'cloned'  && client && client.uid ) {
    //   const cloned = SimpleState.getClonedWorkout();
    //   if (cloned) {
    //     setWorkout(cloned);
    //     SimpleState.clearClonedWorkout();
    //   }
    // }
  }, [inboundWorkoutId, client]);

  useEffect(() => {
    // no wip save for prebuilt yet
    if (!prebuilt) {
      if (client?.uid && inboundWorkoutId && inboundWorkoutId === 'new') {
        const cachedWorkout = localStorage.getItem(`workout::${client.uid}`);
        if (cachedWorkout) {
          console.log('===========cached==========');
          //console.log(cachedWorkout);
          const restored = JSON.parse(cachedWorkout);
          const {cloned} = restored;
          delete restored.cloned;
          setWorkout(restored);
          // re-save without clone flag
          localStorage.setItem(`workout::${client.uid}`, JSON.stringify(restored));
          toast.info(cloned ? 'Cloning process complete! 👯‍♀️ ' : 'In progress workout restored! 💅')
        }
      }
    }
  }, [client])

  useEffect(() => {
    if (!prebuilt) {
      if (client?.uid && workout.exercises.length) {
        localStorage.setItem(`workout::${client.uid}`, JSON.stringify(workout));
      }
    }
  }, [workout]);

  const clear = () => {
    if (client) {
      localStorage.removeItem(`workout::${client.uid}`);
    }
  }

  const handleExerciseArrayUpdate = (newExercises: Exercise[]) => {
    setWorkout({...workout, exercises: [...newExercises]});
  }

  const updateField = (field: string, value: any) => {
    console.log('Updating field ', field, ' to ', value);
    setWorkout({...workout, [field]: value});
  }

  const handleSaveWorkout = async () => {
    console.log(`Saving workout`);
    let duration = workout.exercises.reduce<number>((accum: number, e) => (accum + (e as Exercise).duration), 0);
    onSave({...workout, duration});
    clear();
  }

  const handlePrebuiltWorkoutPicked = (workout: Workout) => {
    // a little editing required
    const wo: Workout = {
      ...workout,
      createdAt: new Date(),
      createdBy: userProfile?.displayName || 'TLM',
    };
    delete wo.id;
    setWorkout(wo);
  }

  const advance = () => {
    setStep(step + 1);
  }

  const rewind = () => {
    setStep(step - 1);
  }

  if (!workout || !workout.exercises) {
    return <p>Nothing to see here</p>
  }

  return (
    <Container className="floatingcard" fluid>
      <Row>
        <Col>
          {step === 0 && <Button
            variant="primary"
            onClick={advance}
            size="sm"
            className="w-100 mb-2"
            disabled={!workout.exercises.length}
          >Save and Add Notes</Button>}
          {step === 1 &&
          <>
            <Button
              variant="primary"
              onClick={rewind}
              size="sm"
              className="w-100 mb-2"
            >Make Changes to Workout</Button>
            <Button variant="primary" onClick={handleSaveWorkout} size="sm"
                    className="w-100">{prebuilt ? 'Save' : 'Send'}</Button>
          </>}
        </Col>
      </Row>
      <Row>
        <Col>
          {step === 0 && <WorkoutAssembler
            initialExercises={workout.exercises as Exercise[]}
            onChange={handleExerciseArrayUpdate}
            workoutType={workout.workoutType}
            onWorkoutTypeChange={(woType) => updateField('workoutType', woType)}
            onPrebuiltPicked={handlePrebuiltWorkoutPicked}
          />}
          {step === 1 && <WorkoutNotesEditor workout={workout} onFieldChange={updateField} prebuilt={prebuilt}/>}
        </Col>
      </Row>
    </Container>
  );
};

