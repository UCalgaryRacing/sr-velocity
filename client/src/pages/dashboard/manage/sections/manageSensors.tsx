// Copyright Schulich Racing, FSAE
// Written by Joey Van Lierop, Justin Tijunelis

import React, { useState, useEffect, useContext } from "react";
import { DashboardContext } from "pages/dashboard/dashboard";
import DashNav from "components/navigation/dashNav";
import ManageNav from "../manageNav";
import { RootState, Sensor, useAppSelector } from "state";

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

export const ManageSensors: React.FC = () => {
  const context = useContext(DashboardContext);
  const dashboard = useAppSelector((state: RootState) => state.dashboard);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [sensorCards, setSensorCards] = useState<any>([]);

  useEffect(() => {
    // Fetch sensors
    // We need to know the thing in the dashboard
  }, []);

  const onNewSensor = () => {
    // Make request to post the sensor
    // On success, add a new card in the correct order
  };

  const onSearch = (query: string) => {};

  return (
    <div id="manage-sensors">
      <DashNav margin={context.margin}>
        <ManageNav onAddCard={onNewSensor} />
      </DashNav>
    </div>
  );
};

// const dashboard = useAppSelector((state: RootState) => state.dashboard);
// const [cards, setCards] = useState<{ [key: string]: Sensor[] }>({});
// const [open, setOpen] = useState(false);
// const [loading, setLoading] = useState(false);
// const [values, handleChange, setValues] = useForm(initialForm);

// const addCard = (newCard: Sensor) => {
//   let newCards = { ...cards };
//   if (newCards[context.page]) {
//     newCards[context.page].push(newCard);
//   } else {
//     newCards = {
//       ...newCards,
//       [context.page]: [newCard],
//     };
//   }
//   setCards(newCards);
// };

// const onSubmit = async (event: any) => {
//   // if (loading) {
//   //   return;
//   // }
//   // event?.preventDefault();
//   // setLoading(true);
//   // await new Promise((r) => setTimeout(r, 500)); // TEMP FOR TESTING
//   // try {
//   //   const newSensor = await postSensor(values);
//   //   addCard(newSensor);
//   //   setOpen(false);
//   //   setValues(initialForm);
//   // } catch {
//   // } finally {
//   //   setLoading(false);
//   // }
// };

// if (dashboard.section === "Manage") {
//   return (
//     <>
//       <DashNav margin={context.margin}>
//         <ManageNav onAddCard={() => setOpen(true)} />
//       </DashNav>
//       <div>
//         {cards[context.page]?.map((data) => (
//           <ManageCard key={data._id} data={data} />
//         ))}
//       </div>
//       <Modal
//         open={open}
//         onClose={() => setOpen(false)}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         {/*TODO: Add form wrapper*/}
//         <div id="add-popup">
//           <h2>New sensor</h2>
//           <InputField
//             name="name"
//             placeholder="Name"
//             value={values.name}
//             onChange={handleChange}
//             required
//           />
//           <InputField
//             name="type"
//             placeholder="Type"
//             value={values.type}
//             onChange={handleChange}
//             required
//           />
//           <InputField
//             name="category"
//             placeholder="Category"
//             value={values.category}
//             onChange={handleChange}
//           />
//           <InputField
//             name="canId"
//             placeholder="CanID"
//             pattern="[a-fA-F\d]+"
//             value={values.canId}
//             onChange={handleChange}
//             required
//           />
//           <InputField
//             name="frequency"
//             placeholder="Frequency"
//             type="number"
//             value={values.frequency}
//             onChange={handleChange}
//             required
//           />
//           <InputField
//             name="unit"
//             placeholder="Unit"
//             type="number"
//             value={values.unit}
//             onChange={handleChange}
//           />
//           <InputField
//             name="lowerCalibration"
//             placeholder="Lower Calibration"
//             type="number"
//             value={values.lowerCalibration}
//             onChange={handleChange}
//             required
//           />
//           <InputField
//             name="conversionMultiplier"
//             placeholder="Calibration Multiplier"
//             type="number"
//             value={values.conversionMultiplier}
//             onChange={handleChange}
//             required
//           />
//           <InputField
//             name="upperWarning"
//             placeholder="Upper Warning"
//             type="number"
//             value={values.upperWarning}
//             onChange={handleChange}
//             required
//           />
//           <InputField
//             name="lowerWarning"
//             placeholder="Lower Warning"
//             type="number"
//             value={values.lowerWarning}
//             onChange={handleChange}
//             required
//           />
//           <InputField
//             name="upperDanger"
//             placeholder="Upper Danger"
//             type="number"
//             value={values.upperDanger}
//             onChange={handleChange}
//             required
//           />
//           <TextButton title="Add" loading={loading} onClick={onSubmit} />
//         </div>
//       </Modal>
//     </>
//   );
// } else {
//   return <></>;
// }
