const createCrudController = require("./crudController");

module.exports = createCrudController(
  "quiz",
  ["course_id", "title"],
  `SELECT quiz.*, course.title AS course_title
   FROM quiz
   LEFT JOIN course ON course.id = quiz.course_id
   ORDER BY quiz.id DESC`
);
