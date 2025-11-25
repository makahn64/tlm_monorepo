import React, {FC, useEffect, useState} from 'react';
import {Form} from "react-bootstrap";
import * as _ from 'lodash';

interface OwnProps {
  label: string;
  onChange: (field: string, value: any) => void;
  value: string[];
  fieldName: string;
  allChoices: string[];
}

type Props = OwnProps;

export const CheckboxGroupStringArrays: FC<Props> = ({label, onChange, value, fieldName, allChoices}) => {

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
        key={c}
        label={c}
        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => checkChanged(c, ev.target.checked)}
        checked={trueValues.includes(c)}
      />);
  }

  return (
    <Form.Group controlId={label}>
      <Form.Label>{label}</Form.Label>
      {renderBoxes()}
    </Form.Group>
  );
};
