import React, {FC, PropsWithChildren} from 'react';
import {Col, Container, Row} from "react-bootstrap";

interface Props {
  title?: string;
  loading?: boolean;
  rightSide?: JSX.Element;
}

export const PageContainer: FC<PropsWithChildren<Props>> = ({loading, title, children, rightSide}) => {
  return (
    <div className="page-container p-3" style={{marginTop: 30}}>
          { title && <h1>{title}<span className="float-right">{rightSide}</span> </h1> }
          {loading && <p className="text-muted font-italic">Loading...</p>}
          {!loading && children}
    </div>
  );
};
