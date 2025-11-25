import React, {FC} from 'react';
import {Route, Switch} from "react-router-dom";
import {ClientLandingPage} from "../pages/Dashboard/ClientLandingPage";
import {WorkoutSequencerScreen} from "../pages/WorkoutSequencer/WorkoutSequencerScreen";

export const ClientPortalRouter: FC = () => {
  return (
    <Switch>
      <Route path="/playworkout/:id">
        <WorkoutSequencerScreen mock={false}/>
      </Route>
      <Route path="/">
        <ClientLandingPage/>
      </Route>
    </Switch>
  );
};
