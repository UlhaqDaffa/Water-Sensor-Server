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
client.subscribe('home/topic/sensors');

export default client;