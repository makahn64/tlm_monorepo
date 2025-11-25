import React, {FC, useState} from 'react';
import {Navbar, Nav, Button, Form, Badge} from 'react-bootstrap';
import logo from '../../assets/images/tlm-white.png';
import { auth } from '../../services/firebase/firebaseCore';
import { Link } from 'react-router-dom';
import {useAuthState} from "../../services/firebase/AuthProvider";

const LEFT_LINKS = [
  { label: 'HOME', link: '/'},
]

const RIGHT_LINKS: typeof LEFT_LINKS= [
  // { label: 'ACCOUNT', link: '/clients/list'},
]

export const ClientPortalNavbar: FC = (props) => {

  const { userProfile } = useAuthState();

  const handleLogout = async () => {
    await auth.signOut();
  }

  return (
    <Navbar
      style={{ opacity: 0.8, backgroundColor: '#000000'}}
      expand="md" className="navshadow" variant={'dark'}>
      <Navbar.Brand>
        <img src={logo} style={styles.navlogo}/>
      </Navbar.Brand>
      <Navbar.Toggle/>
      <Navbar.Collapse id="tlm-navbar-toplevel">
        <Nav className="mr-auto">
          { LEFT_LINKS.map(({link, label}) => <Nav.Link to={link} as={Link}>{label}</Nav.Link>)}
          { RIGHT_LINKS.map(({link, label}) => <Nav.Link to={link} as={Link}>{label}</Nav.Link>)}
        </Nav>
        <Form inline>
          <span className="mr-4 mb-1">
             <Badge variant="secondary">{userProfile?.displayName}</Badge>
          </span>
          <Button onClick={handleLogout} size="sm" variant="outline-primary">Logout</Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

const styles = {
  navlogo: {
    maxHeight: '30px',
    marginLeft: '10px',
    marginRight: '50px'
  },
  gapRight: {
    marginRight: '10px'
  }
}
