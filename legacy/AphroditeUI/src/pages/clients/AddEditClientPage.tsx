import React, {FC, useEffect, useState} from 'react';
import {PageContainer} from "../../components/containers/PageContainer";
import { useParams } from 'react-router-dom';
import {Alert, Button, Modal, Tab, Tabs} from "react-bootstrap";
import * as api from '../../services/api';
import { useHistory } from 'react-router-dom';
import {ClientTypeOptions, ClientType} from "tlm-common";
import {ClientContactForm} from "./ClientContactForm";
import {ClientHealthStatusForm} from "./ClientHealthStatusForm";
import {EquipmentForm} from "./EquipmentForm";
import {TabContainer} from "../../components/containers/TabContainer";
import {useClient} from "../../hooks/useClient";
import {Selector} from "../../components/formElements/Selector";
import {useUI} from "../../services/ui/UIProvider";
import {toast} from "react-toastify";

export interface Props {
  id: string;
  onLoading?: (loading: boolean) => void;
  preload?: { firstName: string; lastName: string; email: string };
  onCancel?: () => void;
}

export const AddEditClientComponent: FC<Props> = ({id, onLoading, preload, onCancel}) => {
  const { client, setClient, loading } = useClient(id);
  const [ showModal, setShowModal ] = useState(false);
  const history = useHistory();
  const { showLoader } = useUI();
  const existingClient = id !== 'new';

  useEffect(() => {
    if (preload){
      setClient({...client, ...preload, clientType: ClientType.lead});
    }
  }, [preload])

  // didn't work, fuck it
  // useEffect(() => {
  //   if (existingClient) {
  //     onLoading(loading);
  //   } else {
  //     onLoading(false);
  //   }
  // }, [loading])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    showLoader(true);
    try {
      if (!existingClient){
        console.log('Adding client');
        const newAccount = await api.clients.createClient({
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          mobilePhone: client.mobilePhone
        });
        // @ts-ignore
        await api.clients.modifyFields(newAccount.uid, client);
        toast.success(`${client.firstName} added!`);
        history.replace(`/clients/manage/${newAccount.uid}`);
      } else {
        console.log('Modifying client');
        await api.clients.modifyFields(id,client);
        toast.success(`${client.firstName} updated!`);
        history.replace(`/clients/manage/${client.uid}`);
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      showLoader(false);
    }

  }

  const handleDelete = async () => {
    setShowModal(true);
  }

  const confirmDelete = async (confirmed: boolean) => {
    setShowModal(false);
    if (confirmed) {
      try{
        showLoader(true);
        await api.clients.deleteClient(id);
        toast.success(`Buh bye now 🙋‍`);
        history.go(-3);
      } catch (e) {
        toast.error(`Well *that* didn't go well...`);
        toast.error(e.message);
      } finally {
        showLoader(false);
      }
    }
  }

  const handleFieldChange = ( fieldName: string, value: any ) => {
    console.log(`Field ${fieldName} changed to ${value}`);
    const moddedClient = {...client, [fieldName]:value };
    console.log(moddedClient);
    setClient(moddedClient);
  }

  return (
    <>
      { onCancel ? <Button onClick={onCancel} className="float-right mr-1 ml-1" variant="danger">CANCEL</Button> : null }
      <Button onClick={handleSubmit} className="float-right">SAVE</Button>
      { id !== 'new' ? <h4 className="text-muted">{client.firstName} {client.lastName}</h4> : null}
      <Tabs defaultActiveKey="name" className="mt-5">
        <Tab eventKey="name" title="Name and Email">
          <ClientContactForm contactInfo={client} onChange={handleFieldChange}/>
        </Tab>
        <Tab eventKey="conditions" title="Conditions and Injuries">
          <ClientHealthStatusForm client={client} onChange={handleFieldChange}/>
        </Tab>
        <Tab eventKey="equipment" title="Equipment">
          <EquipmentForm client={client} onChange={handleFieldChange}/>
        </Tab>
        <Tab eventKey="account" title="Account">
          <TabContainer>
            { client.clientType === undefined && <p className="text-danger">Please assign a client type!</p> }
            <Selector label={'Client Type'} onChange={(field, value) => {
              handleFieldChange(field, parseInt(value));
            }} value={client.clientType} options={ClientTypeOptions} fieldName={'clientType'}/>
            {/*<Form.Check*/}
            {/*  type="switch"*/}
            {/*  id="active-switch"*/}
            {/*  label="Account Active"*/}
            {/*  checked={client?.accountActive}*/}
            {/*  onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {*/}
            {/*    const c = ev.target.checked;*/}
            {/*    handleFieldChange('accountActive', c);*/}
            {/*  }}*/}
            {/*/>*/}
            {/*<JSONPretty json={client}/>*/}
            { existingClient && <Button variant="danger" onClick={handleDelete} className="mt-3">Delete Client</Button>}
          </TabContainer>
        </Tab>
      </Tabs>
      <Modal show={showModal} onHide={()=>confirmDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to delete client {client?.email}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>confirmDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={()=>confirmDelete(true)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      </>
  )
}


export const AddEditClientPage: FC = (props) => {
  const { id } = useParams<{id: string}>();
  const existingClient = id !== 'new';
  const pageTitle = existingClient ? "Edit Client" : "Add Client";
  const [ loading, setLoading ] = useState(true);


  return (
    <PageContainer title={pageTitle} loading={false}>
      <AddEditClientComponent id={id} onLoading={(l) => setLoading(l)}/>
    </PageContainer>
  );
};
