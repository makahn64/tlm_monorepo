import {firestore} from "../../firebase/firebaseCore";
import {Media} from 'tlm-common';

const mediaCollection = firestore.collection('media');

export async function getAllMedia() {
  const exQuerySnapshot = await mediaCollection.get();
  return exQuerySnapshot.docs.map(d => ({...d.data(), id: d.id }));
}

export async function getMedia(docId: string) {
  const doc = await mediaCollection.doc(docId).get();
  return {...doc.data(), id: doc.data()?.id };
}

export async function createNewMedia( media: Partial<Media> ){
  const newDoc = await mediaCollection.add(media);
  return newDoc.id;
}

export async function modifyFields( id: string, newFields: Partial<Media>){
  delete newFields.id;
  return mediaCollection.doc(id).update(newFields);
}

export async function deleteMedia( id: string ){
  return mediaCollection.doc(id).delete();
}
