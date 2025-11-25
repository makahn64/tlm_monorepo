import React, {FC, useState} from 'react';
import {useClient} from "../../hooks/useClient";
import {useHistory, useParams} from "react-router-dom";
import {PageContainer} from "../../components/containers/PageContainer";
import {ClientNotesEditor} from "./ClientNotesEditor";
import {Button, Row, Col, Container} from "react-bootstrap";
import {updateClientMetadata} from "../../services/api/clients";
import {TextAreaModal} from "../../components/modals/TextAreaModal";
import {ClientActionMenu} from "../../components/ActionMenus/ClientActionMenu";

export const ClientNotesPage: FC = () => {
  const {id} = useParams<{ id: string }>();
  const {client, loading, metadata, reload} = useClient(id);
  const history = useHistory();

  const clientBackgroundInfo = metadata && metadata.clientBackgroundInfo && metadata.clientBackgroundInfo.notes;

  const [showBkgInfoModal, setShowBkgInfoModal] = useState(false);

  const handleUpdateBkgInfo = async (newInfo: string) => {
    console.log(newInfo);
    await updateClientMetadata(client.uid, {
      clientBackgroundInfo: {
        notes: newInfo
      }
    });
    await reload();
  };

  return (
    <PageContainer title={`Notes on ${client.firstName} ${client.lastName}`} loading={loading}
                   rightSide={<ClientActionMenu clientId={client.uid}/>}>
      <Container fluid>
        <Row className="mt-4">
          <Col>
            <h4>Client Background Info <Button className="float-right" size="sm"
                                               onClick={() => setShowBkgInfoModal(true)}>{clientBackgroundInfo ? 'Edit' : 'Add'}</Button>
            </h4>
            {clientBackgroundInfo ? <div style={{border: '1px solid #d0d0d0', padding: 10, borderRadius: 3, backgroundColor: '#ffffff'}}>
              { clientBackgroundInfo.split('\n').map( l => <p>{l}</p>) }
            </div> : <p className="text-muted font-italic">There is no background info for {client.firstName}.</p>}
          </Col>
        </Row>

      </Container>


      <ClientNotesEditor client={client} onComplete={()=>history.goBack()}/>
      <TextAreaModal title="Client Background Info"
                     onSave={handleUpdateBkgInfo}
                     initialValue={clientBackgroundInfo}
                     show={showBkgInfoModal}
                     onClose={() => setShowBkgInfoModal(false)}/>
    </PageContainer>
  );
};
