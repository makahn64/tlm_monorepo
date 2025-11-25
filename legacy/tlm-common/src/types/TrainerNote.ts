import {Timestamp} from "./Timestamp";

export interface TrainerNote {
  authorId: string;
  authorName: string;
  createdOn: Timestamp | Date;
  note: string;
  id: string;
}
