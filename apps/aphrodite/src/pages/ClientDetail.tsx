import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { getClientById } from '@lotus/api-client';
import type { Client, ClientType } from '@lotus/shared-types';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) {
        setError(new Error('Client ID is required'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getClientById(db, id);
        setClient(data);
      } catch (err) {
        console.error('Error fetching client:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const getClientTypeLabel = (type: ClientType): string => {
    const labels: Record<ClientType, string> = {
      active: 'Active',
      paused: 'Paused',
      pastDue: 'Past Due',
      lead: 'Lead',
      archived: 'Archived',
      free: 'Free',
      appSub0: 'App Sub 0',
      appSub1: 'App Sub 1',
      appSub2: 'App Sub 2',
      appSub3: 'App Sub 3',
    };
    return labels[type] || type;
  };

  const getClientTypeBadgeVariant = (
    type: ClientType
  ): 'default' | 'success' | 'warning' | 'danger' | 'secondary' => {
    switch (type) {
      case 'active':
        return 'success';
      case 'paused':
        return 'warning';
      case 'pastDue':
        return 'danger';
      case 'lead':
        return 'secondary';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  const getSeverityLabel = (severity: 'none' | 'low' | 'high'): string => {
    const labels = {
      none: 'None',
      low: 'Low',
      high: 'High',
    };
    return labels[severity];
  };

  const getSeverityBadgeVariant = (
    severity: 'none' | 'low' | 'high'
  ): 'default' | 'success' | 'warning' | 'danger' => {
    switch (severity) {
      case 'none':
        return 'success';
      case 'low':
        return 'warning';
      case 'high':
        return 'danger';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading client...</div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-red-600">
            <p className="font-semibold">Error loading client</p>
            <p className="text-sm">{error?.message || 'Client not found'}</p>
            <Button onClick={() => navigate('/clients')} className="mt-4">
              Back to Clients
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
            <Link to="/clients" className="text-blue-600 hover:underline text-sm">
              ← Back to Clients
            </Link>
          </div>
          <h1 className="text-3xl font-bold">
            {client.firstName} {client.lastName}
          </h1>
          <p className="text-gray-500 mt-1">{client.email}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/clients/${id}/edit`}>
            <Button>Edit Client</Button>
          </Link>
          <Link to={`/clients/${id}/notes`}>
            <Button variant="outline">View Notes</Button>
          </Link>
          <Link to={`/clients/${id}/workouts`}>
            <Button variant="outline">View Workouts</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Fitness Level</p>
                  <p className="mt-1 text-gray-900 capitalize">{client.fitnessLevel}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Pregnant</p>
                  <p className="mt-1 text-gray-900">{client.isPregnant ? 'Yes' : 'No'}</p>
                </div>

                {client.isPregnant && client.dueDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Due Date</p>
                    <p className="mt-1 text-gray-900">{client.dueDate}</p>
                  </div>
                )}

                {client.tryingToConceive !== undefined && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Trying to Conceive</p>
                    <p className="mt-1 text-gray-900">{client.tryingToConceive ? 'Yes' : 'No'}</p>
                  </div>
                )}

                {client.dateOfBirth && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                    <p className="mt-1 text-gray-900">{client.dateOfBirth}</p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-3">Physical Conditions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Back Pain</p>
                    <Badge variant={getSeverityBadgeVariant(client.backPain)}>
                      {getSeverityLabel(client.backPain)}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Sciatica</p>
                    <Badge variant={getSeverityBadgeVariant(client.sciatica)}>
                      {getSeverityLabel(client.sciatica)}
                    </Badge>
                  </div>
                </div>
              </div>

              {client.injuries.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Injuries</p>
                  <div className="flex flex-wrap gap-2">
                    {client.injuries.map((injury, index) => (
                      <Badge key={index} variant="danger">
                        {injury}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {client.postureConditions.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Posture Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {client.postureConditions.map((condition, index) => (
                      <Badge key={index} variant="warning">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              {client.equipment.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {client.equipment.map((equip, index) => (
                    <Badge key={index} variant="secondary">
                      {equip}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No equipment listed</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Client Type</p>
                <div className="mt-1">
                  <Badge variant={getClientTypeBadgeVariant(client.clientType)}>
                    {getClientTypeLabel(client.clientType)}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Account Status</p>
                <div className="mt-1">
                  {client.accountActive ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="default">Inactive</Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Theme Mode</p>
                <p className="mt-1 text-gray-900 capitalize">{client.themeMode}</p>
              </div>

              {client.hasAcceptedLiabilityWaiver !== undefined && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Liability Waiver</p>
                  <p className="mt-1 text-gray-900">
                    {client.hasAcceptedLiabilityWaiver ? 'Accepted' : 'Not Accepted'}
                  </p>
                </div>
              )}

              {client.hasCompletedOnboarding !== undefined && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Onboarding</p>
                  <p className="mt-1 text-gray-900">
                    {client.hasCompletedOnboarding ? 'Completed' : 'Not Completed'}
                  </p>
                </div>
              )}

              {client.trainerIds.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Trainers</p>
                  <p className="mt-1 text-gray-900 text-sm">
                    {client.trainerIds.length} trainer{client.trainerIds.length !== 1 ? 's' : ''}{' '}
                    assigned
                  </p>
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
                <p className="text-gray-900">{client.createdAt.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="text-gray-900">{client.updatedAt.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Schema Version</p>
                <p className="text-gray-900">{client.schemaVersion}</p>
              </div>
              <div>
                <p className="text-gray-500">Client ID</p>
                <p className="text-gray-900 font-mono text-xs break-all">{client.uid}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
