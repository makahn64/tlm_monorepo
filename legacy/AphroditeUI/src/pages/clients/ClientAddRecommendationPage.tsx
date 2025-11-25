import React, {FC} from 'react';
import {useClient} from "../../hooks/useClient";
import {useHistory, useParams} from "react-router-dom";
import {PageContainer} from "../../components/containers/PageContainer";
import {TrainerRecommendationEditor} from "./TrainerRecommendationEditor";
import {ClientActionMenu} from "../../components/ActionMenus/ClientActionMenu";

export const ClientAddRecommendationPage: FC = () => {
  const {id} = useParams<{ id: string }>();
  const {client, loading} = useClient(id);
  const history = useHistory();

  return (
    <PageContainer title={`Send Recommendation to ${client.firstName} ${client.lastName}`} loading={loading}
                   rightSide={<ClientActionMenu clientId={client.uid}/>}>
      <TrainerRecommendationEditor client={client} onComplete={()=>history.goBack()}/>
    </PageContainer>
  );
};
