import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { createExercise, updateExercise } from '@lotus/api-client';
import type { Exercise, MediaReference } from '@lotus/shared-types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface ExerciseFormProps {
  exercise?: Exercise;
  mode: 'create' | 'edit';
}

interface FormData {
  title: string;
  name: string;
  description: string;
  movementPattern: string;
  intensity: number;
  duration: number;
  equipment: string[];
  optionalEquipment: string[];
  stress: string[];
  releases: string[];
  activates: string[];
  cues: string[];
  prenatalVideo: MediaReference;
  postnatalVideo: MediaReference;
  instructionVideo: MediaReference;
  prenatalThumb: MediaReference;
  postnatalThumb: MediaReference;
  instructionThumb: MediaReference;
  published: boolean;
  isBreak: boolean;
  isCustom: boolean;
  preComposited: boolean;
}

export const ExerciseForm = ({ exercise, mode }: ExerciseFormProps) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: exercise?.title || '',
    name: exercise?.name || '',
    description: exercise?.description || '',
    movementPattern: exercise?.movementPattern || '',
    intensity: exercise?.intensity || 5,
    duration: exercise?.duration || 30,
    equipment: exercise?.equipment || [],
    optionalEquipment: exercise?.optionalEquipment || [],
    stress: exercise?.stress || [],
    releases: exercise?.releases || [],
    activates: exercise?.activates || [],
    cues: exercise?.cues || [],
    prenatalVideo: exercise?.prenatalVideo || {},
    postnatalVideo: exercise?.postnatalVideo || {},
    instructionVideo: exercise?.instructionVideo || {},
    prenatalThumb: exercise?.prenatalThumb || {},
    postnatalThumb: exercise?.postnatalThumb || {},
    instructionThumb: exercise?.instructionThumb || {},
    published: exercise?.published ?? true,
    isBreak: exercise?.isBreak || false,
    isCustom: exercise?.isCustom || false,
    preComposited: exercise?.preComposited || false,
  });

  // Helper to manage array fields
  const [equipmentInput, setEquipmentInput] = useState('');
  const [optionalEquipmentInput, setOptionalEquipmentInput] = useState('');
  const [stressInput, setStressInput] = useState('');
  const [releasesInput, setReleasesInput] = useState('');
  const [activatesInput, setActivatesInput] = useState('');
  const [cueInput, setCueInput] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.movementPattern.trim()) {
      setError('Movement pattern is required');
      return;
    }
    if (formData.intensity < 1 || formData.intensity > 10) {
      setError('Intensity must be between 1 and 10');
      return;
    }
    if (formData.duration < 0) {
      setError('Duration must be positive');
      return;
    }

    try {
      setSaving(true);

      if (mode === 'create') {
        const newExercise = await createExercise(db, {
          ...formData,
          archived: false,
          metadata: null,
        });
        navigate(`/exercises/${newExercise.docId}`);
      } else if (exercise) {
        await updateExercise(db, exercise.docId, formData);
        navigate(`/exercises/${exercise.docId}`);
      }
    } catch (err) {
      console.error('Error saving exercise:', err);
      setError(err instanceof Error ? err.message : 'Failed to save exercise');
      setSaving(false);
    }
  };

  const addToArray = (field: keyof FormData, value: string, clearInput: () => void) => {
    if (!value.trim()) return;
    const currentArray = formData[field] as string[];
    if (!currentArray.includes(value.trim())) {
      setFormData({
        ...formData,
        [field]: [...currentArray, value.trim()],
      });
    }
    clearInput();
  };

  const removeFromArray = (field: keyof FormData, index: number) => {
    const currentArray = formData[field] as string[];
    setFormData({
      ...formData,
      [field]: currentArray.filter((_, i) => i !== index),
    });
  };

  const renderArrayInput = (
    label: string,
    field: keyof FormData,
    inputValue: string,
    setInputValue: (value: string) => void
  ) => {
    const array = formData[field] as string[];
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex gap-2 mb-2">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addToArray(field, inputValue, () => setInputValue(''));
              }
            }}
            placeholder={`Add ${label.toLowerCase()}`}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => addToArray(field, inputValue, () => setInputValue(''))}
          >
            Add
          </Button>
        </div>
        {array.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {array.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeFromArray(field, index)}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderMediaInput = (
    label: string,
    field: 'prenatalVideo' | 'postnatalVideo' | 'instructionVideo' | 'prenatalThumb' | 'postnatalThumb' | 'instructionThumb'
  ) => {
    const mediaRef = formData[field];
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="URL"
            value={mediaRef.url || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                [field]: { ...mediaRef, url: e.target.value },
              })
            }
          />
          <Input
            type="text"
            placeholder="Path"
            value={mediaRef.path || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                [field]: { ...mediaRef, path: e.target.value },
              })
            }
          />
          <Input
            type="text"
            placeholder="Bucket"
            value={mediaRef.bucket || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                [field]: { ...mediaRef, bucket: e.target.value },
              })
            }
          />
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-600">*</span>
            </label>
            <Input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-600">*</span>
            </label>
            <Input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label
              htmlFor="movementPattern"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Movement Pattern <span className="text-red-600">*</span>
            </label>
            <Input
              id="movementPattern"
              type="text"
              required
              value={formData.movementPattern}
              onChange={(e) => setFormData({ ...formData, movementPattern: e.target.value })}
              placeholder="e.g., Squat, Lunge, Push, Pull"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="intensity" className="block text-sm font-medium text-gray-700 mb-1">
                Intensity (1-10) <span className="text-red-600">*</span>
              </label>
              <select
                id="intensity"
                required
                value={formData.intensity}
                onChange={(e) => setFormData({ ...formData, intensity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (seconds) <span className="text-red-600">*</span>
              </label>
              <Input
                id="duration"
                type="number"
                min="0"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags & Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderArrayInput('Equipment', 'equipment', equipmentInput, setEquipmentInput)}
          {renderArrayInput(
            'Optional Equipment',
            'optionalEquipment',
            optionalEquipmentInput,
            setOptionalEquipmentInput
          )}
          {renderArrayInput('Stress', 'stress', stressInput, setStressInput)}
          {renderArrayInput('Releases', 'releases', releasesInput, setReleasesInput)}
          {renderArrayInput('Activates', 'activates', activatesInput, setActivatesInput)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          {renderArrayInput('Cues', 'cues', cueInput, setCueInput)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Video References</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderMediaInput('Prenatal Video', 'prenatalVideo')}
          {renderMediaInput('Postnatal Video', 'postnatalVideo')}
          {renderMediaInput('Instruction Video', 'instructionVideo')}
          {renderMediaInput('Prenatal Thumbnail', 'prenatalThumb')}
          {renderMediaInput('Postnatal Thumbnail', 'postnatalThumb')}
          {renderMediaInput('Instruction Thumbnail', 'instructionThumb')}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exercise Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Published</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isBreak}
              onChange={(e) => setFormData({ ...formData, isBreak: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Break</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isCustom}
              onChange={(e) => setFormData({ ...formData, isCustom: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Custom Exercise</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.preComposited}
              onChange={(e) => setFormData({ ...formData, preComposited: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Pre-composited</span>
          </label>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={saving} isLoading={saving}>
          {mode === 'create' ? 'Create Exercise' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
