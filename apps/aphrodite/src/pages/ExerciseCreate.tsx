import { Link } from 'react-router-dom';
import { ExerciseForm } from '../components/ExerciseForm';

export const ExerciseCreate = () => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link to="/exercises" className="text-blue-600 hover:underline text-sm">
            ← Back to Exercises
          </Link>
        </div>
        <h1 className="text-3xl font-bold">Create Exercise</h1>
        <p className="text-gray-500 mt-1">Add a new exercise to the library</p>
      </div>

      <ExerciseForm mode="create" />
    </div>
  );
};
