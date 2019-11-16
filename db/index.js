const { Client } = require("pg");

const db = new Client({
  connectionString: process.env.URI
});

db.connect()
  .then(() => console.log("CONNECTED TO DB"))
  .catch(err => console.log(err));

// USER QUERIES

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

const postUser = async (req, res) => {
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

const getUser = (req, res) => {
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

// ARTICLES QUERIES 

const getArticles = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM articles");
    res.status(200).json({
      status: "success",
      data: result.rows
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.stack
    });
  }
};

const getArticle = (req, res) => {
  db.query("SELECT * FROM articles WHERE article_id=$1", [req.params.articleId])
    .then(result => {
      res.status(200).json({
        status: "success",
        data: {
          id: result.rows[0].article_id,
          createdOn: result.rows[0].created_on,
          title: result.rows[0].title,
          article: result.rows[0].content,
          comments: [],
        }
      });
    })
    .catch(error => {
      res.json({
        status: "error",
        error: error.stack
      });
    });
}

const postArticle = async (req, res) => {
  try {
    const queryValues = Object.values(req.body);
    queryValues.push(new Date());
    const queryText =
      "INSERT INTO articles(title, content, created_on) VALUES($1, $2, $3) RETURNING article_id";
    console.log(queryValues);
    await db.query("BEGIN");
    const result = await db.query(queryText, queryValues);
    await db.query("COMMIT");
    console.log(result.rows);
    res.status(201).json({
      status: "success",
      data: {
        message: "Article Successfully Posted",
        articleId: result.rows[0].article_id,
        createdOn: result.rows[0].created_on,
        title:result.rows[0].title,
      },
    });
  } catch (error) {
    await db.query("ROLLBACK");
    res.status(400).json({
      status: "error",
      error: error
    });
  }
}

const patchArticle = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    const queryValues = Object.values(req.body);
    const queryText =
      "UPDATE articles SET title=$1, content=$2 WHERE article_id=$3 RETURNING article_id, title, content";
    console.log([...queryValues, articleId]);
    queryValues.push(articleId);
    await db.query("BEGIN");
    const result = await db.query(queryText, queryValues);
    await db.query("COMMIT");
    console.log(result.rows);
    res.status(201).json({
      status: "success",
      data: {
        message: "Article Successfully Updated",
        title: result.rows[0].title,
        article: result.rows[0].content,
      },
    });
  } catch (error) {
    await db.query("ROLLBACK");
    res.status(400).json({
      status: "error",
      error: error
    });
  }
}

const deleteArticle = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    const queryText =
      "DELETE FROM articles WHERE article_id=$1 RETURNING article_id";
    await db.query("BEGIN");
    const result = await db.query(queryText, [articleId]);
    await db.query("COMMIT");
    console.log(result.rows);
    res.status(200).json({
      status: "success",
      data: {
        message: "Article Successfully Deleted",
        articleId: result.rows[0].article_id,
        createdOn: result.rows[0].created_on,
        title:result.rows[0].title,
      },
    });
  } catch (error) {
    await db.query("ROLLBACK");
    res.status(400).json({
      status: "error",
      error: error
    });
  }
}

// GIFS RESOURCES

const postGif = async (req, res) => {
  try {
    const title = req.body.title;
    const url = req.file.url;
    const queryValues = [title, url, new Date()];
    const queryText =
      "INSERT INTO gifs(title, image_url, created_on) VALUES($1, $2, $3) RETURNING gif_id, image_url, title, created_on";
    console.log(queryValues);
    await db.query("BEGIN");
    const result = await db.query(queryText, queryValues);
    await db.query("COMMIT");
    console.log(result.rows);
    res.status(201).json({
      status: "success",
      data: {
        message: "Gif Image Successfully Posted",
        gifId: result.rows[0].gif_id,
        createdOn: result.rows[0].created_on,
        title: result.rows[0].title,
        imageUrl: result.rows[0].image_url,
      },
    });
  } catch (error) {
    await db.query("ROLLBACK");
    res.status(400).json({
      status: "error",
      error: error
    });
  }
}

const deleteGif = async (req, res) => {
  try {
    const gifId = req.params.gifId;
    const queryText =
      "DELETE FROM gifs WHERE gif_id=$1 RETURNING gif_id, title, created_on";
    await db.query("BEGIN");
    const result = await db.query(queryText, [gifId]);
    await db.query("COMMIT");
    console.log(result.rows);
    res.status(200).json({
      status: "success",
      data: {
        message: "Gif Successfully Deleted",
        gifId: result.rows[0].gif_id,
        createdOn: result.rows[0].created_on,
        title:result.rows[0].title,
      },
    });
  } catch (error) {
    await db.query("ROLLBACK");
    res.status(400).json({
      status: "error",
      error: error
    });
  }
}

const getGif = (req, res) => {
  db.query("SELECT * FROM gifs WHERE gif_id=$1", [req.params.gifId])
    .then(result => {
      res.status(200).json({
        status: "success",
        data: {
          id: result.rows[0].gif_id,
          createdOn: result.rows[0].created_on,
          title: result.rows[0].title,
          url: result.rows[0].image_url,
          comments: [],
        }
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
  postUser,
  getUser,
  getArticles,
  getArticle,
  postArticle,
  patchArticle,
  deleteArticle,
  postGif,
  deleteGif,
  getGif
};
