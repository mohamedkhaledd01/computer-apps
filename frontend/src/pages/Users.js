import { useEffect, useState } from "react";
import FormInput from "../components/FormInput";
import Message from "../components/Message";
import { userService } from "../services/lmsService";

function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [editingId, setEditingId] = useState(null);
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

  const resetForm = () => {
    setForm({ name: "", email: "", password: "", role: "student" });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      if (editingId) {
        const updateData = { name: form.name, email: form.email, role: form.role };
        if (form.password) updateData.password = form.password;
        await userService.update(editingId, updateData);
        setMessage("User updated");
      } else {
        await userService.create(form);
        setMessage("User added");
      }
      resetForm();
      await loadUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save user");
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setMessage("");

    try {
      await userService.remove(id);
      if (editingId === id) resetForm();
      await loadUsers();
      setMessage("User deleted");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to delete user");
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
          <h2>{editingId ? "Edit User" : "Add User"}</h2>
          <FormInput label="Name" name="name" value={form.name} onChange={handleChange} />
          <FormInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          <FormInput
            label={editingId ? "Password (leave blank to keep)" : "Password"}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required={!editingId}
          />
          <label className="field">
            <span>Role</span>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </label>
          <div className="form-actions">
            <button className="primary" type="submit">
              {editingId ? "Update User" : "Add User"}
            </button>
            {editingId && (
              <button className="secondary" type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
          <Message message={message} type={message.includes("Unable") || message.includes("delete") ? "error" : "success"} />
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className={editingId === user.id ? "editing" : ""}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className="role">{user.role}</span></td>
                    <td>
                      <div className="table-actions">
                        <button className="btn-edit" onClick={() => handleEdit(user)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(user.id)}>Delete</button>
                      </div>
                    </td>
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
