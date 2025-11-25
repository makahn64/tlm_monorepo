import {firestore, auth} from "../../firebase/firebaseCore";
import { Lead } from "../../../types/Lead";

const tidy = (obj: { [k:string]: any }) => {
  return Object.keys(obj).forEach(key => {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  });
}

const leadsCollection = firestore.collection('leads');

export async function getAllLeads() {
  const querySnapshot = await leadsCollection.get();
  const unclean = querySnapshot.docs.map(d => ({...d.data(), id: d.id})) as Lead[];
  const clean = unclean.map( (l) => {
    const date = l.createdOn ? new Date(l.createdOn) : new Date();
    return {...l, createdOn: date }
  })
  return clean;
};

export async function getLead(id: string) {
  const doc = await leadsCollection.doc(id).get();
  return {id, ...doc.data()} as Lead;
};

export async function update(id: string, changes: Partial<Lead>) {
  return leadsCollection.doc(id).update(changes);
};



