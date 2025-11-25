import firebase from "firebase";
import moment from "moment";

export function timestampToFormattedDate( timestamp: firebase.firestore.Timestamp) {
  if (!timestamp) return null;
  return moment(new Date(timestamp.toDate())).format('MMM D, YYYY');
}

export function sortByTimestampInc( a: firebase.firestore.Timestamp, b: firebase.firestore.Timestamp){
  return a.seconds - b.seconds
}

export function sortByTimestampDec( a: firebase.firestore.Timestamp, b: firebase.firestore.Timestamp){
  return b.seconds - a.seconds
}
