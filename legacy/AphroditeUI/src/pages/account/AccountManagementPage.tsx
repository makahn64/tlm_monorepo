import React, {FC, useEffect, useState} from 'react';
import {Badge, Button, Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import {VerticalGap} from "../../components/layout/VerticalGap";
import * as api from "../../services/api";
import {auth} from "../../services/firebase/firebaseCore";
import {toast} from "react-toastify";
import {useUI} from "../../services/ui/UIProvider";
import { validatePassword } from 'tlm-common';
import firebase from "firebase/app";
import {useAuthState} from "../../services/firebase/AuthProvider2State";
import {PageContainer} from "../../components/containers/PageContainer";


export const AccountManagementPage: FC = () => {
  const {userProfile, isAdmin, isTrainer} = useAuthState();
  const [displayName, setDisplayName] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');
  const [pwd1, setPwd1] = useState<string>('');
  const [pwd2, setPwd2] = useState<string>('');
  const { showLoader } = useUI();

  useEffect(() => {
    if (userProfile){
      setDisplayName(userProfile.displayName!);
    }
  }, [userProfile]);

  const handleNameChange = async () => {
    try {
      showLoader(true);
      await auth.currentUser!.updateProfile({ displayName});
      toast.success('Name changed!');
    } catch (e) {
      toast.error(e.message);
    } finally {
      showLoader(false);
    }
  }

  const handlePwdChange = async () => {
    try {
      showLoader(true);
      const user = auth.currentUser;
      const credential = firebase.auth.EmailAuthProvider.credential(
        user!.email!,
        pwd
      );
      await user!.reauthenticateWithCredential(credential);
      await auth.currentUser!.updatePassword(pwd1);
      toast.success('Password changed!');
      setPwd('');
      setPwd1('');
      setPwd2('');
    } catch (e) {
      toast.error(e.message);
    } finally {
      showLoader(false);
    }
  }

  const showPwd1Invalid = pwd1.length > 1 && !validatePassword(pwd1);
  const passwordsGood = validatePassword(pwd1) && (pwd1===pwd2);

  return (
    <PageContainer>
      <VerticalGap gapSize={30}/>
      <Container>
        <Row>
          <Col>
            <h2 className="mb-4">Account Management for {displayName}</h2>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6}>
            <div className="shadow p-4">
              <h4>Name</h4>
              <Form className="mt-0">
                <Form.Group controlId="formBasicEmail">
                  {/*<Form.Label>Email Address</Form.Label>*/}
                  <Form.Control
                    type="text"
                    placeholder="your name"
                    onChange={event => {
                      setDisplayName(event.target.value)
                    }}
                    value={displayName}/>
                </Form.Group>
              </Form>
              <Button variant="outline-primary"
                      size="sm"
                      onClick={handleNameChange}
                      disabled={ !displayName }
                      className="mb-3 mt-3">
                change name
              </Button>
            </div>
            <div className="shadow p-4 mt-3">
              <h4>Roles</h4>
              { isAdmin && <Badge variant="danger">ADMIN</Badge>}{' '}
              { isTrainer && <Badge variant="primary">TRAINER</Badge>}
            </div>
          </Col>
          <Col sm={12} md={6}>
            <div className="shadow p-4">
              <h4>Password</h4>
              <Form className="mt-0" noValidate>
                <Form.Group>
                  <Form.Control
                    type="password"
                    placeholder="current password"
                    onChange={event => {
                      setPwd(event.target.value)
                    }}
                    value={pwd}/>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Control
                      type="password"
                      placeholder="new password"
                      isInvalid={showPwd1Invalid}
                      onChange={event => {
                        setPwd1(event.target.value)
                      }}
                      value={pwd1}/>
                    <Form.Control.Feedback type="invalid">
                      Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, and one number.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Control
                    type="password"
                    placeholder="new password again"
                    isInvalid={pwd1!==pwd2 && pwd.length < 7}
                    onChange={event => {
                      setPwd2(event.target.value)
                    }}
                    value={pwd2}/>
                  <Form.Control.Feedback type="invalid">
                    Passwords must match.
                  </Form.Control.Feedback>
                </Form.Group>
              </Form>
              { passwordsGood && <p className="text-success ml-3">✅ Good to go!</p> }
              <Button variant="outline-primary"
                      size="sm"
                      className="mb-3 mt-3"
                      disabled={!passwordsGood}
                      onClick={handlePwdChange}
              >
                change password
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </PageContainer>
  );
};


