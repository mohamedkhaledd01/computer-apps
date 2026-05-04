const createCrudRoutes = require("./createCrudRoutes");
const quizController = require("../controllers/quiz.controller");

module.exports = createCrudRoutes(quizController);
