//MQTT 

// The default unencrypted MQTT port is 1883.
// The encrypted TCP/IP port 8883 is also supported for using MQTT over SSL.

//DRY 

const express = require('express')
const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://mqtt.devbit.be')


const app = express()
const port = 3000


app.get('/', (req, res) => {
  res.send('Esp1 = ' + value_esp1)
  res.send('Esp2 = ' + value_esp2)
})



client.on('connect', function () {

  // Can we subscribe to two topics at the same time ?Yes it connects to the servers 
  // Subscribe to ESP1
  client.subscribe('test/soundboard/esp1', function (err) {
      if (!err) console.log('Connected to broker-ESP1')

    })
  // Subscribe to ESP
  client.subscribe('test/soundboard/esp2', function (err) {
      if (!err) console.log('Connected to broker-ESP2')

    })



})

// We slaan op in message the data die van de topics komt
// We visualseren dan de data die van de topics komt. 
// 
let value_esp1 
let value_esp2
let value_esp3


// After subscribing to the topic successfully, 
//we then use the on function to monitor the function of receiving the message

client.on('message', function (topic, message) {    // message is Buffer
  switch(topic){
    case 'test/soundboard/esp1':
      console.log(`${message}@Topic:${topic} `)
      value_esp1  = message.toString()

    case 'test/soundboard/esp2':
      console.log(`${message}@Topic:${topic} `)
      value_esp2 = message.toString()

  }

});




client.on("error", function(err) { 
  console.log("Error: " + err) 
  if(err.code == "ENOTFOUND") { 
      console.log("There is no connection with the internet") 
  } 
}) 

client.on("reconnect", function() { 
  console.log("Client trying a reconnection to the Broker") 
})

client.on("offline", function() { 
  console.log("Client is currently offline") 
})  


// For express 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
