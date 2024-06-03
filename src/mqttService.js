import mqtt  from 'mqtt';

const options = {
    host: '3a6152cff8674790bcad3c3c23ee9a34.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'admin',
    password: 'Water123456'
}

// initialize the MQTT client
const client = mqtt.connect(options);

// setup the callbacks
client.on('connect', function () {
    console.log('MQTT Broker Connected');
});

client.on('error', function (error) {
    console.log(error);
});

client.on('message', function (topic, message) {
    // called each time a message is received
    console.log('Received message:', topic, message.toString());
});

// subscribe to topic
client.subscribe('topic/sensors/#');

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