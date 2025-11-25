import React, {FC} from 'react';
import {Timestamp, TrainerRecommendation, Media} from "tlm-common";
import {ListGroupItem} from "react-bootstrap";
import {timestampToFormattedDate} from "../../services/api/helpers";

interface Props {
  rec: TrainerRecommendation;
  onDelete: (t: TrainerRecommendation) => void;
}

export const TrainerRecCell: FC<Props> = ({rec, onDelete}) => {

  let innerContent;

  switch (rec.recommendationType) {
    case "link":
      innerContent = <span>Link {rec.body} sent on {timestampToFormattedDate(rec.createdOn as Timestamp)}</span>;
      break;
    case "text":
      innerContent = <span>Text <span
        className="text-secondary">{rec.body}</span> sent on {timestampToFormattedDate(rec.createdOn as Timestamp)}</span>;
      break;
    case "video":
      innerContent = <span>Video <span
        className="text-secondary">{rec.media?.name}</span> sent on {timestampToFormattedDate(rec.createdOn as Timestamp)}</span>;
      break;
  }

  return (
    <ListGroupItem>
      <span className="float-left text-danger mr-2" onClick={() => onDelete(rec)}>X</span>
      {innerContent}
    </ListGroupItem>
  );
}
