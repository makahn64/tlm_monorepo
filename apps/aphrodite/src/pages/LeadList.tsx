import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLeads } from '../hooks/useLeads';
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
import { LeadState } from '@lotus/shared-types';

export const LeadList = () => {
  const [dispositionFilter, setDispositionFilter] = useState<string>('unprocessed');

  const { leads, loading, error } = useLeads({
    disposition: dispositionFilter as any,
  });

  const getDispositionLabel = (disposition?: LeadState): string => {
    if (!disposition) return 'Unprocessed';
    
    const labels: Record<LeadState, string> = {
      [LeadState.UNPROCESSED]: 'Unprocessed',
      [LeadState.ACCEPTED]: 'Accepted',
      [LeadState.DROPPED]: 'Dropped',
    };
    return labels[disposition] || disposition;
  };

  const getDispositionBadgeVariant = (
    disposition?: LeadState
  ): 'default' | 'success' | 'warning' | 'danger' | 'secondary' => {
    if (!disposition || disposition === LeadState.UNPROCESSED) {
      return 'warning';
    }
    
    switch (disposition) {
      case LeadState.ACCEPTED:
        return 'success';
      case LeadState.DROPPED:
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lead Management</h1>
          <p className="text-gray-500 mt-1">Manage trial signups and convert leads to clients</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label htmlFor="disposition" className="block text-sm font-medium text-gray-700 mb-1">
              Disposition
            </label>
            <select
              id="disposition"
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dispositionFilter}
              onChange={(e) => setDispositionFilter(e.target.value)}
            >
              <option value="">All Leads</option>
              <option value="unprocessed">Unprocessed</option>
              <option value={LeadState.ACCEPTED}>Accepted</option>
              <option value={LeadState.DROPPED}>Dropped</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-600">
              <p className="font-semibold">Error loading leads</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading leads...</div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            {leads.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No leads found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {dispositionFilter
                    ? 'Try adjusting your filter'
                    : 'No leads have been submitted yet'}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-500">
                  Showing {leads.length} lead{leads.length !== 1 ? 's' : ''}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Processed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">
                          {lead.contactInfo
                            ? `${lead.contactInfo.firstName} ${lead.contactInfo.lastName}`
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {lead.contactInfo?.email || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getDispositionBadgeVariant(lead.disposition)}>
                            {getDispositionLabel(lead.disposition)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {lead.createdOn
                            ? new Date(lead.createdOn).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {lead.processedOn
                            ? new Date(lead.processedOn).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={`/leads/${lead.id}`}>
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
