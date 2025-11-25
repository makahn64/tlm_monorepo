import React, { FC } from 'react';
import {Form} from "react-bootstrap";

interface Props {
  checked: boolean;
  fieldName: string;
  onChange: (field: string, state: boolean) => void;
  label: string;
}

export const Switch: FC<Props> = ({ checked, fieldName, onChange, label}) => {
  return (
    <Form.Check
      type="switch"
      id="active-switch"
      label={label}
      checked={checked}
      onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
        const c = ev.target.checked;
        onChange(fieldName, c);
      }}
    />
  );
};
