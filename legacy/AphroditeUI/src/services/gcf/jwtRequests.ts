import * as request from 'superagent';
import {Session} from '../firebase/AuthProvider2State';

export const jwtRequest = {
  post: (url: string) => request.post(url).auth(Session.jwt || '', {type: 'bearer'}),
  put: (url: string) => request.put(url).auth(Session.jwt || '', {type: 'bearer'}),
  patch: (url: string) => request.patch(url).auth(Session.jwt || '', {type: 'bearer'}),
  delete: (url: string) => request.delete(url).auth(Session.jwt || '', {type: 'bearer'}),
  get: (url: string) => request.get(url).auth(Session.jwt || '', {type: 'bearer'}),
}
