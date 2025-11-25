import React, {FC} from 'react';
import {Col, Form, Row} from "react-bootstrap";
import { Client } from 'tlm-common';
import {CheckboxGroupBooleans} from "../../components/formElements/CheckboxGroupBooleans";
import { EQUIPMENT } from "tlm-common";

type Props = {
  client: Client;
  onChange: (fieldName: string, value: any) => void
}

export const EquipmentForm: FC<Props> = ({client, onChange}) => {

  const binaryValues = EQUIPMENT.map((eq) => {
    const {fieldName} = eq;
    const value = !!(client as any)[fieldName];
    return {...eq, value}
  });

  return (
    <Form className="mt-3">
      <Row>
        <Col>
          <CheckboxGroupBooleans label="Equipment" onChange={onChange} values={binaryValues}/>
        </Col>
      </Row>
    </Form>
  );
};
