import React, {FC } from 'react';
import {Button, Col, Container, Row } from "react-bootstrap";
import * as api from '../../services/api';
import {PageContainer} from "../../components/containers/PageContainer";
import * as faker from 'faker';

export const FakerPage: FC = () => {

  const fakeIt = async () => {
    console.log('Adding client');
    const firstName = faker.name.firstName(1);
    const lastName = faker.name.lastName(1);
    const email = faker.internet.email(firstName, lastName);

    const newAccount: object = await api.clients.createClient({
      firstName,
      lastName,
      email
    });

    console.log(newAccount);
    // @ts-ignore
   // await api.clients.modifyFields(newAccount.body.uid,client);
  }

  return (
    <PageContainer title="Faker">
      <Container>
        <Row>
          <Col>
            <h1>Clients</h1>
            <Button onClick={fakeIt}>Generate Clients</Button>
          </Col>
        </Row>
      </Container>
    </PageContainer>
  );
};


