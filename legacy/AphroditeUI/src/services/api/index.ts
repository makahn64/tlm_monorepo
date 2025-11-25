import * as exercises from './exercises';
import * as clients from './clients';
import * as helpers from './helpers';
import * as users from './users';
import * as gcsMedia from '../gcf/gcsMedia';
import * as fbMedia from './media';
import * as leads from './leads';
import * as prebuiltWorkouts from './prebuiltWorkouts';
import { getStats } from "../gcf/getStats";

const media = {...gcsMedia, ...fbMedia};
const stats = { getStats };

export {
  exercises,
  clients,
  helpers,
  users,
  media,
  stats,
  leads,
  prebuiltWorkouts
}
