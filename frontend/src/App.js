import { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/"
});

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("Dashboard");
  const [authPage, setAuthPage] = useState("login");
  const [message, setMessage] = useState("");

  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [grades, setGrades] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [courseForm, setCourseForm] = useState({ title: "", description: "" });
  const [enrollmentForm, setEnrollmentForm] = useState({ user_id: "", course_id: "" });
  const [assignmentForm, setAssignmentForm] = useState({ course_id: "", title: "", description: "" });
  const [submissionForm, setSubmissionForm] = useState({ assignment_id: "", user_id: "", content: "" });
  const [quizForm, setQuizForm] = useState({ course_id: "", title: "" });
  const [gradeForm, setGradeForm] = useState({ user_id: "", course_id: "", grade: "" });
  const [announcementForm, setAnnouncementForm] = useState({ course_id: "", message: "" });

  const students = users.filter((item) => item.role === "student");

  useEffect(() => {
    const savedUser = localStorage.getItem("lmsUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      getAllData();
    }
  }, [user]);

  function changeForm(event, form, setForm) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function showMessage(text) {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  }

  async function getAllData() {
    try {
      const userResult = await api.get("users");
      const courseResult = await api.get("courses");
      const enrollmentResult = await api.get("enrollments");
      const assignmentResult = await api.get("assignments");
      const submissionResult = await api.get("submissions");
      const quizResult = await api.get("quizzes");
      const gradeResult = await api.get("grades");
      const announcementResult = await api.get("announcements");

      setUsers(userResult.data);
      setCourses(courseResult.data);
      setEnrollments(enrollmentResult.data);
      setAssignments(assignmentResult.data);
      setSubmissions(submissionResult.data);
      setQuizzes(quizResult.data);
      setGrades(gradeResult.data);
      setAnnouncements(announcementResult.data);
    } catch (error) {
      showMessage(error.response?.data?.message || "Error loading data");
    }
  }

  async function login(event) {
    event.preventDefault();
    try {
      const result = await api.post("auth/login", loginForm);
      setUser(result.data.user);
      localStorage.setItem("lmsUser", JSON.stringify(result.data.user));
      showMessage("Logged in successfully");
    } catch (error) {
      showMessage(error.response?.data?.message || "Login failed");
    }
  }

  async function register(event) {
    event.preventDefault();
    try {
      const result = await api.post("auth/register", registerForm);
      setUser(result.data.user);
      localStorage.setItem("lmsUser", JSON.stringify(result.data.user));
      showMessage("Account created successfully");
    } catch (error) {
      showMessage(error.response?.data?.message || "Register failed");
    }
  }

  function logout() {
    localStorage.removeItem("lmsUser");
    setUser(null);
    setAuthPage("login");
  }

  async function addUser(event) {
    event.preventDefault();
    await api.post("users", userForm);
    setUserForm({ name: "", email: "", password: "", role: "student" });
    await getAllData();
    showMessage("User added");
  }

  async function addCourse(event) {
    event.preventDefault();
    await api.post("courses", courseForm);
    setCourseForm({ title: "", description: "" });
    await getAllData();
    showMessage("Course added");
  }

  async function addEnrollment(event) {
    event.preventDefault();
    await api.post("enrollments", enrollmentForm);
    setEnrollmentForm({ user_id: "", course_id: "" });
    await getAllData();
    showMessage("Student enrolled");
  }

  async function addAssignment(event) {
    event.preventDefault();
    await api.post("assignments", assignmentForm);
    setAssignmentForm({ course_id: "", title: "", description: "" });
    await getAllData();
    showMessage("Assignment added");
  }

  async function addSubmission(event) {
    event.preventDefault();
    await api.post("submissions", submissionForm);
    setSubmissionForm({ assignment_id: "", user_id: "", content: "" });
    await getAllData();
    showMessage("Submission added");
  }

  async function addQuiz(event) {
    event.preventDefault();
    await api.post("quizzes", quizForm);
    setQuizForm({ course_id: "", title: "" });
    await getAllData();
    showMessage("Quiz added");
  }

  async function addGrade(event) {
    event.preventDefault();
    await api.post("grades", gradeForm);
    setGradeForm({ user_id: "", course_id: "", grade: "" });
    await getAllData();
    showMessage("Grade added");
  }

  async function addAnnouncement(event) {
    event.preventDefault();
    await api.post("announcements", announcementForm);
    setAnnouncementForm({ course_id: "", message: "" });
    await getAllData();
    showMessage("Announcement added");
  }

  async function deleteRecord(url, id) {
    if (!window.confirm("Delete this record?")) {
      return;
    }
    await api.delete(`${url}/${id}`);
    await getAllData();
    showMessage("Record deleted");
  }

  function input(label, name, value, form, setForm, type = "text") {
    return (
      <label>
        {label}
        <input
          type={type}
          name={name}
          value={value}
          onChange={(event) => changeForm(event, form, setForm)}
          required
        />
      </label>
    );
  }

  function courseSelect(value, form, setForm) {
    return (
      <label>
        Course
        <select name="course_id" value={value} onChange={(event) => changeForm(event, form, setForm)} required>
          <option value="">Choose Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
      </label>
    );
  }

  function studentSelect(value, form, setForm) {
    return (
      <label>
        Student
        <select name="user_id" value={value} onChange={(event) => changeForm(event, form, setForm)} required>
          <option value="">Choose Student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>{student.name}</option>
          ))}
        </select>
      </label>
    );
  }

  function table(headers, rows, deleteUrl) {
    return (
      <table>
        <thead>
          <tr>
            {headers.map((head) => <th key={head}>{head}</th>)}
            {deleteUrl && <th>Delete</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {headers.map((head) => <td key={head}>{row[head]}</td>)}
              {deleteUrl && (
                <td>
                  <button className="delete" onClick={() => deleteRecord(deleteUrl, row.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function authScreen() {
    if (authPage === "register") {
      return (
        <div className="login-page">
          <form className="card login-card" onSubmit={register}>
            <h1>Register</h1>
            {input("Name", "name", registerForm.name, registerForm, setRegisterForm)}
            {input("Email", "email", registerForm.email, registerForm, setRegisterForm, "email")}
            {input("Password", "password", registerForm.password, registerForm, setRegisterForm, "password")}
            <label>
              Role
              <select name="role" value={registerForm.role} onChange={(event) => changeForm(event, registerForm, setRegisterForm)}>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </label>
            <button type="submit">Register</button>
            <button type="button" className="link" onClick={() => setAuthPage("login")}>Back to Login</button>
            {message && <p className="message">{message}</p>}
          </form>
        </div>
      );
    }

    return (
      <div className="login-page">
        <form className="card login-card" onSubmit={login}>
          <h1>LMS Login</h1>
          {input("Email", "email", loginForm.email, loginForm, setLoginForm, "email")}
          {input("Password", "password", loginForm.password, loginForm, setLoginForm, "password")}
          <button type="submit">Login</button>
          <button type="button" className="link" onClick={() => setAuthPage("register")}>Create Account</button>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
    );
  }

  function dashboard() {
    return (
      <div>
        <h2>Dashboard</h2>
        <div className="stats">
          <div className="card"><h3>{users.length}</h3><p>Users</p></div>
          <div className="card"><h3>{courses.length}</h3><p>Courses</p></div>
          <div className="card"><h3>{enrollments.length}</h3><p>Enrollments</p></div>
          <div className="card"><h3>{assignments.length}</h3><p>Assignments</p></div>
          <div className="card"><h3>{grades.length}</h3><p>Grades</p></div>
        </div>
      </div>
    );
  }

  function usersPage() {
    return (
      <div className="grid">
        <form className="card" onSubmit={addUser}>
          <h2>Add User</h2>
          {input("Name", "name", userForm.name, userForm, setUserForm)}
          {input("Email", "email", userForm.email, userForm, setUserForm, "email")}
          {input("Password", "password", userForm.password, userForm, setUserForm, "password")}
          <label>
            Role
            <select name="role" value={userForm.role} onChange={(event) => changeForm(event, userForm, setUserForm)}>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </label>
          <button type="submit">Save</button>
        </form>
        <div className="card">
          <h2>Users</h2>
          {table(["id", "name", "email", "role"], users, "users")}
        </div>
      </div>
    );
  }

  function coursesPage() {
    return (
      <div className="grid">
        <form className="card" onSubmit={addCourse}>
          <h2>Add Course</h2>
          {input("Title", "title", courseForm.title, courseForm, setCourseForm)}
          <label>
            Description
            <textarea name="description" value={courseForm.description} onChange={(event) => changeForm(event, courseForm, setCourseForm)} required />
          </label>
          <button type="submit">Save</button>
        </form>
        <div className="card">
          <h2>Courses</h2>
          {table(["id", "title", "description"], courses, "courses")}
        </div>
      </div>
    );
  }

  function enrollmentsPage() {
    return (
      <div className="grid">
        <form className="card" onSubmit={addEnrollment}>
          <h2>Enroll Student</h2>
          {studentSelect(enrollmentForm.user_id, enrollmentForm, setEnrollmentForm)}
          {courseSelect(enrollmentForm.course_id, enrollmentForm, setEnrollmentForm)}
          <button type="submit">Save</button>
        </form>
        <div className="card">
          <h2>Enrollments</h2>
          {table(["id", "student_name", "course_title", "date"], enrollments, "enrollments")}
        </div>
      </div>
    );
  }

  function assignmentsPage() {
    return (
      <div className="grid">
        <form className="card" onSubmit={addAssignment}>
          <h2>Add Assignment</h2>
          {courseSelect(assignmentForm.course_id, assignmentForm, setAssignmentForm)}
          {input("Title", "title", assignmentForm.title, assignmentForm, setAssignmentForm)}
          <label>
            Description
            <textarea name="description" value={assignmentForm.description} onChange={(event) => changeForm(event, assignmentForm, setAssignmentForm)} required />
          </label>
          <button type="submit">Save</button>
        </form>
        <div className="card">
          <h2>Assignments</h2>
          {table(["id", "course_title", "title", "description"], assignments, "assignments")}
        </div>
      </div>
    );
  }

  function submissionsPage() {
    return (
      <div className="grid">
        <form className="card" onSubmit={addSubmission}>
          <h2>Add Submission</h2>
          <label>
            Assignment
            <select name="assignment_id" value={submissionForm.assignment_id} onChange={(event) => changeForm(event, submissionForm, setSubmissionForm)} required>
              <option value="">Choose Assignment</option>
              {assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>{assignment.title}</option>
              ))}
            </select>
          </label>
          {studentSelect(submissionForm.user_id, submissionForm, setSubmissionForm)}
          {input("Submission Date", "content", submissionForm.content, submissionForm, setSubmissionForm)}
          <button type="submit">Save</button>
        </form>
        <div className="card">
          <h2>Submissions</h2>
          {table(["id", "student_name", "assignment_title", "content"], submissions, "submissions")}
        </div>
      </div>
    );
  }

  function quizzesPage() {
    return (
      <div className="grid">
        <form className="card" onSubmit={addQuiz}>
          <h2>Add Quiz</h2>
          {courseSelect(quizForm.course_id, quizForm, setQuizForm)}
          {input("Title", "title", quizForm.title, quizForm, setQuizForm)}
          <button type="submit">Save</button>
        </form>
        <div className="card">
          <h2>Quizzes</h2>
          {table(["id", "course_title", "title"], quizzes, "quizzes")}
        </div>
      </div>
    );
  }

  function gradesPage() {
    return (
      <div className="grid">
        <form className="card" onSubmit={addGrade}>
          <h2>Add Grade</h2>
          {studentSelect(gradeForm.user_id, gradeForm, setGradeForm)}
          {courseSelect(gradeForm.course_id, gradeForm, setGradeForm)}
          {input("Grade", "grade", gradeForm.grade, gradeForm, setGradeForm)}
          <button type="submit">Save</button>
        </form>
        <div className="card">
          <h2>Grades</h2>
          {table(["id", "student_name", "course_title", "grade"], grades, "grades")}
        </div>
      </div>
    );
  }

  function announcementsPage() {
    return (
      <div className="grid">
        <form className="card" onSubmit={addAnnouncement}>
          <h2>Add Announcement</h2>
          {courseSelect(announcementForm.course_id, announcementForm, setAnnouncementForm)}
          <label>
            Message
            <textarea name="message" value={announcementForm.message} onChange={(event) => changeForm(event, announcementForm, setAnnouncementForm)} required />
          </label>
          <button type="submit">Save</button>
        </form>
        <div className="card">
          <h2>Announcements</h2>
          {table(["id", "course_title", "message", "date_posted"], announcements, "announcements")}
        </div>
      </div>
    );
  }

  function pageContent() {
    if (page === "Dashboard") return dashboard();
    if (page === "Users") return usersPage();
    if (page === "Courses") return coursesPage();
    if (page === "Enrollments") return enrollmentsPage();
    if (page === "Assignments") return assignmentsPage();
    if (page === "Submissions") return submissionsPage();
    if (page === "Quizzes") return quizzesPage();
    if (page === "Grades") return gradesPage();
    return announcementsPage();
  }

  if (!user) {
    return authScreen();
  }

  return (
    <div>
      <header>
        <h1>Learning Management System</h1>
        <div>
          <span>{user.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <nav>
        {["Dashboard", "Users", "Courses", "Enrollments", "Assignments", "Submissions", "Quizzes", "Grades", "Announcements"].map((item) => (
          <button key={item} className={page === item ? "active" : ""} onClick={() => setPage(item)}>
            {item}
          </button>
        ))}
      </nav>

      <main>
        {message && <p className="message">{message}</p>}
        {pageContent()}
      </main>
    </div>
  );
}

export default App;
