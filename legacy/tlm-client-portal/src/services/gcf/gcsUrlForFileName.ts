const BUCKET_HOST = 'https://storage.googleapis.com';

export const gcsUrlForFileName = (fileName: string, bucket: string = 'thelotusmethod-phase2') =>
  `${BUCKET_HOST}/${bucket}/${fileName}`;
