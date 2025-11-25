import React, {FC, useEffect, useState} from 'react';
import {Container, Form, Modal} from 'react-bootstrap';
import * as api from '../../services/api';
import {Media} from "tlm-common";
import {MediaCard} from "../cards/MediaCard";

interface Props {
  show: boolean;
  onPick: (m: Media) => void;
  onCancel?: () => void;
  onHide?: () => void;
  title?: string;
}

export const MediaPicker: FC<Props> = ({
                                         show,
                                         onPick,
                                         onCancel,
                                         onHide,
                                         title
                                       }) => {

  const [media, setMedia] = useState<Media[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function l() {
      const m = await api.media.getAllMedia() as Media[];
      setMedia(m);
    }

    l();
  }, []);

  const handleHide = () => {
    if (onHide) {
      onHide();
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  }

  let filteredMedia = media.filter(m => (m.name.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase())));

  return (
    <Modal size="lg" show={show} onHide={handleHide}>
      <Modal.Header closeButton>
        <Modal.Title>Choose a Media Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form.Group>
            <Form.Control type="text" placeholder="search" onChange={event => {
              setSearch(event.target.value)
            }} value={search}/>
          </Form.Group>
          {filteredMedia.map(m => <MediaCard media={m} onClick={() => onPick(m)} key={m.id}/>)}
        </Container>
      </Modal.Body>
    </Modal>
  )

};
