import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { getLeadById, acceptLead, dropLead } from '@lotus/api-client';
import type { Lead, LeadState } from '@lotus/shared-types';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LeadState as LeadStateEnum } from '@lotus/shared-types';

export const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchLead = async () => {
      if (!id) {
        setError(new Error('Lead ID is required'));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getLeadById(db, id);
        setLead(data);
      } catch (err) {
        console.error('Error fetching lead:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  const handleAccept = async () => {
    if (!id || !lead) return;

    try {
      setProcessing(true);
      await acceptLead(db, id);
      
      // Refresh lead data
      const updatedLead = await getLeadById(db, id);
      setLead(updatedLead);
      
      // Navigate to client conversion page
      navigate(`/leads/${id}/convert`);
    } catch (err) {
      console.error('Error accepting lead:', err);
      alert('Failed to accept lead. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDrop = async () => {
    if (!id || !lead) return;

    const confirmed = window.confirm(
      'Are you sure you want to drop this lead? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      setProcessing(true);
      await dropLead(db, id);
      
      // Refresh lead data
      const updatedLead = await getLeadById(db, id);
      setLead(updatedLead);
      
      alert('Lead has been dropped successfully.');
    } catch (err) {
      console.error('Error dropping lead:', err);
      alert('Failed to drop lead. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getDispositionLabel = (disposition?: LeadState): string => {
    if (!disposition) return 'Unprocessed';
    
    const labels: Record<LeadState, string> = {
      [LeadStateEnum.UNPROCESSED]: 'Unprocessed',
      [LeadStateEnum.ACCEPTED]: 'Accepted',
      [LeadStateEnum.DROPPED]: 'Dropped',
    };
    return labels[disposition] || disposition;
  };

  const getDispositionBadgeVariant = (
    disposition?: LeadState
  ): 'default' | 'success' | 'warning' | 'danger' | 'secondary' => {
    if (!disposition || disposition === LeadStateEnum.UNPROCESSED) {
      return 'warning';
    }
    
    switch (disposition) {
      case LeadStateEnum.ACCEPTED:
        return 'success';
      case LeadStateEnum.DROPPED:
        return 'danger';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading lead...</div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-red-600">
            <p className="font-semibold">Error loading lead</p>
            <p className="text-sm">{error?.message || 'Lead not found'}</p>
            <Button onClick={() => navigate('/leads')} className="mt-4">
              Back to Leads
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isUnprocessed = !lead.disposition || lead.disposition === LeadStateEnum.UNPROCESSED;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link to="/leads" className="text-blue-600 hover:underline text-sm">
              ← Back to Leads
            </Link>
          </div>
          <h1 className="text-3xl font-bold">
            {lead.contactInfo
              ? `${lead.contactInfo.firstName} ${lead.contactInfo.lastName}`
              : 'Lead Details'}
          </h1>
          <p className="text-gray-500 mt-1">{lead.contactInfo?.email || 'No email provided'}</p>
        </div>
        {isUnprocessed && (
          <div className="flex gap-2">
            <Button
              onClick={handleAccept}
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Accept Lead'}
            </Button>
            <Button
              onClick={handleDrop}
              disabled={processing}
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {processing ? 'Processing...' : 'Drop Lead'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lead.contactInfo ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">First Name</p>
                    <p className="mt-1 text-gray-900">{lead.contactInfo.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Name</p>
                    <p className="mt-1 text-gray-900">{lead.contactInfo.lastName}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-gray-900">{lead.contactInfo.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No contact information available</p>
              )}
            </CardContent>
          </Card>

          {lead.profile && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {lead.profile.dueOrBirthDate && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Due/Birth Date</p>
                      <p className="mt-1 text-gray-900">
                        {new Date(lead.profile.dueOrBirthDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {lead.profile.pregnancyState && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pregnancy State</p>
                      <p className="mt-1 text-gray-900">{lead.profile.pregnancyState}</p>
                    </div>
                  )}

                  {lead.profile.pregState && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pregnancy Status</p>
                      <p className="mt-1 text-gray-900">{lead.profile.pregState}</p>
                    </div>
                  )}

                  {lead.profile.birthType && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Birth Type</p>
                      <p className="mt-1 text-gray-900">{lead.profile.birthType}</p>
                    </div>
                  )}

                  {lead.profile.backPain && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Back Pain</p>
                      <p className="mt-1 text-gray-900">{lead.profile.backPain}</p>
                    </div>
                  )}

                  {lead.profile.sciatica && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Sciatica</p>
                      <p className="mt-1 text-gray-900">{lead.profile.sciatica}</p>
                    </div>
                  )}

                  {lead.profile.roundLigamentPain && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Round Ligament Pain</p>
                      <p className="mt-1 text-gray-900">{lead.profile.roundLigamentPain}</p>
                    </div>
                  )}

                  {lead.profile.diastasisRecti && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Diastasis Recti</p>
                      <p className="mt-1 text-gray-900">{lead.profile.diastasisRecti}</p>
                    </div>
                  )}
                </div>

                {lead.profile.pelvicFloorConcerns && lead.profile.pelvicFloorConcerns.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-500 mb-2">Pelvic Floor Concerns</p>
                    <div className="flex flex-wrap gap-2">
                      {lead.profile.pelvicFloorConcerns.map((concern, index) => (
                        <Badge key={index} variant="warning">
                          {concern}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {lead.profile.pelvicPain && lead.profile.pelvicPain.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-500 mb-2">Pelvic Pain</p>
                    <div className="flex flex-wrap gap-2">
                      {lead.profile.pelvicPain.map((pain, index) => (
                        <Badge key={index} variant="danger">
                          {pain}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {lead.profile.mostInterestedIn && lead.profile.mostInterestedIn.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-500 mb-2">Most Interested In</p>
                    <div className="flex flex-wrap gap-2">
                      {lead.profile.mostInterestedIn.map((interest, index) => (
                        <Badge key={index} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {lead.profile.previousInjuries && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-500">Previous Injuries</p>
                    <p className="mt-1 text-gray-900">{lead.profile.previousInjuries}</p>
                  </div>
                )}

                {lead.profile.medicalConditions && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-500">Medical Conditions</p>
                    <p className="mt-1 text-gray-900">{lead.profile.medicalConditions}</p>
                  </div>
                )}

                {lead.profile.anythingElse && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-500">Additional Notes</p>
                    <p className="mt-1 text-gray-900">{lead.profile.anythingElse}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Disposition</p>
                <div className="mt-1">
                  <Badge variant={getDispositionBadgeVariant(lead.disposition)}>
                    {getDispositionLabel(lead.disposition)}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Created On</p>
                <p className="mt-1 text-gray-900">
                  {lead.createdOn
                    ? new Date(lead.createdOn).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>

              {lead.processedOn && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Processed On</p>
                  <p className="mt-1 text-gray-900">
                    {new Date(lead.processedOn).toLocaleDateString()}
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
                <p className="text-gray-500">Lead ID</p>
                <p className="text-gray-900 font-mono text-xs break-all">{lead.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
