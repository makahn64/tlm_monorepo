import React, {FC, useCallback, useEffect, useState} from 'react';
import {PageContainer} from "../../components/containers/PageContainer";
import {useHistory, useParams} from 'react-router-dom';
import {Button, Col, Row} from "react-bootstrap";
import * as api from '../../services/api';
import {Lead, LeadState} from "../../types/Lead";
import {LeadTable} from "./LeadTable";
import {AddEditClientComponent} from "../clients/AddEditClientPage";

export const LeadDetailPage: FC = () => {
  const { id } = useParams<{id: string}>();
  const [ lead, setLead ] = useState<Lead|undefined>();
  const [loading, setLoading] = useState(true);
  const [onboard, setOnboard] = useState(false);
  const [ showModal, setShowModal ] = useState(false);
  const history = useHistory();

  const loadLead = useCallback(async () => {
    try {
      const l = await api.leads.getLead(id);
      setLead(l);
    } catch (e) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadLead();
  }, [loadLead]);

  const handleOnboard = () => {
    api.leads.update(id, { disposition: LeadState.accepted})
      .finally(() => setOnboard(true))
  }

  const handleDump = () => {
    api.leads.update(id, { disposition: LeadState.unprocessed})
      .finally(() => setOnboard(false))
  }

  return (
    <PageContainer title="Manage Lead" loading={loading}>
      <Row>
        <Col>
          <LeadTable lead={lead!}/>
        </Col>
        <Col>
          { (!lead?.disposition && !onboard) ? <>
            <Button variant="success" onClick={handleOnboard}>ONBOARD</Button>
            <Button variant="danger" onClick={handleDump} className="ml-2">DUMP</Button>
          </>: null }
          { onboard ? <AddEditClientComponent
            id={'new'}
            preload={{firstName: lead?.contactInfo?.firstName!,
            lastName: lead?.contactInfo?.lastName!,
            email: lead?.contactInfo?.email!}}
            onCancel={() => setOnboard(false)}/> : null }
        </Col>
      </Row>
    </PageContainer>
  );
};
