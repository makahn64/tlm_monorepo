import React, {FC} from 'react';
import {Route, Switch} from "react-router-dom";
import {PinkPage} from "../pages/dev/PinkPage";
import {TealPage} from "../pages/dev/TealPage";
import {FirestorePage} from "../pages/dev/FirestorePage";
import {ClientListPage} from "../pages/clients/ClientListPage";
import {ExerciseListPage} from "../pages/exercises/ExerciseListPage";
import {AddEditClientPage} from "../pages/clients/AddEditClientPage";
import {AddEditExercisePage} from "../pages/exercises/AddEditExercisePage";
import {ExerciseDetailPage} from "../pages/exercises/ExerciseDetailPage";
import {ClientDetailsPage} from "../pages/clients/ClientDetailsPage";
import {ClientWorkoutsPage} from "../pages/workouts/ClientWorkoutsPage";
import {DashboardPage} from "../pages/dashboard/DashboardPage";
import {FakerPage} from "../pages/demo/FakerPage";
import {ClientWorkoutDetailPage} from "../pages/workouts/ClientWorkoutDetailPage";
import {UserListPage} from "../pages/users/UserListPage";
import {AddEditUserPage} from "../pages/users/AddEditUserPage";
import {MediaListPage} from "../pages/media/MediaListPage";
import {AccountManagementPage} from "../pages/account/AccountManagementPage";
import {MediaOfTypePage} from "../pages/media/MediaOfTypePage";
import {MediaDetailPage} from "../pages/media/MediaDetailPage";
import {AddEditMediaPage} from "../pages/media/AddEditMediaPage";
import {ClientManagementPage} from "../pages/clients/ClientManagementPage";
import {ClientAddWorkoutPage} from "../pages/workouts/ClientAddWorkoutPage";
import {ClientAddRecommendationPage} from "../pages/clients/ClientAddRecommendationPage";
import {ClientWorkoutHistoryPage} from "../pages/workouts/ClientWorkoutHistoryPage";
import {ClientNotesPage} from "../pages/clients/ClientNotesPage";
import {LeadListPage} from "../pages/leads/LeadListPage";
import {PrebuiltWorkoutList} from "../pages/prebuiltWorkouts/PrebuiltWorkoutListPage";
import {AddEditPrebuiltWorkoutPage} from "../pages/prebuiltWorkouts/AddEditPrebuiltWorkoutPage";
import {LeadDetailPage} from "../pages/leads/LeadDetailPage";

export const RootRoute: FC = () => {
  return (
    <Switch>
      <Route path="/clients/list">
        <ClientListPage/>
      </Route>
      <Route path="/clients/edit/:id">
        <AddEditClientPage/>
      </Route>
      <Route path="/clients/details/:id">
        <ClientDetailsPage/>
      </Route>
      <Route path="/clients/workouts/:id/detail/:workoutId">
        <ClientWorkoutDetailPage/>
      </Route>
      <Route path="/clients/workouts/:id">
        <ClientWorkoutsPage/>
      </Route>
      <Route path="/clients/manage/:id">
        <ClientManagementPage/>
      </Route>
      <Route path="/clients/notes/:id">
        <ClientNotesPage/>
      </Route>
      <Route path="/clients/addworkout/:clientId/:workoutId">
        <ClientAddWorkoutPage/>
      </Route>
      <Route path="/clients/addrecommendation/:id">
        <ClientAddRecommendationPage/>
      </Route>
      <Route path="/clients/workouthistory/:id">
        <ClientWorkoutHistoryPage/>
      </Route>
      <Route path="/exercises/list">
        <ExerciseListPage/>
      </Route>
      <Route path="/exercises/detail/:id">
        <ExerciseDetailPage/>
      </Route>
      <Route path="/exercises/edit/:id">
        <AddEditExercisePage/>
      </Route>
      <Route path="/pink">
        <PinkPage/>
      </Route>
      <Route path="/teal">
        <TealPage/>
      </Route>
      <Route path="/firestore">
        <FirestorePage/>
      </Route>
      <Route path="/faker">
        <FakerPage/>
      </Route>
      <Route path="/team/list">
        <UserListPage/>
      </Route>
      <Route path="/team/edit/:id">
        <AddEditUserPage />
      </Route>
      <Route path="/media/all">
        <MediaListPage />
      </Route>
      <Route path="/media/type/:mtype">
        <MediaOfTypePage />
      </Route>
      <Route path="/media/detail/:id">
        <MediaDetailPage />
      </Route>
      <Route path="/media/edit/:id">
        <AddEditMediaPage />
      </Route>
      <Route path="/account">
        <AccountManagementPage />
      </Route>
      <Route path="/leads/process/:id">
        <LeadDetailPage/>
      </Route>
      <Route path="/leads/list">
        <LeadListPage/>
      </Route>
      <Route path="/workouts/list">
        <PrebuiltWorkoutList/>
      </Route>
      <Route path="/workouts/edit/:id">
        <AddEditPrebuiltWorkoutPage/>
      </Route>
      <Route path="/">
        <DashboardPage/>
      </Route>
    </Switch>
  );
};
