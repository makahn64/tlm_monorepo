/*********************************
 File:       WorkoutSequencerScreen.tsx
 Function:   Runs the full screen video workout
 Copyright:  The Lotus Method
 Date:       2020-11-09
 Author:     mkahn
 **********************************/
import React, {CSSProperties, FC, useEffect, useReducer, useState} from 'react';
import {INITIAL_WORKOUT_STATE, workoutSeqReducer,} from './workoutSequencerReducer';
import {useHistory, useParams} from "react-router-dom";
import { Workout } from 'tlm-common';
import {useAuthState} from "../../services/firebase/AuthProvider";
import {useClient} from "../../hooks/useClient";
import _ from 'lodash';
import {gcsUrlForFileName} from "../../services/gcf/gcsUrlForFileName";
import {Col, Container, Row} from "react-bootstrap";
import {BadgesFromArray} from "../../components/dataDisplay/BadgesfromArray";
import {ClientPortalContainer} from "../clientPortal/components/ClientPortalContainer";
import { BsSkipStart, BsSkipEnd } from 'react-icons/bs';

// because of no typescript, we have to do the require
const { Player, BigPlayButton, ControlBar, ReplayControl, ForwardControl } = require('video-react');

const SHOW_TITLE = false;

interface Props {
  // used only during development
  mock: boolean;
}

export const WorkoutSequencerScreen: FC<Props> = ({mock = false}) => {
  const {userProfile} = useAuthState();
  const {client, workouts} = useClient(userProfile!.uid);
  const {id} = useParams<{ id: string }>();
  const [state, dispatch] = useReducer(
    workoutSeqReducer,
    INITIAL_WORKOUT_STATE,
  );
  const isPregnant = { client };
  const currentWorkout = _.find(workouts, {id});
  const [videoSource, setVideoSource] = useState('');
  const history = useHistory();

  const {
    playlist,
    index,
    showingInstructions,
    workoutDone,
    abandoned,
  } = state;

  useEffect(() => {
    if (currentWorkout) {
      dispatch({type: 'SET_WORKOUT', workout: currentWorkout as Workout, isPregnant: client.isPregnant});
    }
  }, [currentWorkout]);

  useEffect(() => {
    if (workoutDone) {
      history.goBack();
    } else {
      const video = playlist[index];
      if (!video) {
        return;
      }
      playCurrentVideo();
    }
  }, [index, workoutDone]);

  useEffect(() => {
    if (playlist.length) {
      playCurrentVideo();
    }
  }, [playlist]);

  const playCurrentVideo = () => {
    const video = playlist[index];
    if (!video) {
      return;
    }
    setVideoSource(gcsUrlForFileName(video.videoSourceName || ''));
  };

  // const toggleInstructions = () => {
  //   dispatch({ type: 'SHOW_INSTRUCTIONS', isShowing: !showingInstructions });
  // };

  const handleVideoDismissed = () => {
    console.log('Video Dismissed');
    //stop();
    dispatch({type: 'ABANDON'});
  };

  const showNextVideo = () => {
    console.log('Video ended/skipped');
    dispatch({type: 'NEXT_VIDEO'});
  };

  const handleVideoError = (err: any) => {
    console.error(err);
    console.error(`${playlist[index].name} errored.`);
    dispatch({type: 'SET_VIDEO_ERROR', isVideoError: true});
  };

  // const handleInstructionVideoDismiss = () => {
  //   XLogger.logDebug('Instruction video dismissed');
  // };
  //
  // const handleInstructionVideoEnd = () => {
  //   XLogger.logDebug('Instruction video dismissed');
  // };

  // const handleUserSaysWorkoutDone = async () => {
  //   if (workoutDone) {
  //     await markWorkoutComplete(client.uid, currentWorkout as Workout);
  //   } else {
  //     await markWorkoutProgress(client.uid, currentWorkout as Workout, index);
  //   }
  // };

  const handleUserSaysResume = () => {
  };

  const goBack = () => {
    dispatch({type: 'PREV_VIDEO'});
  }

  const goForward = () => {
    dispatch({type: 'NEXT_VIDEO'});
  }

  return (
    <ClientPortalContainer>
      {(!workoutDone && videoSource) && <Container>
        <Row>
          <Col>
            <div style={{position: 'relative', margin: 20}}>
              <Player src={videoSource} onEnded={showNextVideo} autoPlay>
                <BigPlayButton position="center" />
                <ControlBar autoHide={true}>
                  <ReplayControl seconds={10} order={2.2} />
                  <ForwardControl seconds={10} order={3.2} />
                </ControlBar>
              </Player>
              { SHOW_TITLE && <p style={styles.name}>{playlist[index].name}</p> }
              <BsSkipStart style={styles.topLeft} onClick={goBack}/>
              <BsSkipEnd style={styles.topRight} onClick={goForward}/>
            </div>
            <BadgesFromArray data={playlist.map(p => p.name)}/>
          </Col>

        </Row>
      </Container>}
    </ClientPortalContainer>
  );
};

const styles = {
  container: {
    backgroundColor: 'black',
    width: '100vw',
    height: '100vw',
    marginTop: 0,
    color: 'white'
  },
  video: {
    width: '100%'
  },
  topLeft: {
    position: 'absolute',
    top: 5,
    left: 5,
    fontSize: '5vw',
    opacity: 0.5,
    color: '#ffffff'
  } as CSSProperties,
  topRight: {
    position: 'absolute',
    top: 5,
    right: 5,
    fontSize: '5vw',
    color: '#ffffff',
    opacity: 0.5
  } as CSSProperties,
  name: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
    position: 'absolute',
    top: 10,
    left: '40%',
    right: '40%',
    fontSize: '0.1rem',
    margin: 'auto',
    padding: '5px 10px 5px 10px',
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.3)'
  } as CSSProperties
}
