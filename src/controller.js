import db from './db.js';
import client  from './mqttService.js'; 
import bcrypt from 'bcrypt';


// Function untuk simpan data ke table
const saveAccelerationData = async (data) => {
    try {
      const { sensor_id, timestamp, acceleration_x, acceleration_y, acceleration_z } = data;
  
      await db.query(
        'INSERT INTO acceleration SET ?',
        { id: sensor_id, timestamp: timestamp, acceleration_x: acceleration_x, acceleration_y: acceleration_y, acceleration_z: acceleration_z }
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
        'INSERT INTO ph_sensor SET ?',
        { id: sensor_id, timestamp: timestamp, ph_value: ph_value }
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
        'INSERT INTO turbidity SET ?',
        { id: sensor_id, timestamp: timestamp, turbidity_value: turbidity_value }
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
        'INSERT INTO temperature SET ?',
        { id: sensor_id, timestamp: timestamp, temperature_value: temperature_value }
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
        case 'sensors/acceleration':
          await saveAccelerationData(data);
          break;
        case 'sensors/sensor_PH':
          await saveSensorPHData(data);
          break;
        case 'sensors/turbidity':
          await saveTurbidityData(data);
          break;
        case 'sensors/temperature':
          await saveTemperatureData(data);
          break;
        default:
          console.log('Topik tidak dikenali');
      }
    } catch (error) {
      console.error(error);
    }
  });

  async function loginController(req, res, username, password) {
    const result = await db.query('SELECT * FROM login WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah' });
    } else {
      const hashedPassword = result.rows[0].password;
      const match = await bcrypt.compare(password, hashedPassword);
      !match ? res.status(401).json({ message: 'Username atau password salah' }) : res.status(200).json({ message: 'Login Berhasil' });
    }
  }

  export default loginController;
  