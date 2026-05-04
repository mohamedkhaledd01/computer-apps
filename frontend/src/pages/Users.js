import { useEffect, useState } from "react";
import FormInput from "../components/FormInput";
import Message from "../components/Message";
import { userService } from "../services/lmsService";

function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });
  const [message, setMessage] = useState("");

  const loadUsers = async () => {
    const response = await userService.getAll();
    setUsers(response.data);
  };

  useEffect(() => {
    loadUsers().catch(() => setMessage("Unable to load users"));
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await userService.create(form);
      setForm({ name: "", email: "", password: "", role: "student" });
      await loadUsers();
      setMessage("User added");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to add user");
    }
  };

  return (
    <main className="page">
      <section className="page-header">
        <h1>Users</h1>
        <p>Manage student and instructor accounts.</p>
      </section>

      <section className="grid two-columns">
        <form className="panel form" onSubmit={handleSubmit}>
          <h2>Add User</h2>
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
            Add User
          </button>
          <Message message={message} type={message.includes("Unable") ? "error" : "success"} />
        </form>

        <section className="panel">
          <h2>User List</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!users.length && <p className="muted">No users found.</p>}
          </div>
        </section>
      </section>
    </main>
  );
}

export default Users;
