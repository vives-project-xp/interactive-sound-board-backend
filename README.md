
# interactive-sound-board-frontend

Before you can start the server you need to install the necessary dependencies.

First command "npm install"
Then "npm run dev"

Then you can copy the link and paste it on the browser. Will then show you your hosted server.

# Abstract

The Frontend consists of a MqttVieuw.vue, i added all the main functions in an store to make the code a bit cleaner.
For the visualisation, I chose to make as clean and attractive frontend as user friendly possible.  

# What does the code do ?

## Will start with the main.ts

Will start with the main.ts, added pinia and mqttVueHook.

For the full project, I chose to apply composition instead of option and I am using trypscript.

I'm using mqtt-vue-hook to create an MQTT connection with the broker using an websocket address.

```ts
import mqttVueHook from 'mqtt-vue-hook'

loadFonts()

const pinia = createPinia();
// We have ur mqtt protocol that we add
const  protocol =  'mqtt';
// Ur host where we connect ur mqtt.devbit.be and the standard port for mqtt 1883, no encryption
const host = "mqtt.devbit.be";
const port = 1883;

// We add to ur app the Referances 
createApp(App)
  .use(router)
  .use(vuetify)
  .use(pinia)
  .use(mqttVueHook, `${protocol}://${host}:${port}`, {
    clean: false,
    keepalive: 60,
    clientId: `mqtt_client_${Math.random().toString(16).substring(2, 10)}`,
    connectTimeout: 4000,
})
.mount('#app')
```

## For the MqttView.vue

Then for the MqttView.vue in this component i add the necessary references with the appropriate type, Store. I also use ref to keep the variables reactive, a watchers to every time the values in the bars change, for the frequency and volume.

Thanks to the fact that we can export functions from the store, we can also start using them by const an instance mqttF = mqttFunctions();. We can compare it to a class our store, where that can call and use all our methods by going to export them, then we use instance and call the various methods, variables ...

```ts
<script setup lang="ts">

// Adding ref , onMounted watch, and computed. 
import {ref, onMounted, watch} from 'vue';

import {mqttFunctions}  from '@/stores/mqttFunctions';

// For the list to select the boxes
const boxes = ref([]);
// In this arry i'm gone need to iterate de enable devices from the topic test/devices/

const Loading = ref(false);
const mqttF = mqttFunctions();

// We use onmounted to call the functions.
onMounted(()=>{
  // We make first the conection
  mqttF.createConnection();
  // We get the configuration from the Synthsiser 
  mqttF.doSubscribeConfig();
  // We let de synthesiser know that we are ready 
  mqttF.doPublishOnceStart();

})

// Watchers

// We publisch only when the value changes in volume values 
watch(mqttF.volume, async(newval, oldval) => {
  console.log("publisching value via Watch")
  mqttF.doPublishVolume();
})
// We publisch only when the value changes frequency values
watch(mqttF.frequency, async(newval, oldval) => {
  console.log("publisching value via Watch")
  mqttF.pub_frequency();
})

// We publisch only when the wave value changes 
watch(mqttF.wave, async(newval, oldval) => {
  console.log("publisching value via Watch")
  mqttF.pub_wave();
})

</script>
```

## For the Store the mqttFunction.ts

In the Store I add all the features that I need, use the build that libraires that can be found at mqtt-vue-hook,
 There are there features to subscribe and publish.

```ts

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

// Frequency const where we declare the needed sub values 
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

//  All the needed reactive variables for octave 
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

// Set it on True wheb we can connect
const subscribeSuccess = ref(false);

// For the feedback
const retryTimes = ref(0);

// What we first get
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
      const connectUrl = "ws://pi-of-terror:8080/ws";
     // To test the websocket with the school broker 
     // const connectUrl = "ws://mqtt.devbit.be:80/ws";
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
          console.log(`received message: ${message} from topic: ${topic}`);
          // We add the message recived by the topic devices, we place it in ur 
          //devices_ that takes the structure of an array type.

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
    }
  );
};
// publish message with the Volume value 
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
    // Soo we can access ur functions from other components or View 
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
```

## For the types, devices.ts

Make my own interface to save it as an object for the Store. Json file that we parse, gives us an value for the activedevices, volume and frequency. The value is an string or a number. 

```ts
export interface Devices {
    activedevices: string
    volume: number 
    frequentie: number 
}

```

# bibliography
//https://javascript.info/promise-basics
//https://dev.to/emqx/how-to-use-mqtt-in-nodejs-15c4
