import React, {FC, useState} from 'react';
import {Form} from "react-bootstrap";
import {NameAndEmail} from "tlm-common";

interface OwnProps {
  contactInfo: NameAndEmail;
  onChange: (fieldName: string, value: any) => void,
  hidePhone?: boolean;
}

type Props = OwnProps;

export const ClientContactForm: FC<Props> = ({contactInfo, onChange, hidePhone = false}) => {

  const {firstName, lastName, email, mobilePhone} = contactInfo;
  const [localPhone, setLocalPhone] = useState<number | ''>(mobilePhone || '');
  const [invalidPhone, setInvalidPhone] = useState(false);

  const handlePhoneDigits = (d: string) => {
    // check for just digits
    if (/^\d*$/.test(d)) {
      const numVal = parseInt(d);
      if (!isNaN(numVal)) {
        onChange('mobilePhone', numVal);
        setLocalPhone(numVal);
        setInvalidPhone(false);
      } else {
        // empty string
        setLocalPhone('');
      }
    } else {
      setInvalidPhone(true);
    }
  }

  return (
    <Form className="mt-3">
      <Form.Group controlId="firstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control type="text" placeholder="First Name" onChange={event => {
          onChange("firstName", event.target.value)
        }} value={firstName}/>
      </Form.Group>
      <Form.Group controlId="lastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control type="text" placeholder="Last Name" onChange={event => {
          onChange("lastName", event.target.value)
        }} value={lastName}/>
      </Form.Group>
      <Form.Group controlId="email">
        <Form.Label>Email Address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" onChange={event => {
          onChange("email", event.target.value)
        }} value={email}/>
      </Form.Group>
      {hidePhone ? null :
        <Form.Group controlId="phone">
          <Form.Label>Mobile Phone [optional, used for notifications later]</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter phone number, only digits!"
            onChange={event => {
              console.log(event.target.value);
              handlePhoneDigits(event.target.value);
            }}
            isInvalid={invalidPhone}
            value={localPhone}/>
        </Form.Group>}
    </Form>);
};
