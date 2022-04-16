// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis and Joey Van Lierop

import { Modal } from "@mui/material";
import { InputField } from "components/interface";
import { TextSpinnerButton } from "components/interface/textSpinnerButton";
import DashNav from "components/navigation/dashNav";
import { postSensor } from "crud";
import { useForm } from "hooks";
import React, { useContext, useState } from "react";
import { RootState, Sensor, useAppSelector } from "state";
import { DashboardContext } from "../dashboard";
import ManageCard from "./manageCard";
import ManageNav from "./manageNav";
import "./_styling/manage.css";

const initialForm = {
  type: "",
  category: "",
  name: "",
  frequency: "",
  unit: "",
  canId: "",
  lowerCalibration: "",
  conversionMultiplier: "",
  upperWarning: "",
  lowerWarning: "",
  upperDanger: "",
  lowerDanger: "",
  disabled: false,
};

const Manage: React.FC = () => {
  const context = useContext(DashboardContext);
  const dashboard = useAppSelector((state: RootState) => state.dashboard);
  const [cards, setCards] = useState<{ [key: string]: Sensor[] }>({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, handleChange, setValues] = useForm(initialForm);

  const addCard = (newCard: Sensor) => {
    let newCards = { ...cards };
    if (newCards[context.page]) {
      newCards[context.page].push(newCard);
    } else {
      newCards = {
        ...newCards,
        [context.page]: [newCard],
      };
    }
    setCards(newCards);
  };

  const onSubmit = async (event: any) => {
    if (loading) {
      return;
    }
    event?.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500)); // TEMP FOR TESTING
    try {
      const newSensor = await postSensor(values);
      addCard(newSensor);
      setOpen(false);
      setValues(initialForm);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (dashboard.section === "Manage") {
    return (
      <>
        <DashNav margin={context.margin}>
          <ManageNav onAddCard={() => setOpen(true)} />
        </DashNav>
        <div>
          {cards[context.page]?.map((data) => (
            <ManageCard key={data._id} data={data} />
          ))}
        </div>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div id="add-popup">
            <h2>New sensor</h2>
            <InputField
              name="name"
              placeholder="Name"
              value={values.name}
              onChange={handleChange}
              required
            />
            <InputField
              name="type"
              placeholder="Type"
              value={values.type}
              onChange={handleChange}
              required
            />
            <InputField
              name="category"
              placeholder="Category"
              value={values.category}
              onChange={handleChange}
            />
            <InputField
              name="canId"
              placeholder="CanID"
              pattern="[a-fA-F\d]+"
              value={values.canId}
              onChange={handleChange}
              required
            />
            <InputField
              name="frequency"
              placeholder="Frequency"
              type="number"
              value={values.frequency}
              onChange={handleChange}
              required
            />
            <InputField
              name="unit"
              placeholder="Unit"
              type="number"
              value={values.unit}
              onChange={handleChange}
            />
            <InputField
              name="lowerCalibration"
              placeholder="Lower Calibration"
              type="number"
              value={values.lowerCalibration}
              onChange={handleChange}
              required
            />
            <InputField
              name="conversionMultiplier"
              placeholder="Calibration Multiplier"
              type="number"
              value={values.conversionMultiplier}
              onChange={handleChange}
              required
            />
            <InputField
              name="upperWarning"
              placeholder="Upper Warning"
              type="number"
              value={values.upperWarning}
              onChange={handleChange}
              required
            />
            <InputField
              name="lowerWarning"
              placeholder="Lower Warning"
              type="number"
              value={values.lowerWarning}
              onChange={handleChange}
              required
            />
            <InputField
              name="upperDanger"
              placeholder="Upper Danger"
              type="number"
              value={values.upperDanger}
              onChange={handleChange}
              required
            />
            <TextSpinnerButton
              title="Add"
              loading={loading}
              onClick={onSubmit}
            />
          </div>
        </Modal>
      </>
    );
  } else {
    return <></>;
  }
};

export default Manage;
