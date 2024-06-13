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

app.get('/api/data/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const result = await db.query(`SELECT * FROM ${table}`);
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/accel', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM acceleration ORDER BY id DESC LIMIT 1`);
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/ph', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM ph_sensor ORDER BY id DESC LIMIT 1`);
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/temp', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM temperature ORDER BY id DESC LIMIT 1`);
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/turbid', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM turbidity ORDER BY id DESC LIMIT 1`);
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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
  console.log('Server berjalan pada port 3000');
});