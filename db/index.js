const { Client } = require("pg");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = new Client({
  connectionString: process.env.URI
});

db.connect()
  .then(() => console.log("CONNECTED TO DB"))
  .catch(err => console.log(err));

// LOGIN AND REGISTER RESOURCES
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

const createUser = async (req, res) => {
  try {
    let errors = [];

    let queryText = "SELECT * FROM users WHERE email=$1";
    let queryValues = [req.body.email];

    let result = await db.query(queryText, queryValues);

    if(result.rows[0]) {
      errors.push({ msg: 'Employee is already registered' });
      res.status(400).json({
          status: "error",
          error: "Employee already exist",
      });
    } else {
      try {

        let salt = bcrypt.genSaltSync(10);
        req.body.password = bcrypt.hashSync(req.body.password, salt);

        let queryValues = Object.values(req.body);

        if(queryValues.length !== 7) {
            errors.push({ msg: 'Please fill in all fields' });
        }

        if(req.body.password.length < 6) {
          errors.push({ msg: 'password should be at least 6 characters' })
        }

        const queryText ="INSERT INTO users(firstName, lastName, password, gender, jobRole, department, address, email) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id";
        console.log(queryValues);
        await db.query("BEGIN");
        const result = await db.query(queryText, queryValues);
        await db.query("COMMIT");
        res.status(201).json({
          status: "success",
          data: {
            message: "User Created Successfully",
            token: req.headers.authorization,
            userId: result.rows[0].id,
          }
        });

      } catch (error) {
        await db.query("ROLLBACK");
        // throw error;
        res.status(400).json({
          status: 'error',
          error: error,
        });

        throw error;
      }
    }
  } catch(error) {
    // throw error;
    res.status(400).json({
      status: 'error',
      error: error,
    });

    throw error;
  }
}

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    let queryText = "SELECT * FROM users WHERE email=$1";
    let queryValues = [email];

    const result = await db.query(queryText, queryValues);

    if (!result.rows[0]) {
      res.status(404).json({
        status: 'error',
        error: 'User not found', 
      });
    }

    console.log(result.rows);

    const isMatch = await bcrypt.compare(password, result.rows[0].password);
    if(isMatch) {
      const payload = {
        id: result.rows[0].id,
        email: result.rows[0].email
      };
      jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 3600}, (error, token) => {
        if(error) {
          res.status(400).json({
            status: 'error',
            message: 'No Token Authorization',
          });
        }
        res.status(200).json({
          status: 'success',
          data: {
            token: 'Bearer ' + token,
            userId: result.rows[0].id,
          }
        });
      });
    } else {
      res.status(404).json({
        status: 'error',
        error: 'Incorrect Password',
      });
    }
  } catch(error) {
    res.status(404).json({
      status: 'error',
      error: error,
    });
  }
}

