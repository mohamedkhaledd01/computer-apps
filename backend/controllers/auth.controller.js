const db = require("../config/db");

const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  if (!safeUser.id && safeUser.user_id) {
    safeUser.id = safeUser.user_id;
  }
  if (!safeUser.role) {
    safeUser.role = "student";
  }
  return safeUser;
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  if (role && !["student", "instructor"].includes(role)) {
    return res.status(400).json({ message: "Role must be student or instructor" });
  }

  try {
    const [existing] = await db.query("SELECT user_id AS id FROM `user` WHERE email = ?", [email]);
    if (existing.length) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const [result] = await db.query(
      "INSERT INTO `user` (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );
    const [rows] = await db.query(
      "SELECT user_id AS id, name, email, password, 'student' AS role FROM `user` WHERE user_id = ?",
      [result.insertId]
    );
    res.status(201).json({ user: sanitizeUser(rows[0]) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const [rows] = await db.query(
      "SELECT user_id AS id, name, email, password, 'student' AS role FROM `user` WHERE email = ? AND password = ?",
      [email, password]
    );
    if (!rows.length) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ user: sanitizeUser(rows[0]) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
