import { GCF_URL_BASE, GCF_LOCAL_BASE } from "./gcfCommon";
import { jwtRequest } from "./jwtRequests";

export interface UserCreateParams {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  isTrainer: boolean;
}
export async function createPortalUser(params: UserCreateParams){
  return jwtRequest.post(`${GCF_URL_BASE}/team`).send(params);
}
