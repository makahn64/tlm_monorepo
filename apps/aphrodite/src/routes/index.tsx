import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { ExerciseList } from '../pages/ExerciseList';
import { ExerciseDetail } from '../pages/ExerciseDetail';
import { ExerciseCreate } from '../pages/ExerciseCreate';
import { ExerciseEdit } from '../pages/ExerciseEdit';
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
  {
    path: '/exercises',
    element: (
      <ProtectedRoute>
        <Layout>
          <ExerciseList />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/exercises/new',
    element: (
      <ProtectedRoute>
        <Layout>
          <ExerciseCreate />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/exercises/:id',
    element: (
      <ProtectedRoute>
        <Layout>
          <ExerciseDetail />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/exercises/:id/edit',
    element: (
      <ProtectedRoute>
        <Layout>
          <ExerciseEdit />
        </Layout>
      </ProtectedRoute>
    ),
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
