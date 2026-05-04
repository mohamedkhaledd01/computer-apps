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
  const [forms, setForms] = useState(initialForms);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({
    enrollments: 0,
    assignments: 0,
    quizzes: 0,
    announcements: 0
  });

  const students = users.filter((item) => item.role === "student");

  const loadData = async () => {
    const [
      userResponse,
      courseResponse,
      assignmentResponse,
      enrollmentResponse,
      quizResponse,
      announcementResponse
    ] = await Promise.all([
      userService.getAll(),
      courseService.getAll(),
      assignmentService.getAll(),
      enrollmentService.getAll(),
      quizService.getAll(),
      announcementService.getAll()
    ]);

    setUsers(userResponse.data);
    setCourses(courseResponse.data);
    setAssignments(assignmentResponse.data);
    setStats({
      enrollments: enrollmentResponse.data.length,
      assignments: assignmentResponse.data.length,
      quizzes: quizResponse.data.length,
      announcements: announcementResponse.data.length
    });
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
          <strong>{stats.enrollments}</strong>
          <span>Enrollments</span>
        </div>
        <div>
          <strong>{stats.assignments}</strong>
          <span>Assignments</span>
        </div>
        <div>
          <strong>{stats.quizzes}</strong>
          <span>Quizzes</span>
        </div>
        <div>
          <strong>{stats.announcements}</strong>
          <span>Announcements</span>
        </div>
      </section>

      <Message message={message} type={message.includes("Unable") || message.includes("failed") ? "error" : "success"} />

      <section className="grid dashboard-grid">
        <form
          className="panel form"
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
          <button className="primary" type="submit">
            Enroll
          </button>
        </form>

        <form
          className="panel form"
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
          <button className="primary" type="submit">
            Create
          </button>
        </form>

        <form
          className="panel form"
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
          <button className="primary" type="submit">
            Submit
          </button>
        </form>

        <form className="panel form" onSubmit={(event) => submitForm(event, "quiz", quizService, "Quiz created")}>
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
          <button className="primary" type="submit">
            Create
          </button>
        </form>

        <form className="panel form" onSubmit={(event) => submitForm(event, "grade", gradeService, "Grade assigned")}>
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
          <button className="primary" type="submit">
            Assign
          </button>
        </form>

        <form
          className="panel form"
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
          <button className="primary" type="submit">
            Add
          </button>
        </form>
      </section>
    </main>
  );
}

export default Dashboard;
