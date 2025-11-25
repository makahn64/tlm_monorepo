import React, {FC} from 'react';
import {Form} from "react-bootstrap";
import {BooleanCheckboxGroupEntry} from "../../types/commonTypes";

interface OwnProps {
  label: string;
  onChange: (field: string, value: boolean) => void;
  values: BooleanCheckboxGroupEntry[];
}

export const CheckboxGroupBooleans: FC<OwnProps> = ({label, onChange, values}) => {

  const renderBoxes = () => {
    return values.map( ( value, index) =>
      <Form.Check
        type="checkbox"
        key={value.fieldName}
        label={value.label}
        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => onChange(value.fieldName, ev.target.checked)}
        checked={value.value}
      />);
  }

  return (
    <Form.Group controlId={label}>
      <Form.Label>{label}</Form.Label>
      {renderBoxes()}
    </Form.Group>
  );
};
