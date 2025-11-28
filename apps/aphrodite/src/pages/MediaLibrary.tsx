import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMedia } from '../hooks/useMedia';
import { Button } from '../components/ui/Button';
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
import type { Media } from '@lotus/api-client';

export const MediaLibrary = () => {
  const [typeFilter, setTypeFilter] = useState<'video' | 'image' | 'audio' | ''>('');

  const { media, loading, error } = useMedia({
    type: typeFilter || undefined,
  });

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
      month: 'short',
      day: 'numeric',
    }).format(date);
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

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-gray-500 mt-1">Manage video, image, and audio files</p>
        </div>
        <Link to="/media/upload">
          <Button>Upload Media</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Media Type
              </label>
              <select
                id="type"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
              >
                <option value="">All Types</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="audio">Audio</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-600">
              <p className="font-semibold">Error loading media</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading media files...</div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="!pt-6">
            {media.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No media files found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Upload your first media file to get started
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 text-sm text-gray-500">
                  Showing {media.length} file{media.length !== 1 ? 's' : ''}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {media.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium">
                          <Link
                            to={`/media/${file.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {file.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getTypeColor(file.type)}>
                            {file.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatFileSize(file.size)}</TableCell>
                        <TableCell>{formatDuration(file.duration)}</TableCell>
                        <TableCell>{formatDate(file.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Link to={`/media/${file.id}`}>
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
