const createCrudController = require("./crudController");

module.exports = createCrudController(
  "submission",
  ["assignment_id", "user_id", "content"],
  `SELECT submission.*, assignment.title AS assignment_title, user.name AS student_name
   FROM submission
   LEFT JOIN assignment ON assignment.id = submission.assignment_id
   LEFT JOIN user ON user.id = submission.user_id
   ORDER BY submission.id DESC`
);
