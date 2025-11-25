import React, { FC } from 'react';
import {Badge} from "react-bootstrap";

interface OwnProps {
  data: (string|number)[];
  emptyMessage?: string;
}

export const BadgesFromArray: FC<OwnProps> = ({ data, emptyMessage }) => {
  if (!data || data.length === 0){
    if (emptyMessage){
      return <p className="text-muted">{emptyMessage}</p>
    } else {
      return null;
    }
  }

  return (
    <>
      { data.map( (d,idx) => <Badge variant="primary" className="mr-1" key={`${d}:${idx}`}>{d}</Badge>)}
    </>
  );
};
