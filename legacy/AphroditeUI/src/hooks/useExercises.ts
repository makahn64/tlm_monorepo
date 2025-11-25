import {useEffect, useState} from "react";
import {Exercise} from "tlm-common";
import * as api from "../services/api";
import firebase from "firebase";

const sortByPattern = ( exA: Exercise, exB: Exercise ) => {
  if ( exA.movementPattern > exB.movementPattern ) {
    return -1;
  } else if ( exA.movementPattern < exB.movementPattern ) {
    return 1;
  }
  return 0;
}

export const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null| firebase.firestore.FirestoreError >(null);

  useEffect(() => {
    loadExercises();
  }, [])

  async function loadExercises() {
    try {
      setError(null);
      setLoading(true);
      const e = await api.exercises.getAllExercises();
      const sorted = (e as Exercise[]).sort(sortByPattern);
      setExercises(sorted);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  const movementPatterns = new Set(exercises.map(e=>e.movementPattern));
  const legitExercises = exercises.filter((e) => {
    return (e.prenatalThumb.name && e.prenatalVideo.name) || (e.postnatalThumb.name && e.postnatalVideo.name);
  })
  return { exercises, loading, error, movementPatterns, legitExercises };
}
