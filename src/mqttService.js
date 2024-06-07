import mqtt  from 'mqtt';
import dotenv from 'dotenv';
dotenv.config();

const options = {
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,
    protocol: process.env.MQTT_PROTOCOL,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
}

const client = mqtt.connect(options);

client.on('connect', function () {
    console.log('MQTT Broker Connected');
});

client.on('error', function (error) {
    console.log(error);
});

client.on('message', function (topic, message) {
    console.log('Received message:', topic, message.toString());
});

client.subscribe('sensors/#');

// // MQTT publish test data
// const sensors = [
//     { id: 1, name: 'Sensor 1', value: Math.random() * 100 },
//     { id: 2, name: 'Sensor 2', value: Math.random() * 100 },
//     { id: 3, name: 'Sensor 3', value: Math.random() * 100 },
//     { id: 4, name: 'Sensor 4', value: Math.random() * 100 },
//     { id: 5, name: 'Sensor 5', value: Math.random() * 100 }
// ];


// Repeat the publish every 5 seconds
// setInterval(() => {
//     const data = JSON.stringify({
//         timestamp: new Date().toISOString(),
//         sensors: sensors.map(sensor => ({
//             id: sensor.id,
//             name: sensor.name,
//             value: sensor.value = Math.floor(Math.random() * 100)
//         }))
//     });

//     client.publish('home/topic/sensors', data);
// }, 5000);

export default client;