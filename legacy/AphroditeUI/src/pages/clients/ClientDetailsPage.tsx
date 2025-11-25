import React, {FC, useEffect} from 'react';
import {PageContainer} from "../../components/containers/PageContainer";
import {ClientDetailsView} from "./ClientDetailsView";
import {Link, useParams} from "react-router-dom";
import {useClient} from "../../hooks/useClient";
import {Button} from "react-bootstrap";
import { useHistory } from 'react-router-dom';
import { isEmpty } from 'lodash';

export const ClientDetailsPage: FC = () => {

  const {id} = useParams<{ id: string }>();
  const {client, loading} = useClient(id);
  const history = useHistory();

  useEffect(() => {
    if (!loading && isEmpty(client)) {
      console.log('Bad id, no such client');
      history.replace('/clients/list');
    }
  }, [loading, client])

  return (
    <PageContainer title={`Client Details for ${client.firstName} ${client.lastName}`} loading={loading}
                   rightSide={<Button as={Link} to={`/clients/edit/${id}`}>Edit</Button>}>
      <div className="floatingcard mt-3">
        <ClientDetailsView client={client} canCollapse={false}/>
      </div>
    </PageContainer>
  );
};
