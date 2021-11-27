import React, { useState, useEffect } from "react";
import { Button, Card, CardDeck } from "react-bootstrap";
import {
  lightningChart,
  emptyTick,
  DataPatterns,
  AxisScrollStrategies,
  SolidLine,
  SolidFill,
  ColorHEX,
  FontSettings,
  emptyLine,
} from "@arction/lcjs";
import "./_styling/lineChart.css";

type Properties = {
  sensors: any[];
  data: any;
  id: number;
  controlDerivative: (sensor: any) => void;
};

const LineChart: React.FC<Properties> = (props: Properties) => {
  const [mouseInteractions, setMouseInteractions] = useState(false);
  const chartId: number = Math.trunc(Math.random() * 100000);
  let chart: any;
  let iterator: number = 0;
  let lineSeries: any = [];
  let maxValue: number = 0;
  let minValue: number = 0;
  let setupComplete: boolean = false;
  const colours: string[] = [
    "#C22D2D",
    "#0071B2",
    "#009E73",
    "#E69D00",
    "#CC79A7",
  ];

  const theme = {
    whiteFill: new SolidFill({ color: ColorHEX("#FFFFFF") }),
    lightGrayFill: new SolidFill({ color: ColorHEX("#A0A0A0A0") }),
    darkFill: new SolidFill({ color: ColorHEX("#505050") }),
  };

  useEffect(() => {
    createChart();
    updateFontSize();
    window.addEventListener("resize", updateFontSize);

    return () => {
      chart.dispose();
    };
  }, []);

  const updateFontSize = (): void => {
    if (window.innerWidth < 1000) {
      var axis = chart.getDefaultAxisY();
      var font = new FontSettings();
      font = font.setFamily("helvetica");
      font = font.setWeight("bold");
      font = font.setSize(12);
      axis.setTickStyle((visibleTick: any) =>
        visibleTick
          .setTickStyle(emptyLine)
          .setLabelFont(font)
          .setLabelFillStyle(new SolidFill({ color: ColorHEX("#000") }))
          .setGridStrokeStyle(
            new SolidLine({
              thickness: 1.5,
              fillStyle: new SolidFill({ color: ColorHEX("#FFF") }),
            })
          )
      );
    }
  };
  const removeSeries = (index: any, parent: any, update: any): void => {
    for (var series in lineSeries) {
      if (lineSeries[series].getName() === index) {
        lineSeries[series].dispose();
        lineSeries.splice(series, 1);
      }
    }
    if (update) return;
    let min = Math.round(lineSeries[parent].getYMin() * 1.3);
    let max = Math.round(lineSeries[parent].getYMax() * 1.3);
    if (Math.abs(min) < 1.5 && Math.abs(max) < 1.5) {
      min = -2;
      max = 2;
    }
    if (min > 0) min = 0;
    minValue = min;
    maxValue = max;
    chart.getDefaultAxisY().setInterval(min, max);
    if (chart.getAxes()[2]) chart.getAxes()[2].setInterval(min, max);
  };

  const addDerivativeSeries = (data: any, index: any): void => {
    let map = [];
    for (let i = 0; i < data.length; i++) map.push({ x: i, y: data[i] });
    var colour = colours[lineSeries.length];
    if (index !== undefined) {
      let parentIndex: any = props.sensors.findIndex(
        (item) => item.name + "'" === index
      );
      colour = colours[parentIndex];
    }
    var childIndex = props.sensors.findIndex((item) => item.name === index);
    if (childIndex >= 0) {
      removeSeries(index, childIndex, true);
    }
    lineSeries.push(
      chart
        .addLineSeries({ dataPattern: DataPatterns.horizontalProgressive })
        .setName(index)
    );
    lineSeries[lineSeries.length - 1]
      .setStrokeStyle(
        new SolidLine({
          thickness: 2,
          fillStyle: new SolidFill({ color: ColorHEX(colour) }),
        }).setFillStyle((solidfill) =>
          solidfill.setA(index !== undefined ? parseInt("80") : parseInt("FF"))
        )
      )
      .setMouseInteractions(mouseInteractions)
      .setResultTableFormatter(
        (builder: any, series: any, Xvalue: any, Yvalue: any) => {
          return builder.addRow(
            series.getName() +
              ": " +
              Yvalue.toFixed(2) +
              " " +
              props.sensors[lineSeries.length - 1].output_unit
          );
        }
      )
      .add(map.map((point) => ({ x: point.x, y: point.y })));
  };

  const toggleRightAxis = (): void => {
    if (chart.getAxes()[2]) {
      chart.getAxes()[2].dispose();
    } else {
      chart.addAxisY(true);
      var axis = chart.getAxes()[2];
      var font = new FontSettings({});
      font = font.setFamily("helvetica");
      font = font.setWeight("bold");
      axis.setTickStyle((visibleTick: any) =>
        visibleTick
          .setTickStyle(emptyLine)
          .setLabelFont(font)
          .setLabelFillStyle(new SolidFill({ color: ColorHEX("#000") }))
          .setGridStrokeStyle(
            new SolidLine({
              thickness: 1,
              fillStyle: new SolidFill({ color: ColorHEX("#FFF") }),
            })
          )
      );
      axis
        .setScrollStrategy(AxisScrollStrategies.expansion)
        .setMouseInteractions(mouseInteractions)
        .setStrokeStyle(
          new SolidLine({
            thickness: 3,
            fillStyle: new SolidFill({ color: ColorHEX("#C8C8C8") }),
          })
        );
      axis.setInterval(minValue, maxValue);
    }
  };

  const toggleGrid = (): void => {
    var axis = chart.getDefaultAxisY();
    var font = new FontSettings({});
    font = font.setFamily("helvetica");
    font = font.setWeight("bold");
    axis.setTickStyle((visibleTick: any) => {
      const hideGrid = visibleTick.getGridStrokeStyle().fillStyle.color.r !== 1;
      return visibleTick
        .setTickStyle(emptyLine)
        .setLabelFont(font)
        .setLabelFillStyle(new SolidFill({ color: ColorHEX("#000") }))
        .setGridStrokeStyle(
          new SolidLine({
            thickness: 1.5,
            fillStyle: new SolidFill({
              color: ColorHEX(hideGrid ? "#FFF" : "#C8C8C8"),
            }),
          })
        );
    });
  };

  const createChart = (): void => {
    //
    chart = lightningChart()
      .ChartXY()
      .setBackgroundFillStyle(theme.whiteFill)
      .setSeriesBackgroundFillStyle(theme.whiteFill);
    chart
      .setMouseInteractions(mouseInteractions)
      .setMouseInteractionWheelZoom(mouseInteractions)
      .setMouseInteractionPan(mouseInteractions)
      .setMouseInteractionRectangleFit(mouseInteractions)
      .setMouseInteractionRectangleZoom(mouseInteractions)
      .setMouseInteractionsWhileScrolling(mouseInteractions)
      .setMouseInteractionsWhileZooming(mouseInteractions);
    //Configure the cursor
    let autoCursor = chart.getAutoCursor();
    autoCursor.setGridStrokeXStyle(
      new SolidLine({
        thickness: 1,
        fillStyle: new SolidFill({ color: ColorHEX("#C22D2D") }),
      })
    );
    autoCursor.setGridStrokeYStyle(
      new SolidLine({
        thickness: 1,
        fillStyle: new SolidFill({ color: ColorHEX("#C22D2D") }),
      })
    );
    autoCursor.getPointMarker().setSize(0);
    autoCursor.disposeTickMarkerX();
    autoCursor.disposeTickMarkerY();
    var font = new FontSettings({});
    font = font.setFamily("helvetica");
    font = font.setWeight("bold");
    autoCursor.getResultTable().setFont(font);
    autoCursor
      .getResultTable()
      .setTextFillStyle(new SolidFill({ color: ColorHEX("#FFF") }));
    autoCursor
      .getResultTable()
      .getBackground()
      .setFillStyle(new SolidFill({ color: ColorHEX("#C22D2D") }));
    //Configure the axes
    chart
      .getDefaultAxisX()
      .setScrollStrategy(AxisScrollStrategies.progressive)
      .setTickStyle(emptyTick)
      .setMouseInteractions(mouseInteractions)
      .setInterval(0, 300)
      .setStrokeStyle(
        new SolidLine({
          thickness: 3,
          fillStyle: new SolidFill({ color: ColorHEX("#C8C8C8") }),
        })
      );
    chart
      .getDefaultAxisY()
      .setScrollStrategy(AxisScrollStrategies.expansion)
      .setMouseInteractions(mouseInteractions)
      .setStrokeStyle(
        new SolidLine({
          thickness: 3,
          fillStyle: new SolidFill({ color: ColorHEX("#C8C8C8") }),
        })
      );
    var axis = chart.getDefaultAxisY();
    var font = new FontSettings({});
    font = font.setFamily("helvetica");
    font = font.setWeight("bold");
    axis.setTickStyle((visibleTick: any) =>
      visibleTick
        .setTickStyle(emptyLine)
        .setLabelFont(font)
        .setLabelFillStyle(new SolidFill({ color: ColorHEX("#000") }))
        .setGridStrokeStyle(
          new SolidLine({
            thickness: 1.5,
            fillStyle: new SolidFill({ color: ColorHEX("#FFF") }),
          })
        )
    );
    //Configure the line series
    for (var i = 0; i < props.sensors.length; i++) {
      lineSeries.push(
        chart
          .addLineSeries({ dataPattern: DataPatterns.horizontalProgressive })
          .setName(props.sensors[i].name)
      );
      lineSeries[i]
        .setStrokeStyle(
          new SolidLine({
            thickness: 2,
            fillStyle: new SolidFill({ color: ColorHEX(colours[i]) }),
          })
        )
        .setMouseInteractions(mouseInteractions)
        .setResultTableFormatter(
          (builder: any, series: any, Xvalue: any, Yvalue: any) => {
            return builder.addRow(
              series.getName() +
                ": " +
                Yvalue.toFixed(2) +
                " " +
                props.sensors[0].output_unit
            );
          }
        );
    }
    //Allow scrolling while hovering over chart
    chart.engine.container.onwheel = null;
    setupComplete = true;
  };
  const changeInterval = (lower: number, upper: number): void => {
    chart.getDefaultAxisX().setInterval(lower, upper);
  };

  const pullData = (): void => {
    let data = props.data;
    if (data === undefined) return;
    if (data.length === 0) return;
    if (setupComplete) {
      //Set the interval
      var setInterval = false;
      for (let i in data) {
        if (data[i] > maxValue) {
          maxValue = data[i];
          setInterval = true;
        }
      }
      for (let i in data) {
        if (data[i] < minValue) {
          minValue = data[i];
          setInterval = true;
        }
      }
      if (setInterval) {
        let min = Math.floor(minValue * 1.3);
        let max = Math.ceil(maxValue * 1.3);
        if (props.sensors[0].category === "Acceleration") max = 2;
        minValue = min;
        maxValue = max;
        chart.getDefaultAxisY().setInterval(min, max);
        if (chart.getAxes()[2]) chart.getAxes()[2].setInterval(min, max);
      }
      //Add the data
      if (data.length === 1) lineSeries[0].add({ x: iterator, y: data[0] });
      else {
        var i = 0;
        while (i < lineSeries.length) {
          lineSeries[i].add({ x: i, y: data[i] });
          i++;
        }
      }
      iterator++;
    }
  };

  const toggleSeries = (index: any): void => {
    if (lineSeries[index].isDisposed()) lineSeries[index].restore();
    else lineSeries[index].dispose();
    setMouseInteractions(mouseInteractions);
  };

  //Just to shorten the code a bit
  let data = props.data;
  let sensors = props.sensors;
  let content = [];
  //Make all of the columns for displaying current values
  for (const sensor in sensors) {
    if (sensors[sensor].derivative) continue;
    const derivative = sensors.filter(
      (item) => item.name === sensors[sensor].name + "'" && item.derivative
    );
    content.push(
      <div id="chart-text">
        <Card border="light" style={{ width: "313px", margin: "auto" }}>
          <Card.Body style={{ padding: "0" }}>
            <div
              id="outer-col"
              className="col"
              style={{
                textAlign: "center",
                padding: "0",
                paddingBottom: "3px",
                margin: "auto",
              }}
            >
              <div
                className="row"
                style={{ textAlign: "center", padding: "0", margin: "auto" }}
              >
                <div style={{ margin: "auto" }}>
                  <div
                    className="col-xs"
                    style={{
                      color: colours[sensor],
                      fontStyle: "bold",
                      textAlign: "right",
                      padding: "0",
                      fontSize: "1rem",
                      display: "inline-block",
                      marginTop: "5px",
                      width: "143px",
                    }}
                  >
                    <Button
                      id="derivativeButton"
                      onClick={() => {
                        props.controlDerivative(sensors[sensor].name);
                      }}
                    >
                      <b style={{ fontStyle: "italic", fontSize: "1rem" }}>
                        f'(x)
                      </b>
                    </Button>
                    <b
                      style={{
                        fontSize: "1rem",
                        float: "right",
                        display: "inline-block",
                        marginTop: "3px",
                        cursor: "pointer",
                        textDecoration:
                          lineSeries[sensor] !== undefined &&
                          lineSeries[sensor].isDisposed()
                            ? "line-through"
                            : "none",
                      }}
                      onClick={() => toggleSeries(sensor)}
                    >
                      {sensors[sensor].name}:
                    </b>
                  </div>
                  <div
                    className="col-xs"
                    style={{
                      fontStyle: "bold",
                      textAlign: "center",
                      padding: "0",
                      fontSize: "1rem",
                      width: "70px",
                      display: "inline-block",
                    }}
                  >
                    <b style={{ verticalAlign: "middle" }}>
                      {data === undefined ? "0" : data[sensor]}
                    </b>
                  </div>
                  <div
                    className="col-xs"
                    style={{
                      fontStyle: "bold",
                      textAlign: "left",
                      padding: "0",
                      fontSize: "1rem",
                      display: "inline-block",
                      marginBottom: "5px",
                    }}
                  >
                    <b style={{ verticalAlign: "middle", marginTop: "3px" }}>
                      {sensors[0].output_unit}
                    </b>
                  </div>
                </div>
              </div>
              {derivative.length !== 0 ? (
                <div
                  className="row"
                  style={{
                    textAlign: "center",
                    padding: "0",
                    margin: "auto",
                    marginTop: "5px",
                    width: "100%",
                  }}
                >
                  <div style={{ margin: "auto" }}>
                    <div
                      className="col-xs"
                      style={{
                        color: colours[sensor] + "80",
                        fontStyle: "bold",
                        textAlign: "right",
                        padding: "0",
                        fontSize: "1rem",
                        display: "inline-block",
                        width: "143px",
                      }}
                    >
                      <div style={{ width: "34px" }} />
                      <b>{derivative[0].name}</b>
                    </div>
                    <div
                      className="col-xs"
                      style={{
                        fontStyle: "bold",
                        textAlign: "center",
                        padding: "0",
                        fontSize: "1rem",
                        width: "70px",
                        display: "inline-block",
                      }}
                    >
                      <b></b>
                    </div>
                    <div
                      className="col-xs"
                      style={{
                        fontStyle: "bold",
                        textAlign: "left",
                        padding: "0",
                        fontSize: "1rem",
                        width: "100px",
                        display: "inline-block",
                        marginBottom: "5px",
                      }}
                    >
                      <b
                        style={{ verticalAlign: "middle", marginTop: "3px" }}
                      ></b>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div id="lineChart" style={{ marginBottom: "20px" }}>
      {window.innerHeight < 1000 ? (
        content
      ) : (
        <CardDeck
          style={{
            justifyContent: "center",
            marginLeft: "5px",
            marginRight: "5px",
          }}
        >
          {content}
        </CardDeck>
      )}
      <div
        id={chartId.toString()}
        style={{ height: "500px" }}
        className="fill"
      ></div>
    </div>
  );
};

export default LineChart;
