import React, {FC, PropsWithChildren} from 'react';
import {Col, Container, Row} from "react-bootstrap";

interface Props {
  title: string;
  loading?: boolean;
  rightSide?: JSX.Element;
}

export const PageContainer: FC<PropsWithChildren<Props>> = ({loading, title, children, rightSide}) => {
  return (
    <Container className="page-container p-2" style={{marginTop: 100}}>
      <Row>
        <Col>
          <h1>{title}<span className="float-right">{rightSide}</span> </h1>
          {loading && <p className="text-muted font-italic">Loading...</p>}
          {!loading && children}
        </Col>
      </Row>
    </Container>
  );
};
