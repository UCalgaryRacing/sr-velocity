// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import { IconButton, ToolTip } from "components/interface";
import { DynamicLineChart, DynamicScatterChart } from "./dynamic";
import { StaticLineChart, StaticScatterChart } from "./static";
import { Sensor, Chart, ChartType, Session } from "state";
import { ChartModal, ConfirmModal } from "components/modals";
import { CloseOutlined, Edit } from "@mui/icons-material";
import { Stream } from "stream/stream";
import "./chartBox.css";

export enum ChartBoxType {
  DYNAMIC = "dynamic",
  STATIC = "static",
}

interface ChartBoxProps {
  chart: Chart;
  allSensors: Sensor[];
  sensors: Sensor[];
  stream?: Stream;
  onDelete?: (chartId: string) => void;
  onUpdate?: (chart: Chart) => void;
  charts: Chart[];
  session?: Session;
  type: ChartBoxType;
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
      <div className="chart-area">
        {(() => {
          switch (props.chart.type) {
            case ChartType.LINE:
              if (props.type === ChartBoxType.DYNAMIC) {
                return (
                  <DynamicLineChart
                    sensors={props.sensors}
                    stream={props.stream!}
                  />
                );
              } else {
                return (
                  <StaticLineChart
                    sensors={props.sensors}
                    session={props.session!}
                  />
                );
              }
            case ChartType.SCATTER:
              if (props.type === ChartBoxType.STATIC) {
                return (
                  <DynamicScatterChart
                    allSensors={props.allSensors}
                    sensors={props.sensors}
                    stream={props.stream!}
                  />
                );
              } else {
                return (
                  <StaticScatterChart
                    allSensors={props.allSensors}
                    sensors={props.sensors}
                    session={props.session!}
                  />
                );
              }
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
          charts={props.charts}
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
