import React, {FC, useState} from 'react';
import {Navbar, Nav, Button, Form, Badge} from 'react-bootstrap';
import logo from '../../assets/images/tlm.png';
import { auth } from '../../services/firebase/firebaseCore';
import { Link } from 'react-router-dom';
import {useAuthState} from "../../services/firebase/AuthProvider";

const TOP_LINKS = [
  { label: 'Dashboard', link: '/dash'},
  { label: 'Clients', link: '/clients/list'},
  { label: 'Exercises', link: '/exercises/list'},
]

const ADMIN_LINKS = [
  { label: 'TLM Team', link: '/users/list'},
  { label: 'Media', link: '/media'},

]

interface OwnProps {
}

type Props = OwnProps;

export const TLMNavbar: FC<Props> = (props) => {
  const { isAdmin, isTrainer, userProfile } = useAuthState();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
  }

  return (
    <Navbar bg="light" expand="md" fixed="top" className="navshadow">
      <Navbar.Brand>
        <img src={logo} style={styles.navlogo}/>
      </Navbar.Brand>
      <Navbar.Toggle/>
      <Navbar.Collapse id="tlm-navbar-toplevel">
        <Nav className="mr-auto">
          { TOP_LINKS.map(({link, label}) => <Nav.Link to={link} as={Link}>{label}</Nav.Link>)}
          { isAdmin && ADMIN_LINKS.map(({link, label}) => <Nav.Link to={link} as={Link}>{label}</Nav.Link>)}
        </Nav>
        <Form inline>
          <span className="mr-2">
             <Badge variant="secondary">{userProfile?.displayName}</Badge>
            { isAdmin && <Badge>ADMIN</Badge> }
            { isTrainer && <Badge>TRAINER</Badge> }
          </span>
          <Button onClick={handleLogout} size="sm" variant="outline-primary">Logout</Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

const styles = {
  navlogo: {
    maxHeight: '40px',
    marginLeft: '10px',
    marginRight: '50px'
  },
  gapRight: {
    marginRight: '10px'
  }
}
