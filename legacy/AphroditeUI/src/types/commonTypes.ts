import firebase from "firebase";

export type Nullable<T> = T | undefined | null;
export type ValueDescription = { value: string, description: string };
export type LabelFieldName = { label: string; fieldName: string};
export type BooleanCheckboxGroupEntry = { label: string, fieldName: string, value: boolean};
export type Timestamp = firebase.firestore.Timestamp;

export type NameAndEmail = {
  lastName: string;
  firstName: string;
  email: string;
}
