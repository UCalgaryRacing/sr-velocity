// Copyright Schulich Racing FSAE
// Written by Jeremy Bilic, Justin Tijunelis

import React, { useState, useEffect } from "react";
import { useForm } from "hooks";
import { InputField, TextButton, DropDown, Alert } from "components/interface/";
import { getOrganizationNames, registerUser } from "crud";
import "./_styling/signUp.css";

const SignUp: React.FC = () => {
  const [organization, setOrganization] = useState<string>("");
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [showError, setShowError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [signedUp, setSignedUp] = useState<boolean>(false);
  const [values, handleChange] = useForm({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  useEffect(() => {
    getOrganizationNames()
      .then((organizations: any[]) => {
        let orgs = [];
        for (let org of organizations)
          orgs.push({ value: org._id, label: org.name });
        setOrganizations(orgs);
      })
      .catch((_: any) => {
        // Could provide the code depending on the error
        // Should probably not show the sign up page if we cannot fetch.
        setError("Could not fetch organizations. Refresh to reattempt.");
        setShowError(true);
      });
  }, []);

  const onSubmit = (event: any) => {
    event?.preventDefault();
    if (organization === "") {
      setError("Please select your organization.");
      setShowError(true);
    } else if (values.password !== values.passwordConfirm) {
      // Should probably have a hide/show on password fields
      setError("Passwords do not match, please try again.");
      setShowError(true);
    } else {
      let credentials = { ...values };
      credentials.organizationId = organization;
      delete credentials["passwordConfirm"];
      registerUser(credentials)
        .then((_: any) => setSignedUp(true))
        .catch((err: any) => {
          // Should provide more detail, what if the user already exists?
          // What if the display name is not unique?
          setError("Could not sign you up. Please try again.");
          setShowError(true);
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
              options={organizations}
              placeholder="Select Organization..."
              onChange={(value: any) => setOrganization(value._id)}
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
            <TextButton title="Sign Up" />
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
        description={error}
        color="red"
        onDismiss={() => setShowError(false)}
        show={showError}
        slideOut
      />
    </div>
  );
};

export default SignUp;
