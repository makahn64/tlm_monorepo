import { useState, useEffect } from 'react';
import type { Exercise, Workout, WorkoutType } from '@lotus/shared-types';
import { db } from '../lib/firebase';
import { getPublishedExercises, searchExercisesByName } from '@lotus/api-client';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';

interface WorkoutEditorProps {
  initialExercises?: Exercise[];
  onSave: (exercises: Exercise[], workoutData: Partial<Workout>) => void;
  onCancel: () => void;
  workoutName?: string;
  workoutType?: WorkoutType;
  isLoading?: boolean;
}

export const WorkoutEditor = ({
  initialExercises = [],
  onSave,
  onCancel,
  workoutName = '',
  workoutType = 'normal',
  isLoading = false,
}: WorkoutEditorProps) => {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>(initialExercises);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [name, setName] = useState(workoutName);
  const [type, setType] = useState<WorkoutType>(workoutType);

  // Load available exercises
  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoadingExercises(true);
        const exercises = await getPublishedExercises(db);
        setAvailableExercises(exercises);
      } catch (err) {
        console.error('Error loading exercises:', err);
        setError('Failed to load exercises');
      } finally {
        setLoadingExercises(false);
      }
    };

    loadExercises();
  }, []);

  // Search exercises
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      const exercises = await getPublishedExercises(db);
      setAvailableExercises(exercises);
      return;
    }

    try {
      const results = await searchExercisesByName(db, term);
      setAvailableExercises(results);
    } catch (err) {
      console.error('Error searching exercises:', err);
    }
  };

  // Add exercise to workout
  const handleAddExercise = (exercise: Exercise) => {
    if (!selectedExercises.find((ex) => ex.docId === exercise.docId)) {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  // Remove exercise from workout
  const handleRemoveExercise = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter((ex) => ex.docId !== exerciseId));
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;

    const newExercises = [...selectedExercises];
    const draggedExercise = newExercises[draggedIndex];
    
    // Remove from old position
    newExercises.splice(draggedIndex, 1);
    
    // Insert at new position
    newExercises.splice(index, 0, draggedExercise);
    
    setSelectedExercises(newExercises);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedIndex(null);
  };

  // Calculate total duration
  const totalDuration = selectedExercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
  const totalMinutes = Math.floor(totalDuration / 60);
  const totalSeconds = totalDuration % 60;

  const handleSave = () => {
    if (selectedExercises.length === 0) {
      setError('Please add at least one exercise to the workout');
      return;
    }

    onSave(selectedExercises, {
      name: name || undefined,
      workoutType: type,
      duration: totalDuration * 1000, // Convert to milliseconds
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-600">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Workout Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="workoutName" className="block text-sm font-medium text-gray-700 mb-1">
              Workout Name (Optional)
            </label>
            <Input
              id="workoutName"
              type="text"
              placeholder="e.g., Morning Routine"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="workoutType" className="block text-sm font-medium text-gray-700 mb-1">
              Workout Type
            </label>
            <select
              id="workoutType"
              value={type}
              onChange={(e) => setType(e.target.value as WorkoutType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="normal">Normal</option>
              <option value="mobility">Mobility</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exercise Library */}
        <Card>
          <CardHeader>
            <CardTitle>Exercise Library</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {loadingExercises ? (
              <div className="text-center py-8 text-gray-500">Loading exercises...</div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {availableExercises.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No exercises found' : 'No exercises available'}
                  </div>
                ) : (
                  availableExercises.map((exercise) => (
                    <div
                      key={exercise.docId}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{exercise.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {exercise.movementPattern}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {exercise.duration}s
                          </span>
                          <span className="text-xs text-gray-500">
                            Intensity: {exercise.intensity}/10
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddExercise(exercise)}
                        disabled={selectedExercises.some((ex) => ex.docId === exercise.docId)}
                      >
                        {selectedExercises.some((ex) => ex.docId === exercise.docId)
                          ? 'Added'
                          : 'Add'}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Exercises */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Workout Exercises</CardTitle>
              <div className="text-sm text-gray-500">
                {selectedExercises.length} exercise{selectedExercises.length !== 1 ? 's' : ''} •{' '}
                {totalMinutes}:{totalSeconds.toString().padStart(2, '0')}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedExercises.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No exercises added yet</p>
                <p className="text-sm mt-1">Add exercises from the library to build your workout</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {selectedExercises.map((exercise, index) => (
                  <div
                    key={`${exercise.docId}-${index}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    onDrop={handleDrop}
                    className={`flex items-center gap-3 p-3 border border-gray-200 rounded-md cursor-move hover:bg-gray-50 ${
                      draggedIndex === index ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded text-sm font-medium text-gray-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{exercise.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {exercise.movementPattern}
                        </Badge>
                        <span className="text-xs text-gray-500">{exercise.duration}s</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveExercise(exercise.docId)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          isLoading={isLoading}
          disabled={isLoading || selectedExercises.length === 0}
        >
          Save Workout
        </Button>
      </div>
    </div>
  );
};
