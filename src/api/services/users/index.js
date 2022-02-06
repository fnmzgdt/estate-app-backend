const pool = require("../../../config/mysqldb");
const MySQLquery = require("../../utils/query");

module.exports = {
  getUsers: () => {
    const query =
      "SELECT id, firstName, lastName, email, gender, createdAt FROM users";
    return MySQLquery(pool, query, []);
  },
  getUserById: (params) => {
    const query =
      "SELECT id, firstName, lastName, email, gender, createdAt FROM users WHERE id=?";
    return MySQLquery(pool, query, [params.id]);
  },
};
