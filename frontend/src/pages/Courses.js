import { useEffect, useState } from "react";
import FormInput from "../components/FormInput";
import Message from "../components/Message";
import { courseService } from "../services/lmsService";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadCourses = async () => {
    const response = await courseService.getAll();
    setCourses(response.data);
  };

  useEffect(() => {
    loadCourses().catch(() => setMessage("Unable to load courses"));
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setForm({ title: "", description: "" });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      if (editingId) {
        await courseService.update(editingId, form);
        setMessage("Course updated");
      } else {
        await courseService.create(form);
        setMessage("Course created");
      }
      resetForm();
      await loadCourses();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save course");
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setForm({ title: course.title, description: course.description });
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setMessage("");

    try {
      await courseService.remove(id);
      if (editingId === id) resetForm();
      await loadCourses();
      setMessage("Course deleted");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to delete course");
    }
  };

  return (
    <main className="page">
      <section className="page-header">
        <h1>Courses</h1>
        <p>Create, edit, and manage course records.</p>
      </section>

      <section className="grid two-columns">
        <form className="panel form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Course" : "Create Course"}</h2>
          <FormInput label="Title" name="title" value={form.title} onChange={handleChange} />
          <label className="field">
            <span>Description</span>
            <textarea name="description" value={form.description} onChange={handleChange} required />
          </label>
          <div className="form-actions">
            <button className="primary" type="submit">
              {editingId ? "Update Course" : "Save Course"}
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
          <h2>Course List</h2>
          <div className="list">
            {courses.map((course) => (
              <article className={`list-item ${editingId === course.id ? "editing" : ""}`} key={course.id}>
                <div className="list-item-content">
                  <strong>{course.title}</strong>
                  <p>{course.description}</p>
                </div>
                <div className="list-item-actions">
                  <button className="btn-edit" onClick={() => handleEdit(course)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(course.id)}>Delete</button>
                </div>
              </article>
            ))}
            {!courses.length && <p className="muted">No courses found.</p>}
          </div>
        </section>
      </section>
    </main>
  );
}

export default Courses;
