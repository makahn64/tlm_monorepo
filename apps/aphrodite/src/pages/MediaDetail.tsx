import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db, storage } from '../lib/firebase';
import { getMediaById, deleteMedia } from '@lotus/api-client';
import type { Media } from '@lotus/api-client';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const MediaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [media, setMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchMedia = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const result = await getMediaById(db, id);
        setMedia(result);
      } catch (err) {
        console.error('Error fetching media:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !media) return;

    try {
      setDeleting(true);
      await deleteMedia(db, storage, id, true);
      navigate('/media');
    } catch (err) {
      console.error('Error deleting media:', err);
      setError(err as Error);
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}s`;
  };

  const getTypeColor = (type: string): 'default' | 'success' | 'warning' | 'danger' => {
    switch (type) {
      case 'video':
        return 'success';
      case 'image':
        return 'warning';
      case 'audio':
        return 'danger';
      default:
        return 'default';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading media...</div>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Media Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-600">
              <p className="font-semibold">Error loading media</p>
              <p className="text-sm">{error?.message || 'Media not found'}</p>
            </div>
            <div className="mt-4">
              <Link to="/media">
                <Button>Back to Media Library</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/media" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
            ← Back to Media Library
          </Link>
          <h1 className="text-3xl font-bold">{media.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={getTypeColor(media.type)}>
              {media.type.toUpperCase()}
            </Badge>
            <span className="text-gray-500 text-sm">{media.mimeType}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden bg-gray-50">
            {media.type === 'image' ? (
              <img
                src={media.url}
                alt={media.name}
                className="w-full h-auto max-h-96 object-contain"
              />
            ) : media.type === 'video' ? (
              <video
                src={media.url}
                controls
                className="w-full h-auto max-h-96"
              />
            ) : media.type === 'audio' ? (
              <div className="p-8 flex items-center justify-center">
                <audio src={media.url} controls className="w-full max-w-md" />
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No preview available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Information */}
      <Card>
        <CardHeader>
          <CardTitle>File Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">File Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{media.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">File Size</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatFileSize(media.size)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">MIME Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{media.mimeType}</dd>
            </div>
            {media.duration && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Duration</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDuration(media.duration)}</dd>
              </div>
            )}
            {media.width && media.height && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Dimensions</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {media.width} × {media.height}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">Uploaded</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(media.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(media.updatedAt)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Storage Information */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">Storage URL</dt>
              <dd className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                  {media.url}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(media.url)}
                >
                  Copy
                </Button>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">Storage Path</dt>
              <dd className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                  {media.path}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(media.path)}
                >
                  Copy
                </Button>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">Bucket</dt>
              <dd className="text-sm text-gray-900">{media.bucket}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle>Delete Media File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete this media file? This action cannot be undone and
                will remove the file from Cloud Storage.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
