import React, { FC } from 'react';
import { ClientType, ClientTypeDescriptions } from "tlm-common";
import {Badge} from "react-bootstrap";

interface Props {
  clientType: ClientType
}

const VARIANTS = {
  [ClientType.active as number]: 'success',
  [ClientType.lead as number]: 'warning',
  [ClientType.paused as number]: 'secondary',
  [ClientType.pastDue as number]: 'danger',
  [ClientType.archived as number]: 'secondary',
}

export const ClientTypeBadge: FC<Props> = ({clientType}) => {


  return (
    <Badge variant={VARIANTS[clientType]} className="text-white w-50">{ClientTypeDescriptions[clientType]}</Badge>
  );
};
