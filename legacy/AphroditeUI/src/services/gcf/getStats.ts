import {GCF_URL_BASE} from "./gcfCommon";
import {jwtRequest} from "./jwtRequests";

export async function getStats() {
  return jwtRequest.get(`${GCF_URL_BASE}/stats`).then(r => r.body);
}

export type ClientsByStageStats = {
  "firstTrimester": number;
  "secondTrimester": number;
  "thirdTrimester": number;
  "recentPostPartum": number;
  "postPartum": number;
  "totalCount": number;
  "unknown": number;
}

export type ClientsByTypeStats = {
  active: number;
  "paused": number;
  "pastDue": number;
  "lead": number;
  "archived": number;
  "unknown": number;
  "totalCount": number;
}

export interface Stats {
  clientsByStage: ClientsByStageStats;
  clientsByType: ClientsByTypeStats;
}
