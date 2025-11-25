export interface FirelineModel<T> {
  collectionName: string;
  withoutTimestamps: boolean;
  data: T;
}
