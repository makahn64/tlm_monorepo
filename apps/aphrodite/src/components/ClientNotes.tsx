import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import {
  getNotesByClient,
  createNote,
  updateNote,
  deleteNote,
  getRecommendationsByClient,
  createRecommendation,
  deleteRecommendation,
} from '@lotus/api-client';
import type { TrainerNote, Recommendation } from '@lotus/shared-types';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';

interface ClientNotesProps {
  clientId: string;
}

export const ClientNotes = ({ clientId }: ClientNotesProps) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<TrainerNote[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Note form state
  const [noteContent, setNoteContent] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  // Edit note state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteContent, setEditNoteContent] = useState('');

  // Recommendation form state
  const [showRecForm, setShowRecForm] = useState(false);
  const [recTitle, setRecTitle] = useState('');
  const [recDescription, setRecDescription] = useState('');
  const [submittingRec, setSubmittingRec] = useState(false);

  useEffect(() => {
    fetchData();
  }, [clientId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [notesData, recsData] = await Promise.all([
        getNotesByClient(db, clientId),
        getRecommendationsByClient(db, clientId),
      ]);
      setNotes(notesData);
      setRecommendations(recsData);
    } catch (err) {
      console.error('Error fetching notes and recommendations:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim() || !user) return;

    try {
      setSubmittingNote(true);
      await createNote(db, {
        clientId,
        trainerId: user.uid,
        trainerName: `${user.firstName} ${user.lastName}`,
        content: noteContent,
      });
      setNoteContent('');
      await fetchData();
    } catch (err) {
      console.error('Error creating note:', err);
      alert('Failed to create note');
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleStartEdit = (note: TrainerNote) => {
    setEditingNoteId(note.id);
    setEditNoteContent(note.content);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditNoteContent('');
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editNoteContent.trim()) return;

    try {
      await updateNote(db, noteId, { content: editNoteContent });
      setEditingNoteId(null);
      setEditNoteContent('');
      await fetchData();
    } catch (err) {
      console.error('Error updating note:', err);
      alert('Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await deleteNote(db, noteId);
      await fetchData();
    } catch (err) {
      console.error('Error deleting note:', err);
      alert('Failed to delete note');
    }
  };

  const handleCreateRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recTitle.trim() || !user) return;

    try {
      setSubmittingRec(true);
      await createRecommendation(db, {
        clientId,
        trainerId: user.uid,
        trainerName: `${user.firstName} ${user.lastName}`,
        title: recTitle,
        description: recDescription,
      });
      setRecTitle('');
      setRecDescription('');
      setShowRecForm(false);
      await fetchData();
    } catch (err) {
      console.error('Error creating recommendation:', err);
      alert('Failed to create recommendation');
    } finally {
      setSubmittingRec(false);
    }
  };

  const handleDeleteRecommendation = async (recId: string) => {
    if (!confirm('Are you sure you want to delete this recommendation?')) return;

    try {
      await deleteRecommendation(db, recId);
      await fetchData();
    } catch (err) {
      console.error('Error deleting recommendation:', err);
      alert('Failed to delete recommendation');
    }
  };

  const canEditNote = (note: TrainerNote): boolean => {
    return user?.uid === note.trainerId;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading notes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-red-600">
            <p className="font-semibold">Error loading notes</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Note Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Note</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateNote} className="space-y-4">
            <div>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write a note about this client..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <Button type="submit" isLoading={submittingNote} disabled={submittingNote}>
              Add Note
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notes List */}
      <Card>
        <CardHeader>
          <CardTitle>Notes ({notes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <p className="text-gray-500 text-sm">No notes yet</p>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="border-b pb-4 last:border-b-0">
                  {editingNoteId === note.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editNoteContent}
                        onChange={(e) => setEditNoteContent(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdateNote(note.id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{note.trainerName}</p>
                          <p className="text-xs text-gray-500">
                            {note.createdAt.toLocaleDateString()} at{' '}
                            {note.createdAt.toLocaleTimeString()}
                            {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                              <span className="ml-2">(edited)</span>
                            )}
                          </p>
                        </div>
                        {canEditNote(note) && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStartEdit(note)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteNote(note.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recommendations ({recommendations.length})</CardTitle>
            {!showRecForm && (
              <Button size="sm" onClick={() => setShowRecForm(true)}>
                Add Recommendation
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showRecForm && (
            <form onSubmit={handleCreateRecommendation} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={recTitle}
                  onChange={(e) => setRecTitle(e.target.value)}
                  placeholder="Recommendation title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={recDescription}
                  onChange={(e) => setRecDescription(e.target.value)}
                  placeholder="Additional details..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" isLoading={submittingRec} disabled={submittingRec}>
                  Add Recommendation
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowRecForm(false);
                    setRecTitle('');
                    setRecDescription('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {recommendations.length === 0 ? (
            <p className="text-gray-500 text-sm">No recommendations yet</p>
          ) : (
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{rec.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        By {rec.trainerName} on {rec.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    {user?.uid === rec.trainerId && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteRecommendation(rec.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                  {rec.description && (
                    <p className="text-gray-700 text-sm mt-2">{rec.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
