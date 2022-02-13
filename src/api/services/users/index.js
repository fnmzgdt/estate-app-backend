const pool = require("../../../config/mysqldb");
const MySQLquery = require("../../utils/query");

module.exports = {
  getUsers: () => {
    const query =
      "SELECT id, first_name, last_name, email, gender, created_at, phone_number FROM users";
    return MySQLquery(pool, query, []);
  },
  getUserById: ({ id }) => {
    const query =
      "SELECT id, firstName, lastName, email, gender, createdAt FROM users WHERE id=?";
    return MySQLquery(pool, query, [id]);
  },
  registerUser: ({
    firstName,
    lastName,
    email,
    password,
    gender,
    createdAt,
    phoneNumber,
  }) => {
    const query =
      "INSERT INTO users (first_name, last_name, email, password, gender, created_at, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?)";
    return MySQLquery(pool, query, [
      firstName,
      lastName,
      email,
      password,
      gender,
      createdAt,
      phoneNumber,
    ]);
  },
  getUserByEmail: ({ email }) => {
    const query = "SELECT id, first_name, last_name, email, password FROM users WHERE email = ?";
    return MySQLquery(pool, query, [email]);
  },
  createSession: ({ sessionId, id, first_name, last_name, email }) => {
    const query =
      "INSERT INTO sessions(id, user_id, first_name, last_name, email) VALUES (?, ?, ?, ?, ?)";
    return MySQLquery(pool, query, [sessionId, id, first_name, last_name, email]);
  },
  getSession: (sessionId) => {
    const query = "SELECT * FROM sessions WHERE id=?";
    return MySQLquery(pool, query, [sessionId]);
  },
};
