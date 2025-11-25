import React, {FC, useEffect, useState} from 'react';
import {Form} from "react-bootstrap";
import * as _ from 'lodash';
import {ValueDescription} from "tlm-common";

type Props = {
  label: string;
  onChange: (field: string, value: any) => void;
  value: string[];
  fieldName: string;
  allChoices: ValueDescription[];
}

export const CheckboxGroupValueDescriptionArrays: FC<Props> = ({label, onChange, value, fieldName, allChoices}) => {

  const [ trueValues, setTrueValues ] = useState(value);

  const checkChanged = ( choice: string, isChecked: boolean ) => {
    const newVals = isChecked ? _.uniq([...trueValues, choice]) : _.without(trueValues, choice);
    setTrueValues(newVals);
    onChange(fieldName, newVals);
  }

  const renderBoxes = () => {
    return allChoices.map(c =>
      <Form.Check
        type="checkbox"
        key={c.value}
        label={c.description}
        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => checkChanged(c.value as string, ev.target.checked)}
        checked={trueValues.includes(c.value as string)}
      />);
  }

  return (
    <Form.Group controlId={label}>
      <Form.Label>{label}</Form.Label>
      {renderBoxes()}
    </Form.Group>
  );
};
