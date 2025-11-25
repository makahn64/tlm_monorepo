import firebase from "firebase";
import moment from "moment";

export function timestampToFormattedDate( timestamp: firebase.firestore.Timestamp | string) {
  if (!timestamp) return null;
  if (typeof timestamp === 'string'){
    return moment(new Date(timestamp)).format('MMM D, YYYY');
  } else if (timestamp.seconds) {
    return moment(new Date(timestamp.seconds * 1000)).format('MMM D, YYYY');
  } else { return '???'}
}

export function sortByTimestampInc( a: firebase.firestore.Timestamp, b: firebase.firestore.Timestamp){
  return a.seconds - b.seconds
}

export function sortByTimestampDec( a: firebase.firestore.Timestamp | string, b: firebase.firestore.Timestamp | string){
  return timestampFromAnything(b).seconds - timestampFromAnything(a).seconds;
}

export const timestampFromAnything = ( d: Date | firebase.firestore.Timestamp | string | object) => {
  if (d instanceof firebase.firestore.Timestamp) {
    return d;
  }
  if (d && d.hasOwnProperty('seconds') && d.hasOwnProperty('nanoseconds')) {
    // we have a timestamp without it's methods. WHY?!
    console.log(`Seriousy, WTF. A timestamp without it's methods.`)
    const corerced = d as firebase.firestore.Timestamp;
    return new firebase.firestore.Timestamp(corerced.seconds, corerced.nanoseconds);
  }
  // Date
  if (d instanceof Date){
    return new firebase.firestore.Timestamp(d.getTime()/1000, 0);
  }
  // instanceof won't work on prims
  if (typeof d === 'string') {
    return new firebase.firestore.Timestamp(new Date(d).getTime()/1000,0);
  }
  throw new Error('bad date type in converter');
}
