const createCrudRoutes = require("./createCrudRoutes");
const announcementController = require("../controllers/announcement.controller");

module.exports = createCrudRoutes(announcementController);
