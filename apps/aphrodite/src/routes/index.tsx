import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { ExerciseList } from '../pages/ExerciseList';
import { ExerciseDetail } from '../pages/ExerciseDetail';
import { ExerciseCreate } from '../pages/ExerciseCreate';
import { ExerciseEdit } from '../pages/ExerciseEdit';
import { ClientList } from '../pages/ClientList';
import { ClientDetail } from '../pages/ClientDetail';
import { ClientCreate } from '../pages/ClientCreate';
import { ClientEdit } from '../pages/ClientEdit';
import { ClientNotesPage } from '../pages/ClientNotes';
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
  {
    path: '/clients',
    element: (
      <ProtectedRoute>
        <Layout>
          <ClientList />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/clients/new',
    element: (
      <ProtectedRoute>
        <Layout>
          <ClientCreate />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/clients/:id',
    element: (
      <ProtectedRoute>
        <Layout>
          <ClientDetail />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/clients/:id/edit',
    element: (
      <ProtectedRoute>
        <Layout>
          <ClientEdit />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/clients/:id/notes',
    element: (
      <ProtectedRoute>
        <Layout>
          <ClientNotesPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
