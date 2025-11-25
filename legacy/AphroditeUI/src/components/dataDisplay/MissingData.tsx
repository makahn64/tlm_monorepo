import React, { FC } from 'react';
import {Link} from "react-router-dom";

interface MDProps {
  id: string;
}

export const MissingData: FC<MDProps> = ({id}) => (
  <span className="text-danger">Not entered, <Link to={`/clients/edit/${id}`}>check profile.</Link></span>);
