import { useState } from "react";
import { useDispatch } from "react-redux";
import { createProfileData } from './profiles'

import "../../styles/forms.css"



export default function ProfileForm() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    timezone: "Asia/Kolkata"
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createProfileData(form));
    setForm({
      name: "",
      timezone: "Asia/Kolkata"
    })
  }
  return (
    <div className="profile-form">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Profiles</h2>
        <h4>Create Profile</h4>
        <label className="form-label">Name</label>
        <input
          className="form-input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <label className="form-label">TimeZone</label>
        <select
          className="form-input"
          value={form.timezone}
          onChange={(e) => setForm({ ...form, timezone: e.target.value })}
        >
          <option>UTC</option>
          <option>Asia/Kolkata</option>
          <option>America/Los_Angeles</option>
          <option>Europe/London</option>


        </select>

        <button type="submit" className="btn">Create</button>

      </form>
    </div>
  )
}
