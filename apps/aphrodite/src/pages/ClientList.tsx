import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useClients } from '../hooks/useClients';
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
import { UserRole, ClientType } from '@lotus/shared-types';

export const ClientList = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [clientTypeFilter, setClientTypeFilter] = useState<string>('');

  // Determine if user is admin or trainer
  const isAdmin = user?.roles.includes(UserRole.ADMIN);
  const isTrainer = user?.roles.includes(UserRole.TRAINER);

  // If trainer, filter by their ID; if admin, show all
  const trainerId = isTrainer && !isAdmin ? user?.uid : undefined;

  const { clients, loading, error } = useClients({
    trainerId,
    clientType: clientTypeFilter ? (clientTypeFilter as ClientType) : undefined,
    searchTerm,
  });

  const getClientTypeLabel = (type: ClientType): string => {
    const labels: Record<ClientType, string> = {
      [ClientType.ACTIVE]: 'Active',
      [ClientType.PAUSED]: 'Paused',
      [ClientType.PAST_DUE]: 'Past Due',
      [ClientType.LEAD]: 'Lead',
      [ClientType.ARCHIVED]: 'Archived',
      [ClientType.FREE]: 'Free',
      [ClientType.APP_SUB_0]: 'App Sub 0',
      [ClientType.APP_SUB_1]: 'App Sub 1',
      [ClientType.APP_SUB_2]: 'App Sub 2',
      [ClientType.APP_SUB_3]: 'App Sub 3',
    };
    return labels[type] || type;
  };

  const getClientTypeBadgeVariant = (
    type: ClientType
  ): 'default' | 'success' | 'warning' | 'danger' | 'secondary' => {
    switch (type) {
      case ClientType.ACTIVE:
        return 'success';
      case ClientType.PAUSED:
        return 'warning';
      case ClientType.PAST_DUE:
        return 'danger';
      case ClientType.LEAD:
        return 'secondary';
      case ClientType.ARCHIVED:
        return 'default';
      default:
        return 'default';
    }
  };

  const getFitnessLevelBadge = (level: string): JSX.Element => {
    const variants: Record<string, 'success' | 'warning' | 'danger'> = {
      beginner: 'success',
      intermediate: 'warning',
      advanced: 'danger',
    };
    return (
      <Badge variant={variants[level] || 'default'}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-gray-500 mt-1">
            {isAdmin ? 'Manage all clients' : 'Manage your clients'}
          </p>
        </div>
        <Link to="/clients/new">
          <Button>Create Client</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <Input
                id="search"
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="clientType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Client Type
              </label>
              <select
                id="clientType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={clientTypeFilter}
                onChange={(e) => setClientTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                {Object.values(ClientType).map((type) => (
                  <option key={type} value={type}>
                    {getClientTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-600">
              <p className="font-semibold">Error loading clients</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading clients...</div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            {clients.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No clients found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchTerm || clientTypeFilter
                    ? 'Try adjusting your search or filters'
                    : 'Get started by creating your first client'}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-500">
                  Showing {clients.length} client{clients.length !== 1 ? 's' : ''}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Fitness Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.uid}>
                        <TableCell className="font-medium">
                          <Link
                            to={`/clients/${client.uid}`}
                            className="text-blue-600 hover:underline"
                          >
                            {client.firstName} {client.lastName}
                          </Link>
                        </TableCell>
                        <TableCell className="text-gray-600">{client.email}</TableCell>
                        <TableCell>
                          <Badge variant={getClientTypeBadgeVariant(client.clientType)}>
                            {getClientTypeLabel(client.clientType)}
                          </Badge>
                        </TableCell>
                        <TableCell>{getFitnessLevelBadge(client.fitnessLevel)}</TableCell>
                        <TableCell>
                          {client.accountActive ? (
                            <Badge variant="success">Active</Badge>
                          ) : (
                            <Badge variant="default">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={`/clients/${client.uid}`}>
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
