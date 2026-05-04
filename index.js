const express = require("express");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

const authRoutes = require("./backend/routes/auth.routes");
const userRoutes = require("./backend/routes/user.routes");
const courseRoutes = require("./backend/routes/course.routes");
const enrollmentRoutes = require("./backend/routes/enrollment.routes");
const assignmentRoutes = require("./backend/routes/assignment.routes");
const submissionRoutes = require("./backend/routes/submission.routes");
const quizRoutes = require("./backend/routes/quiz.routes");
const gradeRoutes = require("./backend/routes/grade.routes");
const announcementRoutes = require("./backend/routes/announcement.routes");

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

app.listen(PORT, () => {
    console.log(`your server is up and run on http://localhost:${PORT}`);
});
