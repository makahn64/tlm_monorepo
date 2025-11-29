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
    if (seconds === 0) return '??:??';
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getIntensityColor = (intensity: number): 'default' | 'success' | 'warning' | 'danger' => {
    if (intensity <= 3) return 'success';
    if (intensity <= 6) return 'warning';
    return 'danger';
  };

  const getMediaUrl = (mediaRef: any): string | undefined => {
    return mediaRef?.url || mediaRef?.mediaLink;
  };

  const getRowBackgroundColor = (exercise: Exercise): string => {
    const completePre = getMediaUrl(exercise.prenatalThumb) && getMediaUrl(exercise.prenatalVideo);
    const completePost = getMediaUrl(exercise.postnatalThumb) && getMediaUrl(exercise.postnatalVideo);
    
    if (completePre && completePost) {
      return 'transparent';
    } else if (completePre) {
      return '#d4bdfa'; // Purple tint
    } else if (completePost) {
      return '#bde9fa'; // Blue tint
    } else {
      return '#ff8b8b'; // Red tint
    }
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
                      <TableHead>Thumb</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Movement Pattern</TableHead>
                      <TableHead>Intensity</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exercises.map((exercise) => (
                      <TableRow 
                        key={exercise.docId}
                        style={{ backgroundColor: getRowBackgroundColor(exercise) }}
                      >
                        <TableCell>
                          <div className="flex flex-col items-center gap-1">
                            {getMediaUrl(exercise.prenatalThumb) ? (
                              <img 
                                src={getMediaUrl(exercise.prenatalThumb)} 
                                alt={exercise.name}
                                className="w-24 h-16 object-cover rounded"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<div class="w-24 h-16 bg-yellow-100 rounded flex items-center justify-center text-xs text-gray-600">Access blocked</div>';
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                                No image
                              </div>
                            )}
                            <div className="text-xs text-gray-600">{formatDuration(exercise.duration)}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link
                            to={`/exercises/${exercise.docId}`}
                            className="text-blue-600 hover:underline"
                          >
                            {exercise.title}
                          </Link>
                        </TableCell>
                        <TableCell>{exercise.movementPattern}</TableCell>
                        <TableCell>
                          <Badge variant={getIntensityColor(exercise.intensity)}>
                            {exercise.intensity}/10
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2 text-xs">
                            {exercise.stress && exercise.stress.length > 0 && (
                              <div>
                                <span className="font-semibold text-gray-700">Stress: </span>
                                <span className="text-gray-600">{exercise.stress.join(', ')}</span>
                              </div>
                            )}
                            {exercise.activates && exercise.activates.length > 0 && (
                              <div>
                                <span className="font-semibold text-gray-700">Activates: </span>
                                <span className="text-gray-600">{exercise.activates.join(', ')}</span>
                              </div>
                            )}
                            {exercise.releases && exercise.releases.length > 0 && (
                              <div>
                                <span className="font-semibold text-gray-700">Releases: </span>
                                <span className="text-gray-600">{exercise.releases.join(', ')}</span>
                              </div>
                            )}
                            {exercise.equipment && exercise.equipment.length > 0 && (
                              <div>
                                <span className="font-semibold text-gray-700">Equipment: </span>
                                <span className="text-gray-600">{exercise.equipment.join(', ')}</span>
                              </div>
                            )}
                            {exercise.optionalEquipment && exercise.optionalEquipment.length > 0 && (
                              <div>
                                <span className="font-semibold text-gray-700">Optional: </span>
                                <span className="text-gray-600">{exercise.optionalEquipment.join(', ')}</span>
                              </div>
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
