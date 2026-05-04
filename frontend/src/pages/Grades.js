import { useEffect, useState } from "react";
import FormInput from "../components/FormInput";
import Message from "../components/Message";
import SelectInput from "../components/SelectInput";
import { courseService, gradeService, userService } from "../services/lmsService";

function Grades() {
  const [grades, setGrades] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ user_id: "", course_id: "", grade: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const students = users.filter((u) => u.role === "student");

  const loadData = async () => {
    const [gradeRes, userRes, courseRes] = await Promise.all([
      gradeService.getAll(),
      userService.getAll(),
      courseService.getAll()
    ]);
    setGrades(gradeRes.data);
    setUsers(userRes.data);
    setCourses(courseRes.data);
  };

  useEffect(() => {
    loadData().catch(() => setMessage("Unable to load grades"));
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setForm({ user_id: "", course_id: "", grade: "" });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      if (editingId) {
        await gradeService.update(editingId, form);
        setMessage("Grade updated");
      } else {
        await gradeService.create(form);
        setMessage("Grade assigned");
      }
      resetForm();
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save grade");
    }
  };

  const handleEdit = (grade) => {
    setEditingId(grade.id);
    setForm({
      user_id: String(grade.user_id),
      course_id: String(grade.course_id),
      grade: String(grade.grade)
    });
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this grade?")) return;
    setMessage("");

    try {
      await gradeService.remove(id);
      if (editingId === id) resetForm();
      await loadData();
      setMessage("Grade deleted");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to delete grade");
    }
  };

  return (
    <main className="page">
      <section className="page-header">
        <h1>Grades</h1>
        <p>Assign and manage student grades.</p>
      </section>

      <section className="grid two-columns">
        <form className="panel form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Grade" : "Assign Grade"}</h2>
          <SelectInput label="Student" name="user_id" value={form.user_id} onChange={handleChange} options={students} labelKey="name" />
          <SelectInput label="Course" name="course_id" value={form.course_id} onChange={handleChange} options={courses} />
          <FormInput label="Grade" name="grade" value={form.grade} onChange={handleChange} />
          <div className="form-actions">
            <button className="primary" type="submit">{editingId ? "Update" : "Assign"}</button>
            {editingId && <button className="secondary" type="button" onClick={resetForm}>Cancel</button>}
          </div>
          <Message message={message} type={message.includes("Unable") ? "error" : "success"} />
        </form>

        <section className="panel">
          <h2>Grade List</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Grade</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((item) => (
                  <tr key={item.id} className={editingId === item.id ? "editing" : ""}>
                    <td>{item.student_name || `User #${item.user_id}`}</td>
                    <td>{item.course_title || `Course #${item.course_id}`}</td>
                    <td><strong>{item.grade}</strong></td>
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
            {!grades.length && <p className="muted">No grades found.</p>}
          </div>
        </section>
      </section>
    </main>
  );
}

export default Grades;
