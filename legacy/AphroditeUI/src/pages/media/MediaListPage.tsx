import React, {FC, useEffect, useState} from 'react';
import {PageContainer} from "../../components/containers/PageContainer";
import * as api from "../../services/api";
import {Table, Form} from 'react-bootstrap';
import {useHistory} from "react-router-dom";
import {GCSFile} from "tlm-common";
import _ from 'lodash';
import {useUI} from "../../services/ui/UIProvider";
import {gcsUrlForFileName} from "../../services/gcf/gcsUrlForFileName";
import { BsCameraVideo, BsCardImage } from 'react-icons/bs';

export const MediaListPage: FC = () => {

  const [media, setMedia ] = useState<GCSFile[]>([]);
  const [search, setSearch] = useState('');
  const { showLoader } = useUI();
  const history = useHistory();

  useEffect(()=> {
    async function l() {
      showLoader(true);
      const m = await api.media.getAllGCSMedia();
      setMedia(_.sortBy(m, ['name']));
      showLoader(false);
    }

    l();

  }, []);

  const openMedia = (media: GCSFile) => {
    window.open(gcsUrlForFileName(media.name), "_blank");
  }

  const buildRow = (m: GCSFile) => {
    return (
      <tr onClick={()=> openMedia(m) } >
        <td>
          { m.contentType.startsWith('image') ? <BsCardImage/> : <BsCameraVideo/> }
        </td>
        <td>{m.name}</td>
      </tr>
    );
  }

  const filteredMedia = media.filter( e => e.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <PageContainer title="All Google Cloud Storage Media">
      <p>This is a listing of all media files stored in GCS.</p>
      <Form.Group>
        <Form.Control type="text" placeholder="search" onChange={event => {
          setSearch(event.target.value)
        }} value={search}/>
      </Form.Group>
      {filteredMedia.length ? <div>
        <Table striped bordered hover>
          <thead>
          <tr>
            <th>Kind</th>
            <th>Name</th>
          </tr>
          </thead>
          <tbody>
          {filteredMedia.map(buildRow)}
          </tbody>
        </Table>
      </div> : <p className="text-muted font-italic">No media found.</p>}
    </PageContainer>
  );
};
