import { InputField, TextArea, TextButton } from "components/interface";
import React from "react";
import { useState } from 'react';
import { useForm } from "hooks";
const Request = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [values, handleChange] = useForm({
    email: "",
    name: "",
    phoneNumber: "",
    inquiry: "",
  });
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>):void => {
    event.preventDefault();
    console.log(values);
  }

  return (
      <div className="flex flex-col mt-24 justify-center items-center container">
        <img src="assets/team-logo.svg" className="max-w-[400px]"/>
        <h1>Contact Us</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 min-w-fit gap-8">
          <InputField
          name="name"
          type="name"
          title="Name"
          value={values.name}
          onChange={handleChange}
          required
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
          name="phoneNumber"
          type="phoneNumber"
          title="Phone Number"
          value={values.phoneNumber}
          onChange={handleChange}
          required
          />
          <TextArea
          holder="Inquiry"
          value={values.inquiry}
          onUpdate={handleChange}
          />
          <TextButton title="Send" loading={loading} />
        </form>
      </div> 
  )
}

export default Request;


