import { useEffect, useState } from "react";
import FormInput from "../components/FormInput";
import Message from "../components/Message";
import SelectInput from "../components/SelectInput";
import { assignmentService, courseService } from "../services/lmsService";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ course_id: "", title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const [assignRes, courseRes] = await Promise.all([
      assignmentService.getAll(),
      courseService.getAll()
    ]);
    setAssignments(assignRes.data);
    setCourses(courseRes.data);
  };

  useEffect(() => {
    loadData().catch(() => setMessage("Unable to load assignments"));
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setForm({ course_id: "", title: "", description: "" });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      if (editingId) {
        await assignmentService.update(editingId, form);
        setMessage("Assignment updated");
      } else {
        await assignmentService.create(form);
        setMessage("Assignment created");
      }
      resetForm();
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save assignment");
    }
  };

  const handleEdit = (assignment) => {
    setEditingId(assignment.id);
    setForm({
      course_id: String(assignment.course_id),
      title: assignment.title,
      description: assignment.description || ""
    });
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    setMessage("");

    try {
      await assignmentService.remove(id);
      if (editingId === id) resetForm();
      await loadData();
      setMessage("Assignment deleted");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to delete assignment");
    }
  };

  return (
    <main className="page">
      <section className="page-header">
        <h1>Assignments</h1>
        <p>Create and manage course assignments.</p>
      </section>

      <section className="grid two-columns">
        <form className="panel form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Assignment" : "Create Assignment"}</h2>
          <SelectInput label="Course" name="course_id" value={form.course_id} onChange={handleChange} options={courses} />
          <FormInput label="Title" name="title" value={form.title} onChange={handleChange} />
          <label className="field">
            <span>Description</span>
            <textarea name="description" value={form.description} onChange={handleChange} required />
          </label>
          <div className="form-actions">
            <button className="primary" type="submit">{editingId ? "Update" : "Create"}</button>
            {editingId && <button className="secondary" type="button" onClick={resetForm}>Cancel</button>}
          </div>
          <Message message={message} type={message.includes("Unable") ? "error" : "success"} />
        </form>

        <section className="panel">
          <h2>Assignment List</h2>
          <div className="list">
            {assignments.map((item) => (
              <article className={`list-item ${editingId === item.id ? "editing" : ""}`} key={item.id}>
                <div className="list-item-content">
                  <strong>{item.title}</strong>
                  <p>{item.course_title || `Course #${item.course_id}`}</p>
                  {item.description && <p>{item.description}</p>}
                </div>
                <div className="list-item-actions">
                  <button className="btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
              </article>
            ))}
            {!assignments.length && <p className="muted">No assignments found.</p>}
          </div>
        </section>
      </section>
    </main>
  );
}

export default Assignments;
