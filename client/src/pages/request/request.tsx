import { InputField, TextArea, TextButton } from "components/interface";
import React from "react";
import { useState } from 'react';
import { useForm } from "hooks";
import "./request.css";
const Request = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [inputs, handleChange] = useForm({
    email: "",
    fname: "",
    lname: "",
    inquiry: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>):void => {
    event.preventDefault();
    console.log(inputs);
  }

  return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center place-content-center px-8 gap-5 container" >
        <div className="grid grid-col-1 items-center justify-center border-1 border-black gap-5">
          <img src="assets/team-logo.svg" className="w-fit"/>
          <h1>Contact Us</h1>
          <p></p>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-8 border-1 border-black">
          <div className="flex flex-col md:flex-row justify-between gap-x-2 gap-y-8">
            <InputField
            name="fname"
            type="fname"
            title="First Name"
            value={inputs.fname}
            onChange={handleChange}
            required
            />
            <InputField
            name="lname"
            type="lname"
            title="Last Name"
            value={inputs.name}
            onChange={handleChange}
            required
            />
          </div>
          <InputField
          name="email"
          type="email"
          title="Email"
          value={inputs.email}
          onChange={handleChange}
          required
          />
          <InputField
          name="inquiry"
          type="inquiry"
          title="Inquiry"
          value={inputs.inquiry}
          onChange={handleChange}
          required
          />
          {/* <TextArea
          holder="Inquiry"
          value={inputs.inquiry}
          onUpdate={handleChange}
          /> */}
          <TextButton title="Send" loading={loading} />
        </form>
      </div> 
  )
}

export default Request;


