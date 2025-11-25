import React, { FC } from 'react';
import {Dropdown} from "react-bootstrap";

interface Props {
  buttonLabel?: string;
  clientId: string;
  variant?: string;
}

export const ClientActionMenu: FC<Props> = ({ buttonLabel, variant, clientId, ...rest }) => {

  return (
    <Dropdown>
      <Dropdown.Toggle variant={ variant || 'primary'}>
        {buttonLabel}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href={`/clients/manage/${clientId}`}>Client Dashboard</Dropdown.Item>
        <Dropdown.Item href={`/clients/addworkout/${clientId}/new`}>Add New Workout</Dropdown.Item>
        <Dropdown.Item href={`/clients/workouthistory/${clientId}`}>Workout History</Dropdown.Item>
        <Dropdown.Item href={`/clients/notes/${clientId}`}>Client Notes</Dropdown.Item>
        <Dropdown.Item href={`/clients/addrecommendation/${clientId}`}>Send Recommended Video</Dropdown.Item>
        <Dropdown.Divider/>
        <Dropdown.Item href={`/clients/details/${clientId}`}>Client Profile</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
