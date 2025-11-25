import {useEffect, useState} from "react";
import * as api from "../services/api";
import {sortByTimestampDec} from "../services/api/helpers";
import firebase from "firebase";
import {BARE_CLIENT_ENTRY, Client, TrainerRecommendation, Workout, WorkoutStatus, ClientMetadata} from "tlm-common";
import {TrainerNote} from "../types/TrainerNote";

export const useClient = (id: string) => {
  const [client, setClient] = useState<Client>(BARE_CLIENT_ENTRY);
  const [loading, setLoading] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [recommendations, setRecommendations] = useState<TrainerRecommendation[]>([])
  const [notes, setNotes] = useState<TrainerNote[]>([]);
  const [ metadata, setMetadata ] = useState<ClientMetadata>();

  async function load() {
    setLoading(true);
    const c = await api.clients.getClient(id) as Client;
    setClient(c);
    const w = await api.clients.getAllWorkouts(id);
    const sw = w.sort((a, b) => {
      return sortByTimestampDec(a.createdAt as firebase.firestore.Timestamp, b.createdAt as firebase.firestore.Timestamp)
    });
    setWorkouts(sw);
    const r = await api.clients.getAllRecommendations(id);
    setRecommendations(r);
    const n = await api.clients.getAllNotes(id);
    setNotes(n);
    const md = await api.clients.getClientMetadata(id);
    setMetadata(md);
    setLoading(false);
  }

  useEffect(() => {
    if (id && id !== 'new') {
      load();
    }
  }, [id]);

  const addOrUpdateWorkout = async (workout: Workout) => {
    if (workout.id) {
      return api.clients.updateClientWorkout(id, workout);
    }
    return api.clients.addWorkoutToClient(id, workout);
  }

  const addNote = async (id: string, note: string) => {
    return api.clients.addNoteToClient(id, note);
  }

  const unstartedWorkouts = workouts.filter(w => w.progress?.status === WorkoutStatus.notStarted);
  const finishedWorkouts = workouts.filter(w => w.progress?.status === WorkoutStatus.complete);
  const inProgressWorkouts = workouts.filter(w => w.progress?.status === WorkoutStatus.inProgress);

  return {
    client, loading, setClient, reload: load, addOrUpdateWorkout,
    workouts, unstartedWorkouts, finishedWorkouts, inProgressWorkouts,
    recommendations, notes, addNote, metadata
  }
}
