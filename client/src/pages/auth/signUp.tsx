// Copyright Schulich Racing FSAE
// Written by Jeremy Bilic, Justin Tijunelis

import React, { useState, useEffect } from "react";
import { InputField, TextButton, DropDown, Alert } from "components/interface/";
import { getOrganizationNames, registerUser } from "crud";
import { useForm } from "hooks";
import "./_styling/signUp.css";

// TODO: Load to get organizations
const SignUp: React.FC = () => {
  const [organization, setOrganization] = useState<string>("");
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [signedUp, setSignedUp] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [values, handleChange] = useForm({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  useEffect(() => {
    getOrganizationNames()
      .then((organizations: any[]) => {
        let orgs = [];
        for (let org of organizations)
          orgs.push({ value: org._id, label: org.name });
        setOrganizations(orgs);
      })
      .catch((_: any) => {
        alert("Could not fetch organizations. Refresh to reattempt.");
      });
  }, []);

  const onSubmit = (event: any) => {
    event?.preventDefault();
    if (organization === "") {
      alert("Please select your organization.");
    } else if (values.password !== values.passwordConfirm) {
      alert("Passwords do not match, please try again.");
    } else {
      setLoading(true);
      let credentials = { ...values };
      credentials.organizationId = organization;
      delete credentials["passwordConfirm"];
      registerUser(credentials)
        .then((_: any) => {
          setLoading(false);
          setSignedUp(true);
        })
        .catch((err: any) => {
          setLoading(false);
          if (err.status === 409)
            alert("Looks like this email or display name already exists.");
          else alert("Could not sign you up. Please try again.");
        });
    }
  };

  return (
    <div className="page-content" id="sign-up">
      <form id="sign-up-form" onSubmit={onSubmit}>
        <img src="assets/team-logo.svg" />
        {!signedUp ? (
          <>
            <InputField
              name="displayName"
              type="name"
              title="Display Name"
              value={values.name}
              onChange={handleChange}
              required
            />
            <DropDown
              placeholder="Select Organization..."
              options={organizations}
              onChange={(value: any) => setOrganization(value._id)}
              isSearchable
            />
            <InputField
              name="email"
              type="email"
              title="Email"
              value={values.email}
              onChange={handleChange}
              required
            />
            <InputField
              name="password"
              type="password"
              title="Password"
              value={values.password}
              onChange={handleChange}
              required
            />
            <InputField
              name="passwordConfirm"
              type="password"
              title="Password Confirmation"
              value={values.passwordConfirm}
              onChange={handleChange}
              required
            />
            <TextButton title="Sign Up" loading={loading} />
            <div id="redirect">
              <b>
                Already have an account?&nbsp;<a href="/sign-in">Sign In</a>
              </b>
            </div>
          </>
        ) : (
          <div id="sign-up-success">
            Success! Please wait for an admin to approve your request.
            <br />
            <br />
            <TextButton title="Back To Home Page" href="/" />
          </div>
        )}
      </form>
      <Alert
        title="Something went wrong..."
        description={alertDescription}
        color="red"
        onDismiss={() => setShowAlert(false)}
        show={showAlert}
        slideOut
      />
    </div>
  );
};

export default SignUp;
