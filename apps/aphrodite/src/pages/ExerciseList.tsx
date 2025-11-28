import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExercises } from '../hooks/useExercises';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import type { Exercise } from '@lotus/shared-types';

export const ExerciseList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movementPatternFilter, setMovementPatternFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const { exercises, loading, error } = useExercises({
    searchTerm,
    movementPattern: movementPatternFilter || undefined,
    equipment: equipmentFilter || undefined,
    archived: showArchived,
  });

  // Get unique movement patterns and equipment for filters
  const movementPatterns = Array.from(
    new Set(exercises.map((ex) => ex.movementPattern).filter(Boolean))
  ).sort();

  const equipmentOptions = Array.from(
    new Set(exercises.flatMap((ex) => ex.equipment).filter(Boolean))
  ).sort();

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  };

  const getIntensityColor = (intensity: number): 'default' | 'success' | 'warning' | 'danger' => {
    if (intensity <= 3) return 'success';
    if (intensity <= 6) return 'warning';
    return 'danger';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exercises</h1>
          <p className="text-gray-500 mt-1">Manage your exercise library</p>
        </div>
        <Link to="/exercises/new">
          <Button>Create Exercise</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <Input
                id="search"
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="movementPattern"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Movement Pattern
              </label>
              <select
                id="movementPattern"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={movementPatternFilter}
                onChange={(e) => setMovementPatternFilter(e.target.value)}
              >
                <option value="">All Patterns</option>
                {movementPatterns.map((pattern) => (
                  <option key={pattern} value={pattern}>
                    {pattern}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="equipment" className="block text-sm font-medium text-gray-700 mb-1">
                Equipment
              </label>
              <select
                id="equipment"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={equipmentFilter}
                onChange={(e) => setEquipmentFilter(e.target.value)}
              >
                <option value="">All Equipment</option>
                {equipmentOptions.map((equip) => (
                  <option key={equip} value={equip}>
                    {equip}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Show Archived</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-600">
              <p className="font-semibold">Error loading exercises</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading exercises...</div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            {exercises.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No exercises found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-500">
                  Showing {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Movement Pattern</TableHead>
                      <TableHead>Intensity</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exercises.map((exercise) => (
                      <TableRow key={exercise.docId}>
                        <TableCell className="font-medium">
                          <Link
                            to={`/exercises/${exercise.docId}`}
                            className="text-blue-600 hover:underline"
                          >
                            {exercise.name}
                          </Link>
                        </TableCell>
                        <TableCell>{exercise.movementPattern}</TableCell>
                        <TableCell>
                          <Badge variant={getIntensityColor(exercise.intensity)}>
                            {exercise.intensity}/10
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDuration(exercise.duration)}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {exercise.equipment.slice(0, 2).map((equip) => (
                              <Badge key={equip} variant="secondary">
                                {equip}
                              </Badge>
                            ))}
                            {exercise.equipment.length > 2 && (
                              <Badge variant="default">+{exercise.equipment.length - 2}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {exercise.archived ? (
                            <Badge variant="default">Archived</Badge>
                          ) : exercise.published ? (
                            <Badge variant="success">Published</Badge>
                          ) : (
                            <Badge variant="warning">Draft</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={`/exercises/${exercise.docId}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
