import { GCF_URL_BASE, GCF_LOCAL_BASE } from "./gcfCommon";
import { jwtRequest } from "./jwtRequests";
import { Client } from 'tlm-common';

export interface ClientCreateParams {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  mobilePhone?: number | string;
}
export async function createClient(params: ClientCreateParams){
  const { firstName, lastName, email, password, mobilePhone = '' } = params;
  const response = await jwtRequest.post(`${GCF_URL_BASE}/client`).send({ firstName, lastName, email, password, mobilePhone });
  return response.body as { uid: string };
}

