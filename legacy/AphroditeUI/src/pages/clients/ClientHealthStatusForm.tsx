import React, {FC} from 'react';
import {Col, Form, Row} from "react-bootstrap";
import {CheckboxGroupBooleans} from "../../components/formElements/CheckboxGroupBooleans";
import {BINARY_INJURIES, NON_BINARY_PROFILE_SETTINGS} from "tlm-common";
import DatePicker from "react-datepicker";
import {FormLabel} from "../../components/Typography";
import {Selector} from "../../components/formElements/Selector";
import {GapSize, VerticalGap} from "../../components/layout/VerticalGap";
import {Switch} from "../../components/formElements/Switch";
import { Client } from 'tlm-common';

interface OwnProps {
  client: Client;
  onChange: (fieldName: string, value: any) => void
}

type Props = OwnProps;

export const ClientHealthStatusForm: FC<Props> = ({client, onChange}) => {

  const binaryValues = BINARY_INJURIES.map((injury) => {
    const {fieldName, label} = injury;
    const value = !!(client as any)[fieldName];
    return {...injury, value}
  });

  const dueDate = client.dueDate ? new Date(client.dueDate) : new Date();

  return (
    <Form className="mt-3">
      <Row>
        <Col>
          <FormLabel>{client.isPregnant ? "Due Date" : "Birth Date"}</FormLabel>
          <DatePicker selected={dueDate}
                      onChange={(date) =>{
                        const d = date ? (date as Date).toISOString() : new Date().toISOString();
                        onChange('dueDate',d );
                      }}
                      title={client.isPregnant ? "Due Date" : "Birth Date"}/>
          <VerticalGap gapSize={GapSize.md}/>
          <Switch
            checked={client.isPregnant}
            fieldName={'isPregnant'}
            onChange={onChange}
            label={'Client is pregnant'}/>
          <VerticalGap gapSize={GapSize.md}/>
          <Selector label="Fitness Level" onChange={onChange} value={client.fitnessLevel}
                    options={NON_BINARY_PROFILE_SETTINGS.fitnessLevel}
                    fieldName="fitnessLevel"/>
          <VerticalGap gapSize={GapSize.md}/>
          <Selector label="Posture" onChange={onChange} value={client.posture}
                    options={NON_BINARY_PROFILE_SETTINGS.posture}
                    fieldName="posture"/>
          <VerticalGap gapSize={GapSize.md}/>
          <Selector label="Back Pain" onChange={onChange} value={client.backPain}
                    options={NON_BINARY_PROFILE_SETTINGS.backPain}
                    fieldName="backPain"/>
        </Col>
        <Col>
          <CheckboxGroupBooleans label="" onChange={onChange} values={binaryValues}/>
        </Col>
      </Row>
    </Form>
  );
};
