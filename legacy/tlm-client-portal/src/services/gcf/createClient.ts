import * as request from 'superagent';
import { GCF_URL_BASE } from "./gcfCommon";

export interface ClientCreateParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export async function createClient(params: ClientCreateParams){
  const { firstName, lastName, email, password } = params;
  return request.post(`${GCF_URL_BASE}/createNewClient`).send({ firstName, lastName, email, password });
}
