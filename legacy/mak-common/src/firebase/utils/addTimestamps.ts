import { Timestamp } from 'firebase/firestore';

export type Timestamped<T> = T & {
  modifiedAt: Timestamp;
  createdAt: Timestamp;
};

export type FlexRecord = Record<string, unknown>;

export function addTimestamps(obj: FlexRecord): Timestamped<FlexRecord> {
  const rval = { ...obj };
  const now = new Timestamp(new Date().getTime() / 1000, 0);
  if (!obj.createdAt) {
    rval.createdAt = now;
  }
  rval.modifiedAt = now;
  return rval as Timestamped<Record<string, unknown>>;
}
