import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Layout } from '../components/Layout';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
