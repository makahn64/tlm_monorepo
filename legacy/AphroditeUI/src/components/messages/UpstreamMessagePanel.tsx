import React, {FC, useEffect, useState} from 'react';
import {UpstreamMessage} from "tlm-common";
import * as Messages from '../../services/api/upstreamMessages/firestoreUpstreamMessages';
import {timestampToFormattedDate} from "../../services/api/helpers";
import {Button} from "react-bootstrap";
import {archiveMessage} from "../../services/api/upstreamMessages/firestoreUpstreamMessages";
import {on} from "cluster";

interface Props {
  message: UpstreamMessage;
  onArchive: () => void;
}

const UpstreamMessageCard: FC<Props> = ({message, onArchive}) => {
  const handleArchive = async () => {
    await archiveMessage(message.docId);
    onArchive();
  }
  return (
    <div className="d-flex flex-row justify-content-between border-bottom p-1">
      <div className="d-flex flex-row justify-content-left">
        <div className="small font-weight-bold mr-2">{timestampToFormattedDate(message.date)}</div>
        <div className="small font-weight-bold text-left mr-2">{message.from.name}</div>
      </div>
      <div className="small font-weight-bold font-italic">{message.message}</div>
      <Button onClick={handleArchive} size="sm">Archive</Button>
    </div>
    )
}

export const UpstreamMessagePanel: FC = () => {
  const [messages, setMessages] = useState<UpstreamMessage[]>([]);

  async function load() {
    const m = await Messages.getAllNonArchivedMessages();
    setMessages(m);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{borderWidth: 1, borderColor: 'black'}}>
      {messages.map((m) => <UpstreamMessageCard message={m} onArchive={load}/>)}
    </div>
  );
};
