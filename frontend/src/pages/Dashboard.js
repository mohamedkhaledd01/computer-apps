import { useEffect, useState } from "react";
import FormInput from "../components/FormInput";
import Message from "../components/Message";
import SelectInput from "../components/SelectInput";
import {
  announcementService,
  assignmentService,
  courseService,
  enrollmentService,
  gradeService,
  quizService,
  submissionService,
  userService
} from "../services/lmsService";

const initialForms = {
  enrollment: { user_id: "", course_id: "" },
  assignment: { course_id: "", title: "", description: "" },
  submission: { assignment_id: "", user_id: "", content: "" },
  quiz: { course_id: "", title: "" },
  grade: { user_id: "", course_id: "", grade: "" },
  announcement: { course_id: "", message: "" }
};

function Dashboard({ user }) {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [grades, setGrades] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [forms, setForms] = useState(initialForms);
  const [message, setMessage] = useState("");

  const students = users.filter((item) => item.role === "student");

  const loadData = async () => {
    const [
      userRes,
      courseRes,
      assignmentRes,
      enrollmentRes,
      quizRes,
      announcementRes,
      submissionRes,
      gradeRes
    ] = await Promise.all([
      userService.getAll(),
      courseService.getAll(),
      assignmentService.getAll(),
      enrollmentService.getAll(),
      quizService.getAll(),
      announcementService.getAll(),
      submissionService.getAll(),
      gradeService.getAll()
    ]);

    setUsers(userRes.data);
    setCourses(courseRes.data);
    setAssignments(assignmentRes.data);
    setEnrollments(enrollmentRes.data);
    setQuizzes(quizRes.data);
    setAnnouncements(announcementRes.data);
    setSubmissions(submissionRes.data);
    setGrades(gradeRes.data);
  };

  useEffect(() => {
    loadData().catch(() => setMessage("Unable to load dashboard data"));
  }, []);

  const updateForm = (formName, event) => {
    setForms({
      ...forms,
      [formName]: {
        ...forms[formName],
        [event.target.name]: event.target.value
      }
    });
  };

  const submitForm = async (event, formName, service, successMessage) => {
    event.preventDefault();
    setMessage("");

    try {
      await service.create(forms[formName]);
      setForms({ ...forms, [formName]: initialForms[formName] });
      await loadData();
      setMessage(successMessage);
    } catch (error) {
      setMessage(error.response?.data?.message || "Action failed");
    }
  };

  const handleDelete = async (service, id, label) => {
    if (!window.confirm(`Delete this ${label}?`)) return;
    setMessage("");

    try {
      await service.remove(id);
      await loadData();
      setMessage(`${label} deleted`);
    } catch (error) {
      setMessage(error.response?.data?.message || `Unable to delete ${label}`);
    }
  };

  return (
    <main className="page">
      <section className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome, {user?.name}. Manage core LMS activity from one workspace.</p>
      </section>

      <section className="stats">
        <div>
          <strong>{courses.length}</strong>
          <span>Courses</span>
        </div>
        <div>
          <strong>{enrollments.length}</strong>
          <span>Enrollments</span>
        </div>
        <div>
          <strong>{assignments.length}</strong>
          <span>Assignments</span>
        </div>
        <div>
          <strong>{quizzes.length}</strong>
          <span>Quizzes</span>
        </div>
        <div>
          <strong>{announcements.length}</strong>
          <span>Announcements</span>
        </div>
      </section>

      <Message message={message} type={message.includes("Unable") || message.includes("failed") ? "error" : "success"} />

      <section className="grid dashboard-grid">
        {/* Enroll Student */}
        <div className="panel">
          <form
            className="form"
            onSubmit={(event) => submitForm(event, "enrollment", enrollmentService, "Student enrolled")}
          >
            <h2>Enroll Student</h2>
            <SelectInput
              label="Student"
              name="user_id"
              value={forms.enrollment.user_id}
              onChange={(event) => updateForm("enrollment", event)}
              options={students}
              labelKey="name"
            />
            <SelectInput
              label="Course"
              name="course_id"
              value={forms.enrollment.course_id}
              onChange={(event) => updateForm("enrollment", event)}
              options={courses}
            />
            <button className="primary" type="submit">Enroll</button>
          </form>
          {enrollments.length > 0 && (
            <div className="panel-list">
              <h3>Recent Enrollments</h3>
              {enrollments.slice(0, 5).map((item) => (
                <div className="panel-list-item" key={item.id}>
                  <span>{item.student_name || `User #${item.user_id}`} - {item.course_title || `Course #${item.course_id}`}</span>
                  <button className="btn-delete-sm" onClick={() => handleDelete(enrollmentService, item.id, "Enrollment")}>x</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Assignment */}
        <div className="panel">
          <form
            className="form"
            onSubmit={(event) => submitForm(event, "assignment", assignmentService, "Assignment created")}
          >
            <h2>Create Assignment</h2>
            <SelectInput
              label="Course"
              name="course_id"
              value={forms.assignment.course_id}
              onChange={(event) => updateForm("assignment", event)}
              options={courses}
            />
            <FormInput
              label="Title"
              name="title"
              value={forms.assignment.title}
              onChange={(event) => updateForm("assignment", event)}
            />
            <label className="field">
              <span>Description</span>
              <textarea
                name="description"
                value={forms.assignment.description}
                onChange={(event) => updateForm("assignment", event)}
                required
              />
            </label>
            <button className="primary" type="submit">Create</button>
          </form>
          {assignments.length > 0 && (
            <div className="panel-list">
              <h3>Recent Assignments</h3>
              {assignments.slice(0, 5).map((item) => (
                <div className="panel-list-item" key={item.id}>
                  <span><strong>{item.title}</strong> - {item.course_title || `Course #${item.course_id}`}</span>
                  <button className="btn-delete-sm" onClick={() => handleDelete(assignmentService, item.id, "Assignment")}>x</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Assignment */}
        <div className="panel">
          <form
            className="form"
            onSubmit={(event) => submitForm(event, "submission", submissionService, "Assignment submitted")}
          >
            <h2>Submit Assignment</h2>
            <SelectInput
              label="Assignment"
              name="assignment_id"
              value={forms.submission.assignment_id}
              onChange={(event) => updateForm("submission", event)}
              options={assignments}
            />
            <SelectInput
              label="Student"
              name="user_id"
              value={forms.submission.user_id}
              onChange={(event) => updateForm("submission", event)}
              options={students}
              labelKey="name"
            />
            <label className="field">
              <span>Content</span>
              <textarea
                name="content"
                value={forms.submission.content}
                onChange={(event) => updateForm("submission", event)}
                required
              />
            </label>
            <button className="primary" type="submit">Submit</button>
          </form>
          {submissions.length > 0 && (
            <div className="panel-list">
              <h3>Recent Submissions</h3>
              {submissions.slice(0, 5).map((item) => (
                <div className="panel-list-item" key={item.id}>
                  <span>{item.student_name || `User #${item.user_id}`} - {item.assignment_title || `Assignment #${item.assignment_id}`}</span>
                  <button className="btn-delete-sm" onClick={() => handleDelete(submissionService, item.id, "Submission")}>x</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Quiz */}
        <div className="panel">
          <form className="form" onSubmit={(event) => submitForm(event, "quiz", quizService, "Quiz created")}>
            <h2>Create Quiz</h2>
            <SelectInput
              label="Course"
              name="course_id"
              value={forms.quiz.course_id}
              onChange={(event) => updateForm("quiz", event)}
              options={courses}
            />
            <FormInput
              label="Title"
              name="title"
              value={forms.quiz.title}
              onChange={(event) => updateForm("quiz", event)}
            />
            <button className="primary" type="submit">Create</button>
          </form>
          {quizzes.length > 0 && (
            <div className="panel-list">
              <h3>Recent Quizzes</h3>
              {quizzes.slice(0, 5).map((item) => (
                <div className="panel-list-item" key={item.id}>
                  <span><strong>{item.title}</strong> - {item.course_title || `Course #${item.course_id}`}</span>
                  <button className="btn-delete-sm" onClick={() => handleDelete(quizService, item.id, "Quiz")}>x</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assign Grade */}
        <div className="panel">
          <form className="form" onSubmit={(event) => submitForm(event, "grade", gradeService, "Grade assigned")}>
            <h2>Assign Grade</h2>
            <SelectInput
              label="Student"
              name="user_id"
              value={forms.grade.user_id}
              onChange={(event) => updateForm("grade", event)}
              options={students}
              labelKey="name"
            />
            <SelectInput
              label="Course"
              name="course_id"
              value={forms.grade.course_id}
              onChange={(event) => updateForm("grade", event)}
              options={courses}
            />
            <FormInput
              label="Grade"
              name="grade"
              value={forms.grade.grade}
              onChange={(event) => updateForm("grade", event)}
            />
            <button className="primary" type="submit">Assign</button>
          </form>
          {grades.length > 0 && (
            <div className="panel-list">
              <h3>Recent Grades</h3>
              {grades.slice(0, 5).map((item) => (
                <div className="panel-list-item" key={item.id}>
                  <span>{item.student_name || `User #${item.user_id}`} - {item.course_title || `Course #${item.course_id}`}: <strong>{item.grade}</strong></span>
                  <button className="btn-delete-sm" onClick={() => handleDelete(gradeService, item.id, "Grade")}>x</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Announcement */}
        <div className="panel">
          <form
            className="form"
            onSubmit={(event) => submitForm(event, "announcement", announcementService, "Announcement added")}
          >
            <h2>Add Announcement</h2>
            <SelectInput
              label="Course"
              name="course_id"
              value={forms.announcement.course_id}
              onChange={(event) => updateForm("announcement", event)}
              options={courses}
            />
            <label className="field">
              <span>Message</span>
              <textarea
                name="message"
                value={forms.announcement.message}
                onChange={(event) => updateForm("announcement", event)}
                required
              />
            </label>
            <button className="primary" type="submit">Add</button>
          </form>
          {announcements.length > 0 && (
            <div className="panel-list">
              <h3>Recent Announcements</h3>
              {announcements.slice(0, 5).map((item) => (
                <div className="panel-list-item" key={item.id}>
                  <span>{item.course_title || `Course #${item.course_id}`}: {item.message}</span>
                  <button className="btn-delete-sm" onClick={() => handleDelete(announcementService, item.id, "Announcement")}>x</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
