import React, {FC, useEffect, useState} from 'react';
import {PageContainer} from "../../components/containers/PageContainer";
import * as api from "../../services/api";
import {Table, Form} from 'react-bootstrap';
import {useHistory, useParams} from "react-router-dom";
import {useUI} from "../../services/ui/UIProvider";
import {Media} from "tlm-common";
import {GoogleCloudImg} from "../../components/images/GoogleCloudImg";

export const MediaOfTypePage: FC = () => {
  const {mtype} = useParams<{ mtype: string }>();
  const history = useHistory();
  const [media, setMedia ] = useState<Media[]>([]);
  const [search, setSearch] = useState('');
  const { showLoader } = useUI();

  useEffect(()=> {
    async function l() {
      showLoader(true);
      const m = await api.media.getAllMedia() as Media[];
      setMedia(m.filter(m=>m.type===mtype));
      showLoader(false);
    }

    l();

  }, [mtype]);

  const buildRow = (m: Media) => {
    return (
      <tr onClick={()=>history.push(`/media/detail/${m.id}`)}>
        <td>
          <GoogleCloudImg meta={m.thumbnail} style={{width: '100px'}} noGap={true}/>
        </td>
        <td>
          {m.name}
        </td>
        <td>{m.description}</td>
        <td>{m.duration}</td>
      </tr>
    );
  }

  const filteredMedia = media.filter( e => e.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <PageContainer title={`${mtype.toUpperCase()} Media Files`}>
      <Form.Group>
        <Form.Control type="text" placeholder="search" onChange={event => {
          setSearch(event.target.value)
        }} value={search}/>
      </Form.Group>
      {filteredMedia.length ? <div>
        <Table striped bordered hover>
          <thead>
          <tr>
            <th/>
            <th>Name</th>
            <th>Description</th>
            <th>Duration</th>
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
