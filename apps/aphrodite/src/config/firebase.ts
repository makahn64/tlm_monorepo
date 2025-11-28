export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export type Environment = 'development' | 'staging' | 'production';

const configs: Record<Environment, FirebaseConfig> = {
  development: {
    apiKey: 'AIzaSyBgB33jS84ih_PLTQ8IlOB15DrenSE2Ijk',
    authDomain: 'tlm-2021-dev.firebaseapp.com',
    projectId: 'tlm-2021-dev',
    storageBucket: 'tlm-2021-dev.firebasestorage.app',
    messagingSenderId: '534651940421',
    appId: '1:534651940421:web:6ddd73f4c672c95f123d2c',
    measurementId: 'G-3TK6HEFQH9',
  },
  staging: {
    apiKey: 'AIzaSyDAAIapbpgzZCOzeV8RqzK_M6GGhXVw4DY',
    authDomain: 'tlm-2021-staging.firebaseapp.com',
    projectId: 'tlm-2021-staging',
    storageBucket: 'tlm-2021-staging.firebasestorage.app',
    messagingSenderId: '656007760153',
    appId: '1:656007760153:web:24c640fc71177023839d88',
    measurementId: 'G-6QPDV1TJZ6',
  },
  production: {
    apiKey: 'AIzaSyAuuBl-Jr9Mnl7musBEQioGvFxyINEQqao',
    authDomain: 'tlm-2021-prod.firebaseapp.com',
    projectId: 'tlm-2021-prod',
    storageBucket: 'tlm-2021-prod.firebasestorage.app',
    messagingSenderId: '912538675721',
    appId: '1:912538675721:web:a62bf55af371536c78a6d8',
    measurementId: 'G-D3RE19STZ1',
  },
};

const getEnvironment = (): Environment => {
  const env = import.meta.env.VITE_ENVIRONMENT as Environment | undefined;

  if (env && (env === 'development' || env === 'staging' || env === 'production')) {
    return env;
  }

  // Default to development if not specified
  return 'development';
};

export const currentEnvironment = getEnvironment();
export const firebaseConfig = configs[currentEnvironment];
