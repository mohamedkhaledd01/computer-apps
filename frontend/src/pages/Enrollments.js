import { useEffect, useState } from "react";
import Message from "../components/Message";
import SelectInput from "../components/SelectInput";
import { courseService, enrollmentService, userService } from "../services/lmsService";

function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ user_id: "", course_id: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const students = users.filter((u) => u.role === "student");

  const loadData = async () => {
    const [enrollRes, userRes, courseRes] = await Promise.all([
      enrollmentService.getAll(),
      userService.getAll(),
      courseService.getAll()
    ]);
    setEnrollments(enrollRes.data);
    setUsers(userRes.data);
    setCourses(courseRes.data);
  };

  useEffect(() => {
    loadData().catch(() => setMessage("Unable to load enrollments"));
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setForm({ user_id: "", course_id: "" });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      if (editingId) {
        await enrollmentService.update(editingId, form);
        setMessage("Enrollment updated");
      } else {
        await enrollmentService.create(form);
        setMessage("Student enrolled");
      }
      resetForm();
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save enrollment");
    }
  };

  const handleEdit = (enrollment) => {
    setEditingId(enrollment.id);
    setForm({ user_id: String(enrollment.user_id), course_id: String(enrollment.course_id) });
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this enrollment?")) return;
    setMessage("");

    try {
      await enrollmentService.remove(id);
      if (editingId === id) resetForm();
      await loadData();
      setMessage("Enrollment removed");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to remove enrollment");
    }
  };

  return (
    <main className="page">
      <section className="page-header">
        <h1>Enrollments</h1>
        <p>Manage student course enrollments.</p>
      </section>

      <section className="grid two-columns">
        <form className="panel form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Enrollment" : "Enroll Student"}</h2>
          <SelectInput label="Student" name="user_id" value={form.user_id} onChange={handleChange} options={students} labelKey="name" />
          <SelectInput label="Course" name="course_id" value={form.course_id} onChange={handleChange} options={courses} />
          <div className="form-actions">
            <button className="primary" type="submit">{editingId ? "Update" : "Enroll"}</button>
            {editingId && <button className="secondary" type="button" onClick={resetForm}>Cancel</button>}
          </div>
          <Message message={message} type={message.includes("Unable") ? "error" : "success"} />
        </form>

        <section className="panel">
          <h2>Enrollment List</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((item) => (
                  <tr key={item.id} className={editingId === item.id ? "editing" : ""}>
                    <td>{item.student_name || `User #${item.user_id}`}</td>
                    <td>{item.course_title || `Course #${item.course_id}`}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(item.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!enrollments.length && <p className="muted">No enrollments found.</p>}
          </div>
        </section>
      </section>
    </main>
  );
}

export default Enrollments;
