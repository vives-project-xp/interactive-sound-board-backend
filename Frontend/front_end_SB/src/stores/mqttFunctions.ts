  

// We import ur needed tools 
import { defineStore} from "pinia";
import {computed, ref, reactive} from 'vue';
import * as mqtt from "mqtt/dist/mqtt.min";
import type {Devices} from '@/types/devices';

// We declare/Define ur Store mqttFunctions

export const mqttFunctions = defineStore('mqttf', ()=> {

// For the list to select the boxes
const boxes = ref([]);

// Loading boolean to let us know when it is loading
const Loading = ref(false);


//All the devices we use an type Devices to access ur Array and we save it 
// in a ref const that changes dynamically because an internal proxy
const devices_ = ref([] as Devices[]);

// We delare inside of ur Frequnecy al needed sub objects that we can call exporting them
const frequency = ref({
  label: 'color', 
  val : '20', 
  color: 'purple',
  topic: "test/frontend/frequency",
  qos: 0 as mqtt.QoS,
  payload: "10",
})


//  All the needed reactive variables for the volume 
const volume= ref({
  label: 'color', 
  val : '50', 
  color: 'purple',
  topic: "test/frontend/volume",
  qos: 0 as mqtt.QoS,
  payload: "10",
})

//  All the needed reactive variables for the Wave
const wave = ref ({
  name: 'wave',
  label: 'color', 
  val : '0', 
  color: 'purple',
  topic: "test/frontend/wave",
  qos: 0 as mqtt.QoS,


})


const octave = ref ({
  name : 'octave',
  val: '',
  topic: 'test/frontend/octave',
  qos: 0 as mqtt.QoS,
})

//  Ur Quality of service from less important to more important
const qosList = [0, 1, 2];

// Ur reactive const for ur Connection, 

const connection = reactive({
  clean: true,
  // We want an random client ID
  clientId: "emqx_vue3_" + Math.random().toString(16).substring(2, 8),
  // The user name is not of importance it is not secured ur Broker
  username: "No_matter",
  password: "no_matter",
});


// Ur ref variable for us 
const config = ref({
  topic: "test/config",
  qos: 0 as mqtt.QoS,
});

// Publish topic to contact the Python Synth


// Wanna send onces when we start
const start_publish = ref({
  topic: "test/frontend",
  qos: 0 as mqtt.QoS,
  payload: "1",
  
});

// ur client type mqttClient 
let client = ref({
  connected: false,
} as mqtt.MqttClient);

const subscribeSuccess = ref(false);
const retryTimes = ref(0);


const initData = () => {
  client.value = {
    connected: false,
  } as mqtt.MqttClient;
  retryTimes.value = 0;
  subscribeSuccess.value = false;
};

  // Direcly set the connection link ws://mqtt.devbit.be:80/ws
  const createConnection = () => {
    try {
      
      // Connection URL 
      //const connectUrl = "ws://pi-of-terror:8080/ws";
      const connectUrl = "ws://mqtt.devbit.be:80/ws";
      client.value = mqtt.connect(connectUrl);
  
      if (client.value.on) {
        client.value.on("connect", () => {
          console.log("connection successful");
        });
        client.value.on("reconnect", handleOnReConnect);
        client.value.on("error", (error) => {
          console.log("connection error:", error);
        });
  
        client.value.on("message", (topic: string, message) => {
         ///receiveNews.value = receiveNews.value.concat(message.toString());
          console.log(`received message: ${message} from topic: ${topic}`);
          // We add the message recived by the topic devices

            devices_.value = JSON.parse(message.toString());
            console.log(`Devices Value :`);
            console.log(devices_.value)
  
        });
      }
    } catch (error) {
      console.log("mqtt.connect error:", error);
    }
  };



// subscribe topic
// https://github.com/mqttjs/MQTT.js#mqttclientsubscribetopictopic-arraytopic-object-options-callback
const doSubscribeConfig = () => {
  const { topic, qos } = config.value;
  client.value.subscribe(
    topic,
    { qos },
    (error: Error, granted: mqtt.ISubscriptionGrant[]) => {
      if (error) {
        console.log("subscribe error:", error);
        return;
      }
      subscribeSuccess.value = true;
      console.log("subscribe successfully:", granted);
      console.log("Value-from-sub:", config.value);
      // We save the value that we subcribe to in an store and we visualize it.
    }
  );
};


// publish message
// https://github.com/mqttjs/MQTT.js#mqttclientpublishtopic-message-options-callback

const doPublishVolume = () => {
  // Save the value in box from the subcribe.
  const { topic, qos, val } = volume.value;
  client.value.publish(topic, val.toString() , { qos }, (error) => {
    if (error) {
      console.log("publish error:", error);
      return;
    }
    console.log(`published message: ${val}`);
  });
};



const doPublishOnceStart = () => {
  // Save the value in box from the subcribe.
 
  const { topic, qos, payload } =  start_publish.value;
  client.value.publish(topic, payload.toString() , { qos }, (error) => {
    if (error) {
      console.log("publish error:", error);
      return;
    }

    console.log(`published message : ${payload}`);
  });
};


// We publisch ur frequency status 
const pub_frequency = () => {
  // Save the value in box from the subcribe.
 
  const { topic, qos, payload, val } =  frequency.value;
  client.value.publish(topic, val.toString() , { qos }, (error) => {
    if (error) {
      console.log("publish error:", error);
      return;
    }
    console.log(`published message : ${val}`);
  });
};

// We publisch ur wave status
const pub_wave = () => {
  const { topic, qos, val } =  wave.value;
  client.value.publish(topic, val.toString() , { qos }, (error) => {
    if (error) {
      console.log("publish error:", error);
      return;
    }

    console.log(`published message : ${val}`);
  });
};

// We publisch ur octave status 
const octave_pub = () => {
  const { topic, qos, val } =  octave.value;
  client.value.publish(topic, val.toString() , { qos }, (error) => {
    if (error) {
      console.log("publish error:", error);
      return;
    }

    console.log(`published message : ${val}`);
  });
};

// disconnect
// https://github.com/mqttjs/MQTT.js#mqttclientendforce-options-callback
const destroyConnection = () => {
  if (client.value.connected) {
    try {
      client.value.end(false, () => {
        initData();
        console.log("disconnected successfully");
      });
    } catch (error) {
      console.log("disconnect error:", error);
    }
  }
};

// Handler for reconnection 
  const handleOnReConnect = () => {
    retryTimes.value += 1;
    if (retryTimes.value > 5) {
      try {
        client.value.end();
        initData();
        console.log("connection maxReconnectTimes limit, stop retry");
      } catch (error) {
        console.log("handleOnReConnect catch error:", error);
      }
    }
  };



// Functions for us Wave 
// We send the values 0, 1, 2 or 3 
function sinus (){
    wave.value.val = '0';
    wave.value.name = 'Sinus'
    pub_wave();
}
function triangle (){
    wave.value.val = '1';
    wave.value.name = 'Triangle'
    pub_wave();
}
function square (){
    wave.value.val = '2';
    wave.value.name = 'Square'
    pub_wave();
}
function sawtooth (){
    wave.value.val = '3';
    wave.value.name = 'Sawtooth '
    pub_wave();
}


// Functions For the Octave , need to place call them in the watcher

function Octave2 (){
  octave.value.val = '2';
  octave.value.name = 'Octave2'
  octave_pub()
  
}
function Octave4 (){
  octave.value.val = '4';
  octave.value.name = 'Octave4'
  octave_pub()
}






    // Soo we can access ur functions 
    return{
        boxes,
        devices_,
        frequency, 
        volume,
        wave, 
        connection, 
        createConnection, 
        doSubscribeConfig, 
        doPublishVolume, 
        doPublishOnceStart,
        pub_frequency, 
        pub_wave,
        sinus,
        triangle, 
        square, 
        sawtooth,
        octave,
        Octave2, 
        Octave4




       






        




    }


});