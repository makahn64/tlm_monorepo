import React, {FC} from 'react';
import { Card } from 'react-bootstrap';
import {gcsUrlForFileName} from "../../services/gcf/gcsUrlForFileName";
import {GCSFile} from "tlm-common";
import {Media} from "tlm-common";

interface Props {
  media: Media;
  onClick?: (f: Media) => void;
  size?: string;
}

export const MediaCard: FC<Props> = ({ media, onClick, size}) => {

  const handleClick = () => {
    if (onClick) {
      onClick(media);
    }
  }

  const thumb = (media.thumbnail as GCSFile).name;

  return (
    <Card style={{ width: '10rem', margin: 10 }} className="float-left" onClick={handleClick}>
      <Card.Img variant="top" src={gcsUrlForFileName(thumb)} />
      <Card.Body style={{padding: 0}}>
        <Card.Text style={{fontSize: 10, textAlign: 'center'}}>{media.name}</Card.Text>
      </Card.Body>
    </Card>
  );
};

