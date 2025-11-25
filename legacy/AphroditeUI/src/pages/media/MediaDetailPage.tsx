import React, { FC, useState, useEffect } from 'react';
import {PageContainer} from "../../components/containers/PageContainer";
import { useParams } from 'react-router-dom';
import {Table, Button, Container, Row, Col} from "react-bootstrap";
import * as api from '../../services/api';
import { useHistory } from 'react-router-dom';
import {GoogleCloudImg} from "../../components/images/GoogleCloudImg";
import {GoogleCloudVideo} from "../../components/images/GoogleCloudVideo";
import {Media} from "tlm-common";

export const MediaDetailPage: FC = () => {

  const { id } = useParams<{id: string}>();
  const [ media, setMedia ] = useState<Media|undefined>();
  const [ loading, setLoading ] = useState(true);
  const history = useHistory();

  useEffect(()=>{
    async function load(){
      setLoading(true);
      const m = await api.media.getMedia(id) as unknown as Media;
      setMedia(m);
      setLoading(false);
    }

    if (id) {
      load();
    }

  }, [id]);

  if (!media) {
    return null;
  }

  return (
    <PageContainer title={media?.name} loading={loading} rightSide={<Button onClick={()=>history.push(`/media/edit/${id}`)} size={'sm'}>EDIT</Button>}>
        <Container>
          <Row>
            <Col>
              <Table striped className="mt-3">
                <tr>
                  <td>Name</td>
                  <td>{media?.name}</td>
                </tr>
                <tr>
                  <td>Description</td>
                  <td>{media?.description}</td>
                </tr>
                <tr>
                  <td>Type</td>
                  <td>{media?.type}</td>
                </tr>
                <tr>
                  <td>Duration</td>
                  <td>{media?.duration}</td>
                </tr>
              </Table>
            </Col>
            <Col>
              <GoogleCloudImg meta={media?.thumbnail} style={{width: '25vw'}} label="Video Thumbnail"/>
              <GoogleCloudVideo meta={media?.video} label="Video"/>
            </Col>
          </Row>
        </Container>
    </PageContainer>
  );
};
