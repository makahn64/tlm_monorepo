import React, {FC} from 'react';
import {Col, Container, Row} from "react-bootstrap";

interface OwnProps {
}

type Props = OwnProps;

export const TealPage: FC<Props> = (props) => {

  return (
    <Container style={styles.container}>
      <Row>
        <Col>
          <p>Teal Screen</p>
        </Col>
      </Row>
    </Container>
  );
};

const styles = {
  container: {
    backgroundColor: 'teal',
    width: '100%',
    minHeight: '500px',
    marginTop: '50px'
  }
}

