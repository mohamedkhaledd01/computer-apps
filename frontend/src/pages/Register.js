import { useState } from "react";
import FormInput from "../components/FormInput";
import Message from "../components/Message";
import { authService } from "../services/lmsService";

function Register({ onRegister, goToLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await authService.register(form);
      onRegister(response.data.user);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit} className="form">
          <FormInput label="Name" name="name" value={form.name} onChange={handleChange} />
          <FormInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <label className="field">
            <span>Role</span>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </label>
          <button className="primary" type="submit">
            Register
          </button>
        </form>
        <Message message={message} type="error" />
        <button className="text-button" onClick={goToLogin}>
          Back to login
        </button>
      </section>
    </main>
  );
}

export default Register;
