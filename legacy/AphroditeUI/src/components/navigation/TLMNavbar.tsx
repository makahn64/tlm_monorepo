import React, {FC, useState} from 'react';
import {Dropdown, Nav, Navbar} from 'react-bootstrap';
import logo from '../../assets/images/tlm.png';
import {auth} from '../../services/firebase/firebaseCore';
import {Link} from 'react-router-dom';
import {useAuthState} from "../../services/firebase/AuthProvider2State";
import Avatar from "react-avatar";
import {THEME_COLORS} from "../../assets/styles/themecolors";

const TOP_LINKS = [
  {label: 'Dashboard', link: '/dash'},
  {label: 'Clients', link: '/clients/list'},
  {label: 'Exercises', link: '/exercises/list'},
  {label: 'Prebuilt Workouts', link: '/workouts/list'},

]

const ADMIN_LINKS = [
  {label: 'TLM Team', link: '/team/list'},
  {label: 'Leads', link: '/leads/list'}
]

const AccountMenu: FC = () => {
  const handleLogout = async () => {
    await auth.signOut();
  }

  return (
    <Dropdown drop="down" className="mr-2 nav-item">
      <Dropdown.Toggle variant="link" size="sm" className="nav-link">
        Account
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item as={Link} to="/account">Manage Account</Dropdown.Item>
        <Dropdown.Divider/>
        <Dropdown.Item onClick={handleLogout} className="text-danger">Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

const MediaMenu: FC = () => {
  return (
    <Dropdown drop="down" className="mr-2 nav-item">
      <Dropdown.Toggle variant="link" className="nav-link">
        Media
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item as={Link} to="/media/type/education">Educational Videos</Dropdown.Item>
        <Dropdown.Item as={Link} to="/media/type/foryou">For You Videos</Dropdown.Item>
        <Dropdown.Divider/>
        <Dropdown.Item as={Link} to="/media/all">Raw Media List</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export const TLMNavbar: FC = () => {
  const {isAdmin, isTrainer, userProfile} = useAuthState();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Navbar bg="light" expand="md" className="navshadow">
      <Navbar.Brand>
        <img src={logo} style={styles.navlogo}/>
      </Navbar.Brand>
      <Navbar.Toggle/>
      <Navbar.Collapse id="tlm-navbar-toplevel">
        <Nav className="mr-auto">
          {TOP_LINKS.map(({link, label}) => <Nav.Item key={label}><Nav.Link to={link} as={Link}>{label}</Nav.Link></Nav.Item>)}
          {isAdmin &&
          <>
            {ADMIN_LINKS.map(({link, label}) => <Nav.Link to={link} as={Link} key={label}>{label}</Nav.Link>)}
              <MediaMenu/>
          </>}
        </Nav>
        <Nav>
          <AccountMenu/>
        </Nav>
        <Avatar name={userProfile?.displayName!} size="40" round={true} color={THEME_COLORS.steelPurple}
                className="ml-2 mr-2"/>
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
