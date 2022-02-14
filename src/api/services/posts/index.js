const pool = require("../../../config/mysqldb");
const MySQLquery = require("../../utils/query");

module.exports = {
  createPost: ({ userId, description, latitude, longitude }) => {
    const query =
      "INSERT INTO posts(user_id, description, latitude, longitude) VALUES (?, ?, ?, ?)";
    return MySQLquery(pool, query, [userId, description, latitude, longitude]);
  },
};
