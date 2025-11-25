import React, {FC,  useState} from 'react';
import {useClient} from "../../hooks/useClient";
import {useHistory, useParams} from "react-router-dom";
import {PageContainer} from "../../components/containers/PageContainer";
import { Tab, Tabs} from "react-bootstrap";
import {WorkoutEditor} from "./WorkoutEditor";
import {Workout} from "tlm-common";
import {TabContainer} from "../../components/containers/TabContainer";
import {WorkoutHistoryTable} from "./WorkoutHistoryTable";
import {ClientDetailsView} from "../clients/ClientDetailsView";
import {TrainerRecommendationEditor} from "../clients/TrainerRecommendationEditor";
import {toast} from "react-toastify";

interface Props {}

export const ClientWorkoutsPage: FC<Props> = (props) => {
  const { id } = useParams<{id: string}>();
  const { client, loading, addOrUpdateWorkout, workouts } = useClient(id);
  const [inboundWorkout, setInboundWorkout] = useState<string|undefined>();
  const [ak, setAK] = useState('add');
  const history = useHistory();


  const handleInboundWorkout = ( wo: Workout) => {
    setInboundWorkout(wo.id);
    setAK('add');
  }

  const handleWorkoutSave = async ( wo: Workout) => {
    try {
      await addOrUpdateWorkout(wo);
      toast.success('Sweet! Workout added.');
      history.goBack();
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <PageContainer title={`Workouts for ${client.firstName} ${client.lastName}`} loading={loading}>
      <ClientDetailsView client={client} />
      <Tabs defaultActiveKey="add" className="mt-5" activeKey={ak} onSelect={(k)=>setAK(k!)}>
        <Tab eventKey="add" title="Add a New Workout">
          <WorkoutEditor client={client} inboundWorkoutId={inboundWorkout} onSave={handleWorkoutSave}/>
        </Tab>
        <Tab eventKey="rec" title="Send Recommendation">
          <TrainerRecommendationEditor client={client}/>
        </Tab>
        <Tab eventKey="algo" title="Run Algo">
          <TabContainer>
            <p>Check back soon.</p>
          </TabContainer>
        </Tab>
        <Tab eventKey="history" title="Workout History">
          <WorkoutHistoryTable workouts={workouts} client={client}/>
        </Tab>
      </Tabs>
    </PageContainer>
    );
};
