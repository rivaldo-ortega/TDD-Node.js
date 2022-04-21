const express = require('express');
const app = express();
const users = require('./routes/users');
const connectDB = require('./db/connect');
require('dotenv').config();
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// middleware

app.use(express.static('./public'));
app.use(express.json());

// routes

app.get('/', (req, res) => {
  res.send('<h1>User API</h1>');
});
app.use('/api/users', users);

app.use(notFound);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    if (require.main === module) {
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    }
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports.app = app;
