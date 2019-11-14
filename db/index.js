const { Client } = require("pg");

const db = new Client({
  connectionString: process.env.URI
});

db.connect()
  .then(() => console.log("CONNECTED TO DB"))
  .catch(err => console.log(err));

const getUsers = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.status(200).json({
      status: "success",
      employees: result.rows
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.stack
    });
  }
};

const postUsers = async (req, res) => {
  try {
    const queryValues = Object.values(req.body);
    const queryText =
      "INSERT INTO users(firstName, lastName, password, gender, jobRole, department, address) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id";
    console.log(queryValues);
    await db.query("BEGIN");
    const result = await db.query(queryText, queryValues);
    await db.query("COMMIT");
    res.status(201).json({
      status: "success",
      employee: result
    });
  } catch (error) {
    await db.query("ROLLBACK");
    // throw error;
    console.log(error);
  } finally {
    console.log("FINALLY RAN!");
  }
}

const getUser = (req, res) {
  db.query("SELECT * FROM users WHERE id=$1", [req.params.userId])
    .then(result => {
      res.status(200).json({
        status: "success",
        employee: result.rows
      });
    })
    .catch(error => {
      res.json({
        status: "error",
        error: error.stack
      });
    });
}

module.exports = {
  getUsers,
  postUsers,
  getUser
};
