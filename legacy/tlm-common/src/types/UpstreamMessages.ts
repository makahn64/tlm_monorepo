import {Timestamp} from "./Timestamp";

export interface UpstreamMessage {
  date: Timestamp;
  from: {
    email: string;
    name: string;
    uid: string;
  };
  message: string;
  archived?: boolean;
  docId: string;
}
