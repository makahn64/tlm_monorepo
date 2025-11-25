import React, {FC, useEffect, useState} from 'react';
import {PageContainer} from "../../components/containers/PageContainer";
import * as api from "../../services/api";
import {Table, Badge} from 'react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
import {FaPlusCircle} from 'react-icons/fa';
import { toast } from 'react-toastify';
import {User} from "tlm-common";

export const UserListPage: FC = () => {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    loadUsers();
  }, [])

  async function loadUsers() {
    try {
      const c = await api.users.getAllUsers();
      setUsers(c as User[]);
    } catch (e) {
      toast(e.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = () => {
    console.log('doink');
  }

  //
  const buildRow = (user: User, idx: number) => (
    <tr key={idx} onClick={()=>history.push(`/team/edit/${user.uid}`)}>
      <td>{user.lastName}</td>
      <td>{user.firstName}</td>
      <td>{user.email}</td>
      <td>
        { user.isAdmin && <Badge variant="danger">ADMIN</Badge>}{' '}
        { user.isTrainer && <Badge variant="primary">TRAINER</Badge>}
      </td>
    </tr>
  );

  const sortedUsers = users.sort((a,b)=> {
    if(a.lastName < b.lastName) { return -1; }
    if(a.lastName > b.lastName) { return 1; }
    return 0;
  })

  return (
    <PageContainer title="Team Members" loading={loading}>
      <Link to="/team/edit/new"><FaPlusCircle/> Add new team member  </Link>
      <Table striped bordered hover className="mt-3">
        <thead>
        <tr>
          <th>Last Name</th>
          <th>First Name</th>
          <th>Email</th>
          <th>Roles</th>
        </tr>
        </thead>
        <tbody>
        {users.map(buildRow)}
        </tbody>
      </Table>
      {!users.length && <p className="text-muted font-italic">No portal users found.</p>}
    </PageContainer>
  );
};
