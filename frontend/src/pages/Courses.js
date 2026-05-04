import { useEffect, useState } from "react";
import FormInput from "../components/FormInput";
import Message from "../components/Message";
import { courseService } from "../services/lmsService";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await courseService.create(form);
      setForm({ title: "", description: "" });
      await loadCourses();
      setMessage("Course created");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to create course");
    }
  };

  return (
    <main className="page">
      <section className="page-header">
        <h1>Courses</h1>
        <p>Create and review course records.</p>
      </section>

      <section className="grid two-columns">
        <form className="panel form" onSubmit={handleSubmit}>
          <h2>Create Course</h2>
          <FormInput label="Title" name="title" value={form.title} onChange={handleChange} />
          <label className="field">
            <span>Description</span>
            <textarea name="description" value={form.description} onChange={handleChange} required />
          </label>
          <button className="primary" type="submit">
            Save Course
          </button>
          <Message message={message} type={message.includes("Unable") ? "error" : "success"} />
        </form>

        <section className="panel">
          <h2>Course List</h2>
          <div className="list">
            {courses.map((course) => (
              <article className="list-item" key={course.id}>
                <strong>{course.title}</strong>
                <p>{course.description}</p>
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
