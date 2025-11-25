import {Timestamp} from "tlm-common";

export interface TrainerNote {
  authorId: string;
  authorName: string;
  createdOn: Timestamp | Date;
  note: string;
  id: string;
}
