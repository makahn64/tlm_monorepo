import * as request from 'superagent';
import {GCF_URL_BASE} from "./gcfCommon";
import {GCSFile} from "tlm-common";

export async function getAllGCSMedia(mimeType?: string) {
  const resp = await request.get(`${GCF_URL_BASE}/gcsMedia`);
  if (!mimeType) {
    return resp.body;
  } else {
    return (resp.body as GCSFile[]).filter(f => f.contentType.startsWith(mimeType));
  }
}