const postUser = async (req, res) => {
  try {
    const queryValues = Object.values(req.body);
    const queryText =
      "INSERT INTO users(firstName, lastName, password, gender, jobRole, department, address, email) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id";
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
      const {id, firstname, lastname, gender, jobrole, department, address} = result.rows[0];
      res.status(200).json({
        status: "success",
        user: {
          id,
          firstname,
          lastname,
          gender,
          jobrole,
          department,
          address
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

// ARTICLES RESOURCES
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
  const queryText = 'SELECT articles.article_id, articles.title, articles.content, article_comments.comment, article_comments.comment_id, article_comments.author_id, articles.created_on FROM articles INNER JOIN article_comments ON articles.article_id=article_comments.article_id WHERE articles.article_id=$1;'
  db.query(queryText, [req.params.articleId])
    .then(result => {
      console.log(result.rows);
      const comments = result.rows.map((article) => {
        return {
          commentId: article.comment_id,
          comment: article.comment,
          authorId: article.author_id,
        }
      });
      console.log(comments);
      res.status(200).json({
        status: "success",
        data: {
          id: result.rows[0].article_id,
          createdOn: result.rows[0].created_on,
          title: result.rows[0].title,
          article: result.rows[0].content,
          comments: comments,
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
    console.log(queryValues);
    const queryText =
      "INSERT INTO articles(title, content, author_id, created_on) VALUES($1, $2, $3, $4) RETURNING article_id, title";
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

const postArticleComment = async (req, res) => {
  try {
    const queryValues = Object.values(req.body);
    queryValues.push(new Date());
    console.log(queryValues);
    const queryText = "INSERT INTO article_comments(comment, author_id, article_id, created_on) VALUES($1, $2, $3, $4)";
    console.log(queryValues);
    await db.query("BEGIN");
    const result = await db.query(queryText, queryValues);
    await db.query("COMMIT");
    // console.log(result.rows);
    getArticleComments(req, res);
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
    console.log(url);
    const authorId = parseInt(req.body.authorId);
    const queryValues = [title, url, authorId, new Date()];
    const queryText =
      "INSERT INTO gifs(title, image_url, author_id, created_on) VALUES($1, $2, $3, $4) RETURNING gif_id, image_url, title, created_on";
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
  db.query('SELECT gifs.gif_id, gifs.title, gifs.image_url, gif_comments.comment, gif_comments.comment_id, gif_comments.author_id, gifs.created_on FROM gifs INNER JOIN gif_comments ON gifs.gif_id=gif_comments.gif_id WHERE gifs.gif_id=$1;', [req.params.gifId])
    .then(result => {
      console.log(result.rows);
      const comments = result.rows.map((gif) => {
        return {
          commentId: gif.comment_id,
          comment: gif.comment,
          authorId: gif.author_id,
        }
      });
      console.log(comments);
      res.status(200).json({
        status: "success",
        data: {
          id: result.rows[0].gif_id,
          createdOn: result.rows[0].created_on,
          title: result.rows[0].title,
          url: result.rows[0].image_url,
          comments: comments,
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

const postGifComment = async (req, res) => {
  try {
    const queryValues = Object.values(req.body);
    queryValues.push(new Date());
    console.log(queryValues);
    const queryText = "INSERT INTO gif_comments(comment, author_id, gif_id, created_on) VALUES($1, $2, $3, $4)";
    console.log(queryValues);
    await db.query("BEGIN");
    const result = await db.query(queryText, queryValues);
    await db.query("COMMIT");
    // console.log(result.rows);
    getGifComments(req, res);
  } catch (error) {
    await db.query("ROLLBACK");
    res.status(400).json({
      status: "error",
      error: error
    });
  }
}

// FEED RESOURCE
const getFeed = async (req, res) => {
  try {
    const articlesResult = await db.query("SELECT * FROM articles ORDER BY created_on DESC");
    const gifsResult = await db.query("SELECT * FROM gifs ORDER BY created_on DESC");
    const data = [...articlesResult.rows, ...gifsResult.rows].sort((a,b) => new Date(b.created_on) - new Date(a.created_on));
    res.status(200).json({
      status: "success",
      data: mapData(data),
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.stack
    });
  }
};

// map data callback helper function
function mapData(data) {
  data = data.map((item) => {
    if(item.hasOwnProperty('gif_id')) {
      return {
        id: item.gif_id,
        createdOn: item.created_on,
        url: item.image_url,
        title: item.title,
        authorId: item.author_id,
      }
    } else {
      return {
        id: item.article_id,
        createdOn: item.created_on,
        article: item.content,
        title: item.title,
        authorId: item.author_id,
      }
    }
  });
  return data;
}

// postArticleComments helper function
const getArticleComments = async (req, res) => {
  try {
    const commentData = await db.query('SELECT articles.title, articles.content, article_comments.comment, article_comments.created_on FROM articles INNER JOIN article_comments ON articles.article_id=article_comments.article_id WHERE article_comments.comment=$1;', [req.body.comment]);
    console.log(commentData);
    res.status(201).json({
      status: 'Success',
      data: {
        message: 'Comment succesfully created',
        createdOn: commentData.rows[0].created_on,
        articleTitle: commentData.rows[0].title,
        article: commentData.rows[0].content,
        comment: commentData.rows[0].comment
      }
    });
  } catch(error) {
    res.status(400).json({
      status: 'error',
      error: error,
    });
  }
}

const getGifComments = async (req, res) => {
  try {
    const commentData = await db.query('SELECT gifs.title, gif_comments.comment, gif_comments.created_on FROM gifs INNER JOIN gif_comments ON gifs.gif_id=gif_comments.gif_id WHERE gif_comments.comment=$1;', [req.body.comment]);
    console.log(commentData);
    res.status(201).json({
      status: 'Success',
      data: {
        message: 'Comment succesfully created',
        createdOn: commentData.rows[0].created_on,
        gifTitle: commentData.rows[0].title,
        comment: commentData.rows[0].comment
      }
    });
  } catch(error) {
    res.status(400).json({
      status: 'error',
      error: error,
    });
  }
}

// EXPORT ALL RESOURCES
module.exports = {
  getUsers,
  createUser,
  signin,
  postUser,
  getUser,
  getArticles,
  getArticle,
  postArticle,
  patchArticle,
  deleteArticle,
  postArticleComment,
  postGif,
  deleteGif,
  getGif,
  postGifComment,
  getFeed
};
