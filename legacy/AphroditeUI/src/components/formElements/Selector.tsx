import React, { FC, useEffect } from 'react';
import {Form} from "react-bootstrap";
import {ValueDescription} from "tlm-common";
import * as _ from 'lodash';

type StringOrNumberArray = ( string | number )[];

interface OwnProps {
  label: string;
  onChange: (field: string, value: any) => void;
  value: any;
  options: string[] | number[] | ValueDescription[];
  fieldName: string;
  multiple?: boolean;
}

type Props = OwnProps;

export const Selector: FC<Props> = ({ label, onChange, options, value, fieldName, multiple}) => {

  useEffect(()=>{
    // Handle case where nothing has been chosen yet
    if (value===undefined){
      onChange(fieldName, options[0])
    }
  }, [fieldName, onChange, options, value])

  if (!options.length) {
    return null;
  }

  const renderOptions = () => {
    const stringArray = _.isString(options[0]);
    const numberArray = _.isNumber(options[0]);
    let optionArray: ValueDescription[];
    if (stringArray || numberArray){
      optionArray = (options as StringOrNumberArray).map( o => ({ value: o, description: o})) as ValueDescription[];
    } else {
      optionArray = options as ValueDescription[];
    }
    return optionArray.map( ({ value, description }) => <option value={value}>{description}</option>)
  }

  return (
    <Form.Group controlId={label}>
      <Form.Label>{label}</Form.Label>
      <Form.Control as="select" onChange={event => {
        onChange(fieldName, event.target.value)}} value={value} multiple={multiple}>
        { renderOptions() }
      </Form.Control>
    </Form.Group>
  );
};
