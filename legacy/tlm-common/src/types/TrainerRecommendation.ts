import {Timestamp} from "./Timestamp";
import {Media} from "./Media";

export type TrainerRecommendationType = 'video' | 'link' | 'text';

export interface TrainerRecommendation {
  createdOn: Timestamp | Date;
  createdBy: string;
  recommendationType: TrainerRecommendationType;
  media?: Media;
  body: string;
  viewedOn?: Timestamp | Date;
  id: string;
}
