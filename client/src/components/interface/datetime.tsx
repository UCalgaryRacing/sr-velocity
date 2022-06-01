// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";
import DateTimePicker from "react-datetime-picker";
import "./_styling/datetime.css";

interface DateTimeProps {
  value: any;
  onChange: any;
}

export const DateTime: React.FC<DateTimeProps> = (props: DateTimeProps) => {
  return <DateTimePicker onChange={props.onChange} value={props.value} />;
};
