const express = require('express');
const app = express();
const PORT = 8080;
app.use(express.json());
userRoutes = require('./Routes/user.service');
app.use('/api', userRoutes);
courseRoutes = require('./Routes/course.service');
app.use('/api', courseRoutes);
enrollmentRoutes = require('./Routes/enrollment.service');
app.use('/api', enrollmentRoutes);
announcementRoutes = require('./Routes/announcement.service');
app.use('/api', announcementRoutes);
assignmentRoutes = require('./Routes/assignment.service');
app.use('/api', assignmentRoutes);
gradeRoutes = require('./Routes/grade.service');
app.use('/api', gradeRoutes);
submissionRoutes = require('./Routes/submission.service');
app.use('/api', submissionRoutes);
quizRoutes = require('./Routes/quiz.service');
app.use('/api', quizRoutes);

app.listen(PORT,
    ()=> console.log (`your server is up and run on http://localhost:${PORT}`)
); 