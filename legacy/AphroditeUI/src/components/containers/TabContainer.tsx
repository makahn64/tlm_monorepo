import React, { FC } from 'react';
import { Container } from "react-bootstrap";

interface OwnProps {}

type Props = OwnProps;

export const TabContainer: FC<Props> = ({ children}) => {
  return (
    <Container className="mt-4" fluid>
    { children }
  </Container> );
};
