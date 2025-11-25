import React, { FC } from 'react';
import {VictoryPie, VictoryContainer, VictoryTheme, VictoryTooltip, VictoryChart, VictoryLegend} from "victory";
import { ClientsByTypeStats } from "../../services/gcf/getStats";
import {ChartTitle} from "../Typography/ChartTitle";

const colors = ["tomato", "orange", "gold", "cyan", "navy", "#c0c0c0" ];

interface Props {
  clientsByType: ClientsByTypeStats;
}

export const ClientTypePieChart: FC<Props> = ({ clientsByType }) => {
  const { active, archived, lead, pastDue, paused, unknown, totalCount } = clientsByType;

  const data = [
    { x: `Active [${active}]`, y: active },
    { x: `Leads [${lead}]`, y: lead },
    { x: `Paused [${paused}]`, y: paused },
    { x: `Past Due [${pastDue}]`, y: pastDue },
    { x: `Archived/Deleted [${archived}]`, y: archived},
    { x: `Unknown [${unknown}]`, y: unknown }
  ];

  const legendData = data.map(d=>({name: d.x}));

  return (
    <div className="floatingcard" style={{width: 660, height: 400, display: 'inline-block', margin: 10}}>
      <ChartTitle>Clients by Type</ChartTitle>
      <svg width={600} height={400}>
        <VictoryLegend standalone={false}
                       colorScale={colors}
                       x={420} y={0}
                       gutter={20}
                       title="Client Type"
                       centerTitle
                       data={legendData}
        />
        <VictoryPie
          standalone={false}
          labelComponent={<VictoryTooltip/>}
          data={data}
          width={400}
          padding={50}
          startAngle={-90}
          endAngle={90}
          colorScale={colors}
        />
      </svg>
    </div>
  );
};
