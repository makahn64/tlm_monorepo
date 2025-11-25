import React, {FC, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {auth} from "../../services/firebase/firebaseCore";
import logo from '../../assets/images/tlm.png';

interface OwnProps {
}

type Props = OwnProps;

export const LoginPage: FC<Props> = (props) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorModalMsg, setErrorModalMsg] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(`${email}/${password}`);
    try {
      await auth.signInWithEmailAndPassword(email, password);
      console.log('Signed in!');
    } catch (e) {
      console.log('No bueno');
      console.log(e);
      setErrorModalMsg(e.code);
    }
  }

  return (
    <div className="d-flex flex-xl-column justify-content-center" style={styles.page}>
      <div className="d-flex p-3 flex-column align-self-center" style={styles.loginBox}>
        <img src={logo} style={styles.logo}/>
        <Form className="mt-5" onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            {/*<Form.Label>Email Address</Form.Label>*/}
            <Form.Control type="email" placeholder="Enter email" onChange={event => {
              setEmail(event.target.value)
            }}/>
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            {/*<Form.Label>Password</Form.Label>*/}
            <Form.Control type="password" placeholder="Password" onChange={event => {
              setPassword(event.target.value)
            }}/>
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Submit
          </Button>
        </Form>
      </div>
      <Modal show={!!errorModalMsg} onHide={() => setErrorModalMsg(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Error Logging In</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorModalMsg}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setErrorModalMsg(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const styles = {
  page: {
    height: '100vh',
    padding: 10
  },
  loginBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    minWidth: '90%',
  },
  logo: {
    margin: '0 auto',
    width: '200px'
  },
}

