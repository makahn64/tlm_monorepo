/*********************************
 File:       firebaseUpstreamMessages.ts
 Function:   Upstream Messages
 Copyright:  Bertco LLC
 Date:       9/26/20
 Author:     mkahn
 **********************************/

import {firestore} from "../../firebase/firebaseCore";
import { UpstreamMessage } from "tlm-common";

const upMessageCollection = firestore.collection('upstreamMessages');

export async function getAllMessages(): Promise<UpstreamMessage[]> {
  const exQuerySnapshot = await upMessageCollection
    .orderBy('date')
    .get();
  return exQuerySnapshot.docs.map(d => ({...d.data(), docId: d.id })) as UpstreamMessage[];
}

// todo archived must exist to query on, so this needs fixed on lucy
export async function getAllNonArchivedMessagesX(): Promise<UpstreamMessage[]> {
  const exQuerySnapshot = await upMessageCollection
    .where("archived", "!=", true)
    .orderBy('archived')
    .orderBy('date')
    .get();
  return exQuerySnapshot.docs.map(d => ({...d.data(), docId: d.id })) as UpstreamMessage[];
}

export async function getAllNonArchivedMessages(): Promise<UpstreamMessage[]> {
  const ums = await getAllMessages();
  return ums.filter((m) => !m.archived);
}

export async function getMessage(docId: string): Promise<UpstreamMessage> {
  const doc = await upMessageCollection.doc(docId).get();
  return {...doc.data(), docId: doc.data()?.id } as UpstreamMessage;
}

export async function archiveMessage(docId: string) {
  return upMessageCollection.doc(docId).update({ archived: true });
}
