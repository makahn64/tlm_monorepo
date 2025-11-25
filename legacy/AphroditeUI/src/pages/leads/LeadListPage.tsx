import React, {FC, useEffect, useState} from 'react';
import {PageContainer} from "../../components/containers/PageContainer";
import * as api from "../../services/api";
import {Badge, Table} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';
import {toast} from 'react-toastify';
import {Lead} from "../../types/Lead";
import JSONPretty from "react-json-pretty";

export const LeadListPage: FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const history = useHistory();

  useEffect(() => {
    loadLeads();
  }, [])

  async function loadLeads() {
    try {
      const l = await api.leads.getAllLeads();
      const sorted = l.sort((a, b) =>
        (b.createdOn.getTime() - a.createdOn.getTime()) );
      setLeads(sorted);
    } catch (e) {
      toast(e.message);
    } finally {
      setLoading(false);
    }
  }

  //onClick={()=>history.push(`/clients/edit/${client.docId}`)}
  const buildRow = (lead: Lead, idx: number) => (
    <tr key={idx} onClick={()=> history.push(`/leads/process/${lead.id}`)}>
      <td>{lead.createdOn ? new Date(lead.createdOn).toDateString() : 'no date'}</td>
      <td>{lead.contactInfo?.lastName}</td>
      <td>{lead.contactInfo?.firstName}</td>
      <td>{lead.contactInfo?.email}</td>
      <td>
        <Badge variant="secondary">{ lead.disposition || 'unprocessed'}</Badge>
      </td>
    </tr>
  );

  // const sortedClients = leads.sort((a, b) => {
  //   if (a.lastName < b.lastName) {
  //     return -1;
  //   }
  //   if (a.lastName > b.lastName) {
  //     return 1;
  //   }
  //   return 0;
  // })

  // let filteredLeads = leads.filter(c => {
  //   const searchString = `${c.contactInfo.firstName} ${c.contactInfo.lastName} ${c.contactInfo.email}`.toLowerCase();
  //   return searchString.includes(search.toLowerCase());
  // });

  return (
    <PageContainer title="Leads"
                   loading={loading}>
      {/*<Form.Group>*/}
      {/*  <Form.Control type="text" placeholder="search" onChange={event => {*/}
      {/*    setSearch(event.target.value.toLowerCase())*/}
      {/*  }} value={search}/>*/}
      {/*</Form.Group>*/}
      <Table striped bordered hover className="mt-3">
        <thead>
        <tr>
          <th>Date Added</th>
          <th>Last Name</th>
          <th>First Name</th>
          <th>Email</th>
          <th>Profile</th>
        </tr>
        </thead>
        <tbody>
        {leads.map(buildRow)}
        </tbody>
      </Table>
      {!leads.length && <p className="text-muted font-italic">No leads found.</p>}
    </PageContainer>
  );
};
