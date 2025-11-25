import {Timestamp} from "./Timestamp";
import {GCSFile} from "./GCSFile";

export interface RecommendedVideo {
  recommendedOn: Timestamp;
  watchedOn: Timestamp;
  recommendedBy: string;
  video: GCSFile;
}
