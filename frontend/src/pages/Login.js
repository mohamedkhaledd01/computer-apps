import { useState } from "react";
import FormInput from "../components/FormInput";
import Message from "../components/Message";
import { authService } from "../services/lmsService";

function Login({ onLogin, goToRegister }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await authService.login(form);
      onLogin(response.data.user);
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <h1>Learning Management System</h1>
        <form onSubmit={handleSubmit} className="form">
          <FormInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <button className="primary" type="submit">
            Login
          </button>
        </form>
        <Message message={message} type="error" />
        <button className="text-button" onClick={goToRegister}>
          Create an account
        </button>
      </section>
    </main>
  );
}

export default Login;
