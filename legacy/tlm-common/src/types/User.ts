// users a portal users
import {NameAndEmail} from "./NameAndEmail";

export interface User extends NameAndEmail {
  uid: string;
  isAdmin: boolean;
  isTrainer: boolean;
  clients: string[];
}
