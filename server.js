import express from 'express';
import db from './src/db.js';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import  loginController  from './src/controller.js';
const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

// API endpoint untuk fetch data dari database
app.get('/api/data/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const result = await db.query(`SELECT * FROM ${table}`);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// API endpoint untuk login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    await loginController(req, res, username, password);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// //test-db
// app.get('/testdb', async (req, res) => {
//   try {
//     const result = await db.query(
//       `SELECT * FROM acceleration`
//     );
//     console.log(result.rows);
//     res.json(result.rows);
//     console.error(err);
//    } catch (err) {
//    res.status(500).send('Internal Server Error');
//   }
// });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server pada port 3000');
});