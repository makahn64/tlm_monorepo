import React, {FC, useEffect, useState} from 'react';
import {PageContainer} from "../../components/containers/PageContainer";
import * as api from "../../services/api";
import {Alert, Form, Table} from 'react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
import {FaPlusCircle} from 'react-icons/fa';
import {toast} from 'react-toastify';
import {ClientType, Client} from "tlm-common";
import {ClientTypeSwitch} from "../../components/formElements/ClientTypeSwitch";
import {ClientTypeBadge} from "../../components/badges/ClientTypeBadge";

export const ClientListPage: FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  // -1 is for all client types
  const [clientTypeFilter, setClientTypeFilter] = useState<ClientType | -1>(-1);
  const history = useHistory();

  useEffect(() => {
    loadClients();
  }, [])

  async function loadClients() {
    try {
      const c = await api.clients.getAllClients();
      setClients(c as Client[]);
    } catch (e) {
      toast(e.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = () => {
    console.log('doink');
  }

  //onClick={()=>history.push(`/clients/edit/${client.docId}`)}
  const buildRow = (client: Client, idx: number) => (
    <tr key={idx} onClick={()=>history.push(`/clients/manage/${client.uid}`)}>
      <td>{client.lastName}</td>
      <td>{client.firstName}</td>
      <td>{client.email}</td>
      <td>
        <ClientTypeBadge clientType={client.clientType}/>
      </td>
    </tr>
  );

  const sortedClients = clients.sort((a, b) => {
    if (a.lastName < b.lastName) {
      return -1;
    }
    if (a.lastName > b.lastName) {
      return 1;
    }
    return 0;
  })

  let filteredClients = sortedClients.filter(c => {
    const searchString = `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase();
    return searchString.includes(search.toLowerCase());
  });

  if (clientTypeFilter>-1) {
    filteredClients = filteredClients.filter( c => c.clientType === clientTypeFilter);
  }

  return (
    <PageContainer title="Clients"
                   loading={loading}
                   rightSide={<ClientTypeSwitch onChange={(value) => setClientTypeFilter(value)}
                                                value={clientTypeFilter}/>}>
      <Form.Group>
        <Form.Control type="text" placeholder="search" onChange={event => {
          setSearch(event.target.value.toLowerCase())
        }} value={search}/>
      </Form.Group>
      <Link to="/clients/edit/new"><FaPlusCircle/> Add new client</Link>
      {clientTypeFilter !== -1 ? <Alert variant="info" className="mt-2">Showing a subset of all clients because filter is on.</Alert> : null}
      <Table striped bordered hover className="mt-3">
        <thead>
        <tr>
          <th>Last Name</th>
          <th>First Name</th>
          <th>Email</th>
          <th/>
        </tr>
        </thead>
        <tbody>
        {filteredClients.map(buildRow)}
        </tbody>
      </Table>
      {!clients.length && <p className="text-muted font-italic">No clients found.</p>}
    </PageContainer>
  );
};
