import React, { FC, useState, useEffect } from 'react';
import {PageContainer} from "../../components/containers/PageContainer";
import { useParams } from 'react-router-dom';
import {Table, Button, Container, Row, Col} from "react-bootstrap";
import * as api from '../../services/api';
import { useHistory } from 'react-router-dom';
import {Exercise} from "tlm-common";
import {BadgesFromArray} from "../../components/badges/BadgesfromArray";
import {GoogleCloudImg} from "../../components/images/GoogleCloudImg";
import {GoogleCloudVideo} from "../../components/images/GoogleCloudVideo";
import JSONPretty from "react-json-pretty";

export const ExerciseDetailPage: FC = () => {

  const { id } = useParams<{id: string}>();
  const [ exercise, setExercise ] = useState<Exercise | null>(null);
  const [ loading, setLoading ] = useState(true);
  const history = useHistory();

  useEffect(()=>{
    async function load(){
      setLoading(true);
      const ex = await api.exercises.getExercise(id) as Exercise;
      setExercise(ex);
      setLoading(false);
    }

    if (id) {
      load();
    }

  }, [id]);

  if (!exercise) {
    return null;
  }

  return (
    <PageContainer title={exercise?.name} loading={loading} rightSide={<Button onClick={()=>history.push(`/exercises/edit/${id}`)} size={'sm'}>EDIT</Button>}>
        <Container>
          <Row>
            <Col>
              <Table striped className="mt-3">
                <tr>
                  <td>Name</td>
                  <td>{exercise?.name}</td>
                </tr>
                <tr>
                  <td>Title</td>
                  <td>{exercise?.title}</td>
                </tr>
                <tr>
                  <td>Movement Pattern</td>
                  <td>{exercise?.movementPattern}</td>
                </tr>
                <tr>
                  <td>Releases</td>
                  <td><BadgesFromArray data={exercise?.releases}/></td>
                </tr>
                <tr>
                  <td>Activates</td>
                  <td><BadgesFromArray data={exercise?.activates}/></td>
                </tr>
                <tr>
                  <td>Stresses</td>
                  <td><BadgesFromArray data={exercise?.stress}/></td>
                </tr>
                <tr>
                  <td>Intensity</td>
                  <td>{exercise?.intensity}</td>
                </tr>
                <tr>
                  <td>Equipment</td>
                  <td><BadgesFromArray data={exercise?.equipment}/></td>
                </tr>
                <tr>
                  <td>Optional Equipment</td>
                  <td><BadgesFromArray data={exercise?.optionalEquipment}/></td>
                </tr>
                <tr>
                  <td>Duration</td>
                  <td>{exercise?.duration} seconds</td>
                </tr>
                {/*<tr>*/}
                {/*  <td>Cues</td>*/}
                {/*  <td><ULfromArray data={exercise?.cues}/></td>*/}
                {/*</tr>*/}
                <tr>
                  <td>Pre-Composited</td>
                  <td>{exercise?.preComposited ? 'yes' : 'no' }</td>
                </tr>
                <tr>
                  <td>Archived</td>
                  <td>{exercise?.archived ? 'yes' : 'no' }</td>
                </tr>
                <tr>
                  <td>Metadata</td>
                  <td><JSONPretty data={exercise?.metadata}/></td>
                </tr>
              </Table>
            </Col>
            <Col>
              <GoogleCloudImg meta={exercise?.prenatalThumb} style={{width: '25vw'}} label="Prenatal Thumbnail"/>
              <GoogleCloudVideo meta={exercise?.prenatalVideo} label="Prenatal Video"/>
              <GoogleCloudImg meta={exercise?.postnatalThumb} style={{width: '25vw'}} label="Postnatal Thumbnail"/>
              <GoogleCloudVideo meta={exercise?.postnatalVideo} label="Postnatal Video"/>
              <GoogleCloudImg meta={exercise?.instructionThumb} style={{width: '25vw'}} label="Instructions Thumbnail"/>
              <GoogleCloudVideo meta={exercise?.instructionVideo} label="Instructions Video"/>
            </Col>
          </Row>
        </Container>
    </PageContainer>
  );
};
