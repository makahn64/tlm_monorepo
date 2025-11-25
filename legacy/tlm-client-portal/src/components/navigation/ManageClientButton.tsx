import React, { FC } from 'react';
import { Client } from "tlm-common";
import { DropdownButton, Dropdown } from "react-bootstrap";
import {useHistory} from 'react-router-dom';

interface Props {
  client: Client;
}

export const ManageClientButton: FC<Props> = ({client}) => {
  const history = useHistory();
  return (
    <DropdownButton title="Manage Client" size="sm">
      <Dropdown.Item onClick={() => history.push(`/clients/workouts/${client.uid}`)}>Manage workouts</Dropdown.Item>
      <Dropdown.Item onClick={() => history.push(`/clients/details/${client.uid}`)}>Client profile</Dropdown.Item>
      <Dropdown.Item onClick={() => history.push(`/clients/edit/${client.uid}`)}>Edit client
        profile</Dropdown.Item>
    </DropdownButton>
  );
};
