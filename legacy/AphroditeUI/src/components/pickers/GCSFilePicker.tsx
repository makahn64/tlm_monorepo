import React, {FC, useEffect, useState} from 'react';
import {GCSFile} from "tlm-common";
import {Card, Container, Form, Modal} from 'react-bootstrap';
import * as api from '../../services/api';
import {GCSMediaCard} from "../cards/GCSMediaCard";

interface Props {
  show: boolean;
  onPick: (f: GCSFile) => void;
  mimeType?: string;
  prefix?: string;
  onCancel?: () => void;
  onHide?: () => void;
  title?: string;
}

export const GCSFilePicker: FC<Props> = ({
                                           show,
                                           onPick,
                                           mimeType,
                                           prefix,
                                           onCancel,
                                           onHide,
                                           title
                                         }) => {

  const [media, setMedia] = useState<GCSFile[]>([]);
  const [search, setSearch] = useState('');
  const [disablePrefix, setDisablePrefix] = useState(false);

  useEffect(() => {
    async function f() {
      const m = await api.media.getAllGCSMedia();
      setMedia(m);
    }

    f();
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

  let mimeFilteredMedia = media.filter(m => m.contentType.startsWith(mimeType || ''));
  let prefixFiltered = mimeFilteredMedia.filter(m => (disablePrefix || m.name.startsWith(prefix || '')));
  let filteredMedia = prefixFiltered.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Modal size="lg" show={show} onHide={handleHide}>
      <Modal.Header closeButton>
        <Modal.Title>Choose a media file</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form.Group>
            <Form.Control type="text" placeholder="search" onChange={event => {
              setSearch(event.target.value)
            }} value={search}/>
            <Form.Check
              className="mt-1"
              type="switch"
              id="active-switch"
              label="Show All Files"
              checked={disablePrefix}
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                const c = ev.target.checked;
                setDisablePrefix(c);
              }}
            />
          </Form.Group>
            {filteredMedia.map(m => <GCSMediaCard media={m} onClick={() => onPick(m)}/>)}
        </Container>
      </Modal.Body>
    </Modal>
)

};

/*
  <Modal size="lg"
         show={smShow}
         onHide={()
           =>
           setSmShow(false)
         }
         aria - labelledby = "example-modal-sizes-title-sm"
>
  <Modal.Header closeButton>
    <Modal.Title id="example-modal-sizes-title-sm">
      Small
      Modal
      < /Modal.Title>
        < /Modal.Header>
          < Modal.Body>
            ...
          </Modal.Body>
          < /Modal>
            < Modal
              size="lg"
              show={lgShow}
              onHide={()
                =>
                setLgShow(false)
              }
              aria - labelledby = "example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                Large
                Modal
                < /Modal.Title>
                  < /Modal.Header>
                    < Modal.Body>
                      ...
                    </Modal.Body>
                    < /Modal>
                      */
