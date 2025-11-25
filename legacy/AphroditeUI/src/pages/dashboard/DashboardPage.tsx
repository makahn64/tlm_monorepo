import React, {CSSProperties, FC, useEffect, useState} from 'react';
import {PageContainer} from "../../components/containers/PageContainer";
import {Row, Col, Button, Jumbotron} from "react-bootstrap";
import {UpstreamMessagePanel} from "../../components/messages/UpstreamMessagePanel";
import * as api from '../../services/api';
import {ClientStagePieChart} from "../../components/charts/ClientStagePieChart";
import {Stats} from "../../services/gcf/getStats";
import {ClientTypePieChart} from "../../components/charts/ClientTypePieChart";

const cachedStatsString = localStorage.getItem('cachedStats');

export const DashboardPage: FC = () => {

  const [stats, setStats] = useState<Stats|undefined>( cachedStatsString && JSON.parse(cachedStatsString) );
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function loadNet() {
       setLoading(!stats);
      try {
        const st = await api.stats.getStats();
        setStats(st);
        localStorage.setItem('cachedStats', JSON.stringify(st));
      } finally {
        setLoading(false);
      }
    }


    loadNet();
  }, []);

  return (
    <PageContainer title="Dashboard" loading={loading}>
      <Row className="mt-5">
        <Col>
          <UpstreamMessagePanel />
          { stats ? <ClientStagePieChart clientsByStage={stats.clientsByStage}/> : null }
          { stats ? <ClientTypePieChart clientsByType={stats.clientsByType}/> : null }
        </Col>
      </Row>
    </PageContainer>
  );
};

