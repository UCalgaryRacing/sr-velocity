// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import { IconButton, ToolTip } from "components/interface";
import { Heatmap, LineChart, RadialChart, ScatterChart } from "./charts";
import { Sensor, Chart, ChartType } from "state";
import { ChartModal, ConfirmModal } from "components/modals";
import { CloseOutlined, Edit } from "@mui/icons-material";
import { Stream } from "stream/stream";
import "./_styling/chartBox.css";

interface ChartBoxProps {
  chart: Chart;
  allSensors: Sensor[];
  sensors: Sensor[]; // TODO: Remove this and filter via chart.sensorIds
  stream: Stream;
  onDelete?: (chartId: string) => void;
  onUpdate?: (chart: Chart) => void;
}

export const ChartBox: React.FC<ChartBoxProps> = (props: ChartBoxProps) => {
  const [showChartModal, setShowChartModal] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  return (
    <div className="chart-box">
      <div className="chart-title">{props.chart.name}</div>
      <div className="chart-controls">
        <ToolTip value="Edit Chart">
          <IconButton img={<Edit />} onClick={() => setShowChartModal(true)} />
        </ToolTip>
        <ToolTip value="Close">
          <IconButton
            img={<CloseOutlined />}
            onClick={() => setShowConfirmation(true)}
          />
        </ToolTip>
      </div>
      <div className="chart-legend"></div>
      <div className="chart-area">
        {(() => {
          switch (props.chart.type) {
            case ChartType.HEATMAP:
              return <Heatmap />;
            case ChartType.LINE:
              return (
                <LineChart sensors={props.sensors} stream={props.stream} />
              );
            case ChartType.RADIAL:
              return <RadialChart />;
            case ChartType.SCATTER:
              return <ScatterChart />;
            default:
              return <></>; // Show error
          }
        })()}
      </div>
      {showChartModal && (
        <ChartModal
          show={showChartModal}
          toggle={(chart: Chart) => {
            if (props.onUpdate) props.onUpdate(chart);
            setShowChartModal(false);
          }}
          sensors={props.allSensors}
          chart={props.chart}
        />
      )}
      <ConfirmModal
        title={
          "Are you sure you want to delete Chart '" + props.chart.name + "'?"
        }
        show={showConfirmation}
        toggle={() => setShowConfirmation(false)}
        onConfirm={() => {
          if (props.onDelete) props.onDelete(props.chart._id);
        }}
      />
    </div>
  );
};
