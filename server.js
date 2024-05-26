import express from 'express';
import db from './src/db.js';
import client  from './src/mqttService.js'; 
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcrypt';


const app = express();


//middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Function untuk simpan data ke table
const saveAccelerationData = async (data) => {
  try {
    const { sensor_id, timestamp, acceleration_x, acceleration_y, acceleration_z } = data;

    await db.query(
      'INSERT INTO acceleration (sensor_id, timestamp, acceleration_x, acceleration_y, acceleration_z) VALUES ($1, $2, $3, $4, $5)',
      [sensor_id, timestamp, acceleration_x, acceleration_y, acceleration_z]
    );
  } catch (error) {
    console.error(error);
    throw new Error('Gagal menyimpan data acceleration');
  }
};

const saveSensorPHData = async (data) => {
  try {
    const { sensor_id, timestamp, ph_value } = data;

    await db.query(
      'INSERT INTO sensor_PH (sensor_id, timestamp, ph_value) VALUES ($1, $2, $3)',
      [sensor_id, timestamp, ph_value]
    );
  } catch (error) {
    console.error(error);
    throw new Error('Gagal menyimpan data sensor_PH');
  }
};

const saveTurbidityData = async (data) => {
  try {
    const { sensor_id, timestamp, turbidity_value } = data;

    await db.query(
      'INSERT INTO turbidity (sensor_id, timestamp, turbidity_value) VALUES ($1, $2, $3)',
      [sensor_id, timestamp, turbidity_value]
    );
  } catch (error) {
    console.error(error);
    throw new Error('Gagal menyimpan data turbidity');
  }
};

const saveTemperatureData = async (data) => {
  try {
    const { sensor_id, timestamp, temperature_value } = data;

    await db.query(
      'INSERT INTO temperature (sensor_id, timestamp, temperature_value) VALUES ($1, $2, $3)',
      [sensor_id, timestamp, temperature_value]
    );
  } catch (error) {
    console.error(error);
    throw new Error('Gagal menyimpan data temperature');
  }
};


// Callback Function untuk handling message dari broker
client.on('message', async function (topic, message) {
  try {
    const data = JSON.parse(message.toString());
    switch (topic) {
      case 'home/topic/sensors/acceleration':
        await saveAccelerationData(data);
        break;
      case 'home/topic/sensors/sensor_PH':
        await saveSensorPHData(data);
        break;
      case 'home/topic/sensors/turbidity':
        await saveTurbidityData(data);
        break;
      case 'home/topic/sensors/temperature':
        await saveTemperatureData(data);
        break;
      default:
        console.log('Topik tidak dikenali');
    }
  } catch (error) {
    console.error(error);
  }
});


//routes
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM login WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }
    const match = await bcrypt.compare(password, result.rows[0].password);

    if (!match) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }
    return res.status(200).json({ message: 'Login berhasil' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});


//test-db
app.get('/testdb', async (req, res) => {
  try {
    const result = await db.query(
        'SELECT * FROM acceleration'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server is running on port 3000');
});