import { GCF_URL_BASE, GCF_LOCAL_BASE } from "./gcfCommon";
import { jwtRequest } from "./jwtRequests";

export async function deleteClient(uid: string){
  return jwtRequest.delete(`${GCF_URL_BASE}/client/${uid}`);
}

