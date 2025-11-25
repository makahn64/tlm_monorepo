import React, {FC} from 'react';
import moment from "moment";
import {BadgesFromArray} from "../badges/BadgesfromArray";
import {mapBinaryInjuriesToStringArray, mapEquipmentToStringArray} from "tlm-common";
import {Badge} from "react-bootstrap";
import { Client } from 'tlm-common';
import { MissingData } from '../dataDisplay/MissingData';

interface Props {
  client: Client;
}

export const ProfileCard: FC<Props> = ({client}) => {
  return (
    <div>
      <h5>Profile</h5>
      <p>{client.isPregnant ? "Due Date" : "Birth Date"}: {client.dueDate ? moment(client.dueDate).format('MM/DD/YYYY') : <MissingData id={client.uid}/>}</p>
      <p>Injuries: <BadgesFromArray data={mapBinaryInjuriesToStringArray(client)} variant="danger"/></p>
      { client.backPain !== 'none' ? <Badge variant="danger" className="mr-1">Back pain: {client.backPain}</Badge> : null }
      { client.sciatica !== 'none' ? <Badge variant="danger" className="mr-1">Sciatica: {client.sciatica}</Badge> : null }
      { client.cSection ? <Badge variant="primary" className="mr-1">cSection: {client.cSection || 'no'}</Badge> : null }
      <p>Posture: <Badge variant="primary" className="mr-1">{client.posture}</Badge></p>
      <p>Equipment: <BadgesFromArray data={mapEquipmentToStringArray(client)}/></p>
      <h5>Contact Info</h5>
      <p>Mobile phone: <span className={client.mobilePhone?"font-bold":"text-danger"}>{ client.mobilePhone || 'not entered'}</span></p>
    </div>
  );
};
