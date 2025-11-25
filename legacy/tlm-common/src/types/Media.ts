import {GCSFile} from "./GCSFile";

export interface Media {
  video: GCSFile | {};
  thumbnail: GCSFile | {};
  name: string;
  description: string;
  duration: number;
  // may replace with union
  type: string;
  metadata: Record<string, any>;
  id: string;
}
