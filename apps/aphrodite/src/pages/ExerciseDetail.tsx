import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { getExerciseById, archiveExercise, unarchiveExercise } from '@lotus/api-client';
import type { Exercise } from '@lotus/shared-types';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const ExerciseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    const fetchExercise = async () => {
      if (!id) {
        setError(new Error('Exercise ID is required'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getExerciseById(db, id);
        setExercise(data);
      } catch (err) {
        console.error('Error fetching exercise:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  const handleArchiveToggle = async () => {
    if (!exercise || !id) return;

    try {
      setArchiving(true);
      if (exercise.archived) {
        const updated = await unarchiveExercise(db, id);
        setExercise(updated);
      } else {
        const updated = await archiveExercise(db, id);
        setExercise(updated);
      }
    } catch (err) {
      console.error('Error toggling archive status:', err);
      alert(`Failed to ${exercise.archived ? 'unarchive' : 'archive'} exercise`);
    } finally {
      setArchiving(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
    }
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  };

  const renderVideoReference = (title: string, mediaRef: { url?: string; path?: string }) => {
    if (!mediaRef.url && !mediaRef.path) {
      return null;
    }

    return (
      <div className="space-y-2">
        <h4 className="font-medium text-gray-700">{title}</h4>
        {mediaRef.url && (
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <video
              src={mediaRef.url}
              controls
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        {mediaRef.path && !mediaRef.url && (
          <p className="text-sm text-gray-500">Path: {mediaRef.path}</p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading exercise...</div>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-red-600">
            <p className="font-semibold">Error loading exercise</p>
            <p className="text-sm">{error?.message || 'Exercise not found'}</p>
            <Button onClick={() => navigate('/exercises')} className="mt-4">
              Back to Exercises
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link to="/exercises" className="text-blue-600 hover:underline text-sm">
              ← Back to Exercises
            </Link>
          </div>
          <h1 className="text-3xl font-bold">{exercise.name}</h1>
          <p className="text-gray-500 mt-1">{exercise.title}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/exercises/${id}/edit`}>
            <Button>Edit Exercise</Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleArchiveToggle}
            disabled={archiving}
            isLoading={archiving}
          >
            {exercise.archived ? 'Unarchive' : 'Archive'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{exercise.description || 'No description provided'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Video References</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderVideoReference('Prenatal Video', exercise.prenatalVideo)}
              {renderVideoReference('Postnatal Video', exercise.postnatalVideo)}
              {renderVideoReference('Instruction Video', exercise.instructionVideo)}
              {!exercise.prenatalVideo.url &&
                !exercise.postnatalVideo.url &&
                !exercise.instructionVideo.url && (
                  <p className="text-gray-500 text-sm">No video references available</p>
                )}
            </CardContent>
          </Card>

          {exercise.cues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Cues</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1">
                  {exercise.cues.map((cue, index) => (
                    <li key={index} className="text-gray-700">
                      {cue}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="mt-1">
                  {exercise.archived ? (
                    <Badge variant="default">Archived</Badge>
                  ) : exercise.published ? (
                    <Badge variant="success">Published</Badge>
                  ) : (
                    <Badge variant="warning">Draft</Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Movement Pattern</p>
                <p className="mt-1 text-gray-900">{exercise.movementPattern}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Intensity</p>
                <p className="mt-1 text-gray-900">{exercise.intensity} / 10</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <p className="mt-1 text-gray-900">{formatDuration(exercise.duration)}</p>
              </div>

              {exercise.equipment.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Equipment</p>
                  <div className="flex flex-wrap gap-1">
                    {exercise.equipment.map((equip) => (
                      <Badge key={equip} variant="secondary">
                        {equip}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {exercise.optionalEquipment.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Optional Equipment</p>
                  <div className="flex flex-wrap gap-1">
                    {exercise.optionalEquipment.map((equip) => (
                      <Badge key={equip} variant="default">
                        {equip}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {exercise.stress.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Stress</p>
                  <div className="flex flex-wrap gap-1">
                    {exercise.stress.map((item) => (
                      <Badge key={item} variant="danger">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {exercise.releases.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Releases</p>
                  <div className="flex flex-wrap gap-1">
                    {exercise.releases.map((item) => (
                      <Badge key={item} variant="success">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {exercise.activates.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Activates</p>
                  <div className="flex flex-wrap gap-1">
                    {exercise.activates.map((item) => (
                      <Badge key={item} variant="warning">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {exercise.isBreak && (
                <div>
                  <Badge variant="secondary">Break Exercise</Badge>
                </div>
              )}

              {exercise.isCustom && (
                <div>
                  <Badge variant="secondary">Custom Exercise</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-gray-500">Created</p>
                <p className="text-gray-900">{exercise.createdAt.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="text-gray-900">{exercise.updatedAt.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Document ID</p>
                <p className="text-gray-900 font-mono text-xs break-all">{exercise.docId}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
