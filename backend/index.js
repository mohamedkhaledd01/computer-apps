const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const courseRoutes = require("./routes/course.routes");
const enrollmentRoutes = require("./routes/enrollment.routes");
const assignmentRoutes = require("./routes/assignment.routes");
const submissionRoutes = require("./routes/submission.routes");
const quizRoutes = require("./routes/quiz.routes");
const gradeRoutes = require("./routes/grade.routes");
const announcementRoutes = require("./routes/announcement.routes");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "LMS API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/announcements", announcementRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
