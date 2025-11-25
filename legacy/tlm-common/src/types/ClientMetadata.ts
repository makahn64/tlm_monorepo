// extra data about a Client that we don't want attached directly to the Client object for privacy, security
// Is this even used?

import {Timestamp} from "./Timestamp";

export interface ClientBackgroundInfo {
  notes: string;
  // add these down the line
  authorId?: string;
  authorName?: string;
  createdOn?: Timestamp | Date;
}

export interface ClientMetadata {
  clientBackgroundInfo?: ClientBackgroundInfo;
}
