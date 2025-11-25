import React, {FC, useState} from 'react';
import {PageContainer} from "../../components/containers/PageContainer";
import {useHistory, useParams} from 'react-router-dom';
import {Alert, Button, Form, Modal} from "react-bootstrap";
import * as api from '../../services/api';
import {ClientContactForm} from "../clients/ClientContactForm";
import {useUser} from "../../hooks/useUser";
import {useUI} from "../../services/ui/UIProvider";
import {toast} from "react-toastify";

interface OwnProps {
}

type Props = OwnProps;

export const AddEditUserPage: FC<Props> = (props) => {

  const {id} = useParams<{ id: string }>();
  const {user, setUser, loading} = useUser(id);
  const [alertText, setAlertText] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const { showLoader } = useUI();
  const history = useHistory();

  const existingUser = id !== 'new';
  const pageTitle = existingUser ? "Edit TLM Team Member" : "Add TLM Team Member";

  const createNewUser = async () => {
    console.log('Adding user');
    showLoader(true);
    try {
      const newAccount: object = await api.users.createPortalUser({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        isTrainer: user.isTrainer
      });
      // @ts-ignore
      await api.users.modifyFields(newAccount.body.uid, user);
      showLoader(false);
      history.goBack();
    } catch (e) {
      setAlertText(e.message);
      showLoader(false);
    }
  }

  const modifyUser = async () => {
    console.log('Modifying user');
    try {
      showLoader(true);
      await api.users.modifyFields(id, user);
      showLoader(false);
      history.goBack();
    } catch (e) {
      setAlertText(e.message);
      showLoader(false);
    }
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!existingUser) {
      await createNewUser();
    } else {
      await modifyUser();
    }
  }

  const handleDelete = async () => {
    setShowModal(true);
  }

  const confirmDelete = async (confirmed: boolean) => {
    setShowModal(false);
    if (confirmed) {
      showLoader(true);
      try {
        // this goes to the GCF
        await api.users.deletePortalUser(id);
        toast.success('Buh bye');
        history.goBack();
      } catch (e) {
        toast.error(`That ain't gonna work!`);
        toast.error(e.message);
      } finally {
        showLoader(false);
      }
    }
  }

  const handleFieldChange = (fieldName: string, value: any) => {
    const moddedUser = {...user, [fieldName]: value};
    console.log(moddedUser);
    setUser(moddedUser);
  }

  return (
    <PageContainer title={pageTitle} loading={loading}>
      {alertText && <Alert variant="danger" onClose={() => setAlertText('')} dismissible>
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
        <p>{alertText}</p>
      </Alert>}
      <Button onClick={handleSubmit} className="float-right">SAVE</Button>
      {id !== 'new' ? <h4 className="text-muted">{user.firstName} {user.lastName}</h4> : null}
      <ClientContactForm contactInfo={user} onChange={handleFieldChange} hidePhone={true}/>
      <Form.Check
        type="switch"
        id="active-switch"
        label="Admin"
        checked={user.isAdmin}
        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
          const c = ev.target.checked;
          handleFieldChange('isAdmin', c);
        }}
      />
      <Form.Check
        type="switch"
        id="active-switch2"
        label="Trainer"
        checked={user.isTrainer}
        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
          const c = ev.target.checked;
          handleFieldChange('isTrainer', c);
        }}
      />
      {existingUser && <Button variant="danger" onClick={handleDelete} className="mt-3">Delete User</Button>}
      <Modal show={showModal} onHide={() => confirmDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to delete user {user?.email}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => confirmDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => confirmDelete(true)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </PageContainer>
  );
};
