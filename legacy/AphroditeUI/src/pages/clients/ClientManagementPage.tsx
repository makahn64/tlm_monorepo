import React, {FC} from 'react';
import {PageContainer} from "../../components/containers/PageContainer";
import {ClientDetailsView} from "./ClientDetailsView";
import {useParams} from "react-router-dom";
import {useClient} from "../../hooks/useClient";
import JSONPretty from "react-json-pretty";
import {ManageClientButton} from "../../components/navigation/ManageClientButton";
import {
  AccountIconTile,
  DumbbellIconTile, HistoryIconTile,
  NotesIconTile,
  RecommendationIconTile
} from "../../components/tiles/IconTile";
import {THEME_COLORS} from "../../assets/styles/themecolors";

export const ClientManagementPage: FC = () => {

  const {id} = useParams<{ id: string }>();
  const {client, loading } = useClient(id);

  return (
    <PageContainer title={`${client.firstName} ${client.lastName}`} loading={loading}>
      <DumbbellIconTile to={`/clients/addworkout/${id}/new`} subtitle={'Create and send a new workout'}/>
      <HistoryIconTile to={`/clients/workouthistory/${id}`} subtitle={'View past workouts and manage current workouts'}/>
      <NotesIconTile to={`/clients/notes/${id}`} subtitle={`Add/review notes about this client`}/>
      <RecommendationIconTile to={`/clients/addrecommendation/${id}`} subtitle={`Send recommended videos, links or messages to the client`}/>
      <AccountIconTile to={`/clients/details/${id}`} subtitle={`Review and update client profile and account`}/>
    </PageContainer>
  );
};
