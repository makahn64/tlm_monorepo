import React, { FC } from 'react';
import {Col, Container, Row} from "react-bootstrap";

interface OwnProps {}

type Props = OwnProps;

export const PinkPage: FC<Props> = (props) => {

  return (
      <Container style={styles.container}>
          <Row>
              <Col>
                  <p>Pink Screen</p>
              </Col>
          </Row>
      </Container>
  );
};

const styles = {
    container: {
        backgroundColor: 'salmon',
        width: '100%',
        minHeight: '500px',
        marginTop: '50px'
    }
}

