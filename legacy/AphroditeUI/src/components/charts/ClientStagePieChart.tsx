import React, { FC } from 'react';
import {VictoryPie, VictoryContainer, VictoryTheme, VictoryTooltip, VictoryChart, VictoryLegend} from "victory";
import { ClientsByStageStats } from "../../services/gcf/getStats";
import {ChartTitle} from "../Typography/ChartTitle";

const colors = ["tomato", "orange", "gold", "cyan", "navy", "#c0c0c0" ];

interface Props {
  clientsByStage: ClientsByStageStats;
}

export const ClientStagePieChart: FC<Props> = ({ clientsByStage }) => {
  const { firstTrimester, secondTrimester, thirdTrimester, postPartum, recentPostPartum, unknown, totalCount } = clientsByStage;

  const data = [
    { x: `1st Trimester [${firstTrimester}]`, y: firstTrimester },
    { x: `2nd Trimester [${secondTrimester}]`, y: secondTrimester },
    { x: `3rd Trimester [${thirdTrimester}]`, y: thirdTrimester },
    { x: `Post Partum, >6 weeks [${postPartum}]`, y: postPartum },
    { x: `Post Partum, <6 weeks [${recentPostPartum}]`, y: recentPostPartum},
    { x: `Unknown, no due date [${unknown}]`, y: unknown }
  ];

  const legendData = data.map(d=>({name: d.x}));

  return (
    <div className="floatingcard" style={{width: 660, height: 400, display: 'inline-block', margin: 10}}>
      <ChartTitle>Clients by Pregnancy Stage</ChartTitle>
      <svg width={600} height={400}>
        <VictoryLegend standalone={false}
                       colorScale={colors}
                       x={420} y={0}
                       gutter={20}
                       title="Pregnancy Stage"
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
