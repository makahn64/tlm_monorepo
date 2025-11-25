import React, {FC} from 'react';
import { Card } from 'react-bootstrap';
import {gcsUrlForFileName} from "../../services/gcf/gcsUrlForFileName";
import {GCSFile} from "tlm-common";
import {GoogleCloudVideo} from "../images/GoogleCloudVideo";

interface Props {
  media: GCSFile;
  onClick?: (f: GCSFile) => void;
  size?: string;
}

export const GCSMediaCard: FC<Props> = ({ media, onClick, size}) => {

  const { contentType } = media;
  const isImage = contentType.startsWith('image');

  const handleClick = () => {
    if (onClick) {
      onClick(media);
    }
  }

  return (
    <Card style={{ width: isImage ? '8rem' : '16rem', margin: 10, height: 120 }} className="float-left" onClick={handleClick}>
      { isImage && <Card.Img variant="top" src={gcsUrlForFileName(media.name)} /> }
      { !isImage && <GoogleCloudVideo meta={media}/>
      }
      <Card.Body style={{padding: 0}}>
        <Card.Text style={{fontSize: 10, textAlign: 'center'}}>{media.name}</Card.Text>
      </Card.Body>
    </Card>
  );
};
