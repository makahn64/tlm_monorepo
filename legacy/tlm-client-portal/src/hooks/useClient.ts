import {useEffect, useState} from "react";
import * as api from "../services/api";
import {Workout, WorkoutStatus, Client, BARE_CLIENT_ENTRY} from "tlm-common";
import {sortByTimestampDec} from "../services/api/helpers";
import firebase from "firebase";

export const useClient = (id: string) => {
  const [ client, setClient ] = useState<Client>(BARE_CLIENT_ENTRY);
  const [ loading, setLoading ] = useState(false);
  const [ workouts, setWorkouts ] = useState<Workout[]>([]);
  const [ unfinishedWorkouts, setUnfinishedWorkouts ] = useState<Workout[]>([]);

  async function load(){
    setLoading(true);
    const c = await api.clients.getClient(id) as Client;
    setClient(c);
    const w = await api.clients.getAllWorkouts(id);
    setWorkouts(w);
    const ufw = w.filter(w=>w.progress?.status!==WorkoutStatus.complete).sort( (a,b) => {
      return sortByTimestampDec(a.createdAt as firebase.firestore.Timestamp, b.createdAt as firebase.firestore.Timestamp);
    });
    setUnfinishedWorkouts(w);
    setLoading(false);
  }

  useEffect(()=>{
    if (id && id!=='new') {
      load();
    }
  }, [id]);

  const addWorkout = async (workout: Workout) => {
    return api.clients.addWorkoutToClient(id, workout);
  }

  return { client, loading, setClient, reload: load, addWorkout, workouts, unfinishedWorkouts }
}
