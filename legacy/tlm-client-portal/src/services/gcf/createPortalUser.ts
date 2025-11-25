import * as request from 'superagent';
import { GCF_URL_BASE } from "./gcfCommon";

export interface UserCreateParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isTrainer: boolean;
}
export async function createPortalUser(params: UserCreateParams){
  return request.post(`${GCF_URL_BASE}/createNewAphroditeAccount`).send(params);
}
