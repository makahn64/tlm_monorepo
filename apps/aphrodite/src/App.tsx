import { currentEnvironment } from './config/firebase';

export const App = () => {
  return (
    <div>
      <h1>Aphrodite - The Lotus Method</h1>
      <p>Admin and Trainer Portal</p>
      <p style={{ fontSize: '12px', color: '#666' }}>Environment: {currentEnvironment}</p>
    </div>
  );
};
