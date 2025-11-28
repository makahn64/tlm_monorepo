import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { createClient, updateClient } from '@lotus/api-client';
import type { Client, ClientType } from '@lotus/shared-types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface ClientFormProps {
  client?: Client;
  mode: 'create' | 'edit';
}

const EQUIPMENT_OPTIONS = [
  'Yoga Mat',
  'Resistance Bands',
  'Dumbbells',
  'Kettlebell',
  'Exercise Ball',
  'Foam Roller',
  'Pilates Ring',
  'Ankle Weights',
  'Pull-up Bar',
  'Jump Rope',
];

const INJURY_OPTIONS = [
  'Knee Injury',
  'Shoulder Injury',
  'Hip Injury',
  'Ankle Injury',
  'Wrist Injury',
  'Elbow Injury',
  'Neck Injury',
  'Lower Back Injury',
];

const POSTURE_CONDITIONS = [
  'Forward Head Posture',
  'Rounded Shoulders',
  'Anterior Pelvic Tilt',
  'Posterior Pelvic Tilt',
  'Scoliosis',
  'Kyphosis',
  'Lordosis',
];

export const ClientForm = ({ client, mode }: ClientFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: client?.email || '',
    firstName: client?.firstName || '',
    lastName: client?.lastName || '',
    clientType: client?.clientType || ('active' as ClientType),
    fitnessLevel: client?.fitnessLevel || ('beginner' as 'beginner' | 'intermediate' | 'advanced'),
    dateOfBirth: client?.dateOfBirth || '',
    dueDate: client?.dueDate || '',
    isPregnant: client?.isPregnant || false,
    tryingToConceive: client?.tryingToConceive || false,
    backPain: client?.backPain || ('none' as 'none' | 'low' | 'high'),
    sciatica: client?.sciatica || ('none' as 'none' | 'low' | 'high'),
    injuries: client?.injuries || ([] as string[]),
    postureConditions: client?.postureConditions || ([] as string[]),
    equipment: client?.equipment || ([] as string[]),
    accountActive: client?.accountActive ?? true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      
      // Make pregnant and trying to conceive mutually exclusive
      if (name === 'isPregnant' && checked) {
        setFormData((prev) => ({ ...prev, [name]: checked, tryingToConceive: false }));
      } else if (name === 'tryingToConceive' && checked) {
        setFormData((prev) => ({ ...prev, [name]: checked, isPregnant: false, dueDate: '' }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxArrayChange = (
    field: 'injuries' | 'postureConditions' | 'equipment',
    value: string
  ) => {
    setFormData((prev) => {
      const currentArray = prev[field];
      const isChecked = currentArray.includes(value);

      return {
        ...prev,
        [field]: isChecked
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value],
      };
    });
  };

  const validateForm = (): string | null => {
    if (!formData.email.trim()) {
      return 'Email is required';
    }
    if (!formData.email.includes('@')) {
      return 'Please enter a valid email address';
    }
    if (!formData.firstName.trim()) {
      return 'First name is required';
    }
    if (!formData.lastName.trim()) {
      return 'Last name is required';
    }
    if (!formData.clientType) {
      return 'Client type is required';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      if (mode === 'create') {
        const newClient = await createClient(db, {
          ...formData,
          themeMode: 'auto',
          trainerIds: [],
          markedForDeletion: false,
          schemaVersion: 1,
        });
        navigate(`/clients/${newClient.uid}`);
      } else if (client) {
        await updateClient(db, client.uid, formData);
        navigate(`/clients/${client.uid}`);
      }
    } catch (err) {
      console.error('Error saving client:', err);
      setError(err instanceof Error ? err.message : 'Failed to save client');
    } finally {
      setLoading(false);
    }
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="clientType" className="block text-sm font-medium text-gray-700 mb-1">
                Client Type *
              </label>
              <select
                id="clientType"
                name="clientType"
                required
                value={formData.clientType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="pastDue">Past Due</option>
                <option value="lead">Lead</option>
                <option value="archived">Archived</option>
                <option value="free">Free</option>
                <option value="appSub0">App Sub 0</option>
                <option value="appSub1">App Sub 1</option>
                <option value="appSub2">App Sub 2</option>
                <option value="appSub3">App Sub 3</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="fitnessLevel"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Fitness Level
              </label>
              <select
                id="fitnessLevel"
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="accountActive"
              name="accountActive"
              type="checkbox"
              checked={formData.accountActive}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="accountActive" className="text-sm font-medium text-gray-700">
              Account Active
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Health Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              id="isPregnant"
              name="isPregnant"
              type="checkbox"
              checked={formData.isPregnant}
              onChange={handleInputChange}
              disabled={formData.tryingToConceive}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label htmlFor="isPregnant" className="text-sm font-medium text-gray-700">
              Currently Pregnant
            </label>
          </div>

          {formData.isPregnant && (
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.dueDate}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              id="tryingToConceive"
              name="tryingToConceive"
              type="checkbox"
              checked={formData.tryingToConceive}
              onChange={handleInputChange}
              disabled={formData.isPregnant}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label htmlFor="tryingToConceive" className="text-sm font-medium text-gray-700">
              Trying to Conceive
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="backPain" className="block text-sm font-medium text-gray-700 mb-1">
                Back Pain
              </label>
              <select
                id="backPain"
                name="backPain"
                value={formData.backPain}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="sciatica" className="block text-sm font-medium text-gray-700 mb-1">
                Sciatica
              </label>
              <select
                id="sciatica"
                name="sciatica"
                value={formData.sciatica}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Injuries</label>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 border border-gray-200 rounded-md p-3">
              {INJURY_OPTIONS.map((injury) => (
                <label key={injury} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.injuries.includes(injury)}
                    onChange={() => handleCheckboxArrayChange('injuries', injury)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{injury}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Posture Conditions
            </label>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 border border-gray-200 rounded-md p-3">
              {POSTURE_CONDITIONS.map((condition) => (
                <label key={condition} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.postureConditions.includes(condition)}
                    onChange={() => handleCheckboxArrayChange('postureConditions', condition)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{condition}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Equipment</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Equipment
            </label>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 border border-gray-200 rounded-md p-3">
              {EQUIPMENT_OPTIONS.map((equip) => (
                <label key={equip} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.equipment.includes(equip)}
                    onChange={() => handleCheckboxArrayChange('equipment', equip)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{equip}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading} disabled={loading}>
          {mode === 'create' ? 'Create Client' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
