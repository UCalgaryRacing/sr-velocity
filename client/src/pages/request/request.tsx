import { useState } from 'react';

export const request = () => {

  const[name, setName] = useState("")
  const[email, setEmail] = useState("")
  const[inquiry, setInquiry] = useState("")

  const handleSubmit = (event:any) => {

  }
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
      </label>
      <label>
        Email:
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
      </label>
      <label>
        Inquiry:
        <textarea placeholder="Enter question here" value={inquiry} onChange={(e) => setInquiry(e.target.value)}/>
      </label>
      <input type="submit" />
    </form>
  )
}


