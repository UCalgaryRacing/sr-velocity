// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useWindowSize } from "hooks";
import { DashboardContext } from "../../dashboard";
import { SaveOutlined, Add } from "@mui/icons-material";
import { ChartModal, ChartPresetModal } from "components/modals";
import { DashboardLoading } from "pages/dashboard/loading";
import {
  IconButton,
  ToolTip,
  DropDown,
  Alert,
  TextButton,
} from "components/interface";
import {
  Sensor,
  Thing,
  Session,
  Chart,
  ChartPreset,
  RootState,
  isAuthAtLeast,
  UserRole,
  useAppSelector,
} from "state";
import { CircularProgress } from "@mui/material";
import { getChartPresets, getSessions, getSensors } from "crud";
import DashNav from "components/navigation/dashNav";
import { ChartBox, ChartBoxType } from "components/charts/chartBox";

interface PlotViewProps {
  things: Thing[];
  thing: Thing;
  onThingChange: (thing: Thing) => void;
}

const PlotView: React.FC<PlotViewProps> = (props: PlotViewProps) => {
  const size = useWindowSize();
  const context = useContext(DashboardContext);
  const user = useAppSelector((state: RootState) => state.user);

  const [fetching, setFetching] = useState<boolean>(false);
  const [chartPreset, setChartPreset] = useState<ChartPreset>();
  const [chartPresets, setChartPresets] = useState<ChartPreset[]>([]);
  const [session, setSession] = useState<Session>();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [charts, setCharts] = useState<Chart[]>([]);

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [alertError, setAlertError] = useState<boolean>(false);
  const [showChartModal, setShowChartModal] = useState<boolean>(false);
  const [showPresetModal, setShowPresetModal] = useState<boolean>(false);

  useEffect(() => {
    setFetching(true);
    getSessions(props.thing._id)
      .then((sessions: Session[]) => {
        let availableSessions: Session[] = [];
        sessions.sort((a: Session, b: Session) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        for (const session of sessions)
          if (session.generated) availableSessions.push(session);
        setSessions(availableSessions);
        if (availableSessions.length === 1) setSession(availableSessions[0]);
        getChartPresets(props.thing._id)
          .then((presets: ChartPreset[]) => {
            presets.sort((a: ChartPreset, b: ChartPreset) =>
              a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            );
            setChartPresets(presets);
            getSensors(props.thing._id).then((sensors: Sensor[]) => {
              sensors.sort((a: Sensor, b: Sensor) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase())
              );
              setSensors(sensors);
              setFetching(false);
            });
          })
          .catch((_: any) => {
            alert(true, "Could not fetch Presets...");
            setFetching(false);
          });
      })
      .catch((_: any) => {
        alert(true, "Could not fetch Sessions...");
        setFetching(false);
      });
  }, []);

  useEffect(() => {
    if (chartPreset) {
      let changed = false;
      if (charts.length === chartPreset.charts.length) {
        for (const chart of charts) {
          if (
            chartPreset.charts.filter((c) => c._id === chart._id).length === 0
          ) {
            changed = false;
          }
        }
      } else {
        setCharts(chartPreset ? chartPreset.charts : []);
      }
      if (changed) setCharts(chartPreset.charts);
    } else {
      setCharts([]);
    }
  }, [chartPreset]);

  const alert = (error: boolean, description: string) => {
    setAlertDescription(description);
    setAlertError(error);
    setShowAlert(true);
  };

  const onChartUpdate = useCallback(
    (chart: Chart) => {
      if (chart && chart._id) {
        let updatedCharts = [...charts];
        let updated = false;
        for (let i in updatedCharts) {
          if (updatedCharts[i]._id === chart._id) {
            updatedCharts[i] = chart;
            updated = true;
          }
        }
        if (!updated) updatedCharts.push(chart);
        updatedCharts.sort((a: Chart, b: Chart) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        setCharts(updatedCharts);
        if (updated) alert(false, "The Chart was updated.");
        else alert(false, "The Chart was created.");
      }
      setShowChartModal(false);
    },
    [charts]
  );

  const onDeleteChart = useCallback(
    (chartId: string) => {
      setCharts((prevCharts) =>
        prevCharts.filter((prevChart) => {
          return prevChart._id !== chartId;
        })
      );
    },
    [charts]
  );

  const onPresetUpdate = useCallback(
    (preset: ChartPreset) => {
      if (preset && preset._id) {
        let updatedPresets = [...chartPresets];
        let updated = false;
        for (let i in updatedPresets) {
          if (updatedPresets[i]._id === preset._id) {
            updatedPresets[i] = preset;
            updated = true;
          }
        }
        if (!updated) updatedPresets.push(preset);
        updatedPresets.sort((a: ChartPreset, b: ChartPreset) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        setChartPresets(updatedPresets);
        setChartPreset(preset);
        if (updated) alert(false, "The Preset was updated.");
        else alert(false, "The Preset was saved.");
      }
      setShowPresetModal(false);
    },
    [chartPresets]
  );

  const onDeletePreset = useCallback(
    (presetId: string) => {
      let updatedPresets = [];
      for (const preset of chartPresets)
        if (preset._id !== presetId) updatedPresets.push(preset);
      setChartPresets(updatedPresets);
      setChartPreset(undefined);
      alert(false, "The Preset was deleted.");
    },
    [chartPresets]
  );

  const generateCharts = useMemo(() => {
    if (!session || sensors.length === 0) return;
    return charts.map((chart) => {
      let chartSensors: Sensor[] = [];
      for (const id of chart.sensorIds)
        chartSensors.push(sensors.filter((s) => s._id === id)[0]);
      return (
        <ChartBox
          key={chart._id}
          chart={chart}
          allSensors={sensors}
          sensors={chartSensors}
          onDelete={onDeleteChart}
          onUpdate={onChartUpdate}
          charts={charts}
          type={ChartBoxType.STATIC}
          session={session}
        />
      );
    });
  }, [charts]);

  return (
    <>
      {fetching || !session ? (
        <DashboardLoading>
          {fetching && (
            <>
              <CircularProgress style={{ color: "black" }} />
              <br />
              <br />
              <b>Fetching Sessions, Sensors, and Presets...</b>
            </>
          )}
          {!fetching && !session && (
            <>
              {sessions?.length === 0 ? (
                <>No Sessions are available.</>
              ) : (
                <>
                  <b>Select a Session to view historical data for:</b>
                  <br />
                  <br />
                  <DropDown
                    placeholder="Select Session..."
                    options={sessions.map((session) => {
                      return { value: session, label: session.name };
                    })}
                    onChange={(value: any) => setSession(value.value)}
                    isSearchable
                  />
                </>
              )}
            </>
          )}
        </DashboardLoading>
      ) : (
        <>
          <DashNav margin={context.margin}>
            <div className="left">
              {size.width >= 916 && charts.length <= 10 ? (
                <ToolTip value="New Chart">
                  <IconButton
                    img={<Add />}
                    onClick={() => setShowChartModal(true)}
                  />
                </ToolTip>
              ) : (
                <TextButton
                  title="New Chart"
                  onClick={() => setShowChartModal(true)}
                />
              )}
              {charts.length > 0 && (
                <>
                  {size.width >= 916 ? (
                    <ToolTip value="Save Preset">
                      <IconButton
                        img={<SaveOutlined />}
                        onClick={() => setShowPresetModal(true)}
                        disabled={!isAuthAtLeast(user, UserRole.MEMBER)}
                      />
                    </ToolTip>
                  ) : (
                    <TextButton
                      title="Save Preset"
                      onClick={() => setShowPresetModal(true)}
                      disabled={!isAuthAtLeast(user, UserRole.MEMBER)}
                    />
                  )}
                </>
              )}
              {chartPresets.length !== 0 && (
                <DropDown
                  placeholder="Select Preset..."
                  options={(() => {
                    let options = [];
                    if (isAuthAtLeast(user, UserRole.MEMBER)) {
                      options.push({
                        value: undefined,
                        label: "New Preset",
                      });
                    }
                    options = options.concat(
                      // @ts-ignore
                      chartPresets.map((preset) => {
                        return { value: preset, label: preset.name };
                      })
                    );
                    return options;
                  })()}
                  onChange={(value: any) => {
                    setChartPreset(
                      value.label === "New Preset" ? undefined : value.value
                    );
                  }}
                  value={
                    chartPreset
                      ? {
                          value: chartPresets.filter(
                            (p) => p._id === chartPreset._id
                          )[0],
                          label: chartPreset.name,
                        }
                      : { value: undefined, label: "New Preset" }
                  }
                  isSearchable
                />
              )}
            </div>
            <div className="right">
              <DropDown
                placeholder="Select Thing..."
                options={props.things.map((thing) => {
                  return { value: thing._id, label: thing.name };
                })}
                onChange={(value: any) => {
                  for (const thing of props.things)
                    if (thing._id === value.value) props.onThingChange(thing);
                }}
                defaultValue={{
                  value: props.thing._id,
                  label: props.thing.name,
                }}
                isSearchable
              />
              <DropDown
                placeholder="Select Session..."
                options={sessions.map((session) => {
                  return { value: session._id, label: session.name };
                })}
                onChange={(value: any) => {
                  for (const session of sessions)
                    if (session._id === value.value) setSession(session);
                }}
                defaultValue={
                  session
                    ? {
                        value: session._id,
                        label: session.name,
                      }
                    : null
                }
                isSearchable
              />
            </div>
          </DashNav>
          <div id="chart-view">{generateCharts}</div>
          {charts.length === 0 && (
            <div id="dashboard-loading">
              <div id="dashboard-loading-content">
                <>
                  <b>
                    No Charts yet.
                    {chartPresets.length > 0
                      ? " Create one or select a preset."
                      : ""}
                  </b>
                  <TextButton
                    title="Add Chart"
                    onClick={() => setShowChartModal(true)}
                  />
                </>
              </div>
            </div>
          )}
          {showChartModal && (
            <ChartModal
              show={showChartModal}
              toggle={onChartUpdate}
              sensors={sensors}
              charts={charts}
            />
          )}
          {showPresetModal && (
            <ChartPresetModal
              show={showPresetModal}
              toggle={onPresetUpdate}
              chartPreset={chartPreset}
              charts={charts}
              thing={props.thing}
              onDelete={onDeletePreset}
            />
          )}
          <Alert
            title={alertError ? "Something went wrong..." : "Success!"}
            description={alertDescription}
            color={alertError ? "red" : "green"}
            onDismiss={() => setShowAlert(false)}
            show={showAlert}
            slideOut
          />
        </>
      )}
    </>
  );
};

export default PlotView;
