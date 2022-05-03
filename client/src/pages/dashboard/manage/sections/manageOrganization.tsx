// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import {
  RootState,
  useAppSelector,
  useAppDispatch,
  organizationFetched,
} from "state";
import { bindActionCreators } from "redux";
import {
  InputField,
  TextButton,
  IconButton,
  Alert,
  ToolTip,
} from "components/interface/";
import { putOrganization, issueNewAPIKey } from "crud";
import { ContentCopy, Cached } from "@mui/icons-material";
import { useForm } from "hooks";
import "./_styling/manageOrganization.css";

export const ManageOrganization: React.FC = () => {
  const organization = useAppSelector((state: RootState) => state.organization);
  const setOrganization = bindActionCreators(
    organizationFetched,
    useAppDispatch()
  );

  const [values, handleChange] = useForm({ ...organization });
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertColor, setAlertColor] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [updateKeyLoading, setUpdateKeyLoading] = useState<boolean>(false);

  const alert = (error: boolean, description: string) => {
    if (error) setAlertTitle("Something went wrong...");
    else setAlertTitle("Success!");
    setAlertColor(error ? "red" : "green");
    setAlertDescription(description);
    setShowAlert(true);
  };

  const onSubmit = (event: any) => {
    event?.preventDefault();
    setUpdateLoading(true);
    putOrganization(values)
      .then((_: any) => {
        setOrganization(values);
        alert(false, "Your organization was updated!");
        setUpdateLoading(false);
      })
      .catch((err: any) => {
        if (err.status === 409)
          alert(true, "This organization name is already taken.");
        else alert(true, "Please try again...");
        setUpdateLoading(false);
      });
  };

  const requestNewKey = () => {
    setUpdateKeyLoading(true);
    issueNewAPIKey()
      .then((newKey: string) => {
        if (organization) {
          let updatedOrganization = { ...organization };
          updatedOrganization.apiKey = newKey;
          setOrganization(updatedOrganization);
        }
        alert(false, "A new API key has been issued.");
        setUpdateKeyLoading(false);
      })
      .catch((_: any) => {
        alert(true, "Please try again...");
        setUpdateKeyLoading(false);
      });
  };

  return (
    <div id="centered">
      <div id="centered-content">
        <form id="sign-in-form" onSubmit={onSubmit}>
          <img src="assets/team-logo.svg" />
          <InputField
            name="name"
            type="name"
            title="Organization Name"
            value={values.name}
            onChange={handleChange}
            required
          />
          <div id="api-key">
            <div id="api-key-title">
              <b>API Key</b>
            </div>
            <div id="api-key-content">
              {organization?.apiKey}
              <ToolTip value="Copy">
                <IconButton
                  id="copy-key"
                  type="button"
                  img={<ContentCopy />}
                  onClick={() =>
                    navigator.clipboard.writeText(organization?.apiKey!)
                  }
                />
              </ToolTip>
              <ToolTip value="Issue New Key">
                <IconButton
                  id="new-key"
                  type="button"
                  img={<Cached />}
                  onClick={requestNewKey}
                />
              </ToolTip>
            </div>
          </div>
          <TextButton title="Update" loading={updateLoading} />
        </form>
      </div>
      <Alert
        title={alertTitle}
        description={alertDescription}
        color={alertColor}
        onDismiss={() => setShowAlert(false)}
        show={showAlert}
        slideOut
      />
    </div>
  );
};
