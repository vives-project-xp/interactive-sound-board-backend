
<!--
  Jonas, js versie
  export default {
  data() {
      return {
        boxes: [],
        box: [
          'box1', 'box2', 'box3', 'box4',
        ],
        box1: { label: 'color', val: 0, color: 'purple' },
        box2: { label: 'color', val: 0, color: 'purple' },
        box3: { label: 'color', val: 0, color: 'purple' },
        box4: { label: 'color', val: 0, color: 'purple' },
        box5: { label: 'color', val: 0, color: 'purple' },
      }
      
    },
};
-->
<!-- What do i need to read we have one volume, esp selecteren, Rollen , devices-->


<!-- What do i need to read we have one volume, esp selecteren, Rollen , devices-->

<script setup lang="ts">

// Adding ref and reactive
import {ref, reactive, onMounted, watch, computed} from 'vue';
import * as mqtt from "mqtt/dist/mqtt.min";

import type {Devices} from '@/types/devices';
import { json } from 'stream/consumers';

// For the list to select the boxes
const boxes = ref([]);
// In this arry i'm gone need to iterate de enable devices from the topic test/devices/

//All ur devices
const devices_ = ref([] as Devices[]);

// const box = ref([ ])
const frequency = ref({
  label: 'color', 
  val : '20', 
  color: 'purple',
  topic: "test/frontend/frequency",
  qos: 0 as mqtt.QoS,
  payload: "10",
})


// Volume ref for the volume box 
const box5= ref({
  label: 'color', 
  val : '50', 
  color: 'purple',
  topic: "test/frontend/volume",
  qos: 0 as mqtt.QoS,
  payload: "10",
})

// For wave 
const wave = ref ({
  name: 'sinus',
  label: 'color', 
  val : '0', 
  color: 'purple',
  topic: "test/frontend/wave",
  qos: 0 as mqtt.QoS,


})

// Mqtt part 

const qosList = [0, 1, 2];

// Connection data 
const connection = reactive({
  clean: true,
  clientId: "emqx_vue3_" + Math.random().toString(16).substring(2, 8),
  // auth
  username: "No_matter",
  password: "no_matter",
});


// We set the quality of service to 0 
// we give an ref type topic that is dynamic
const subscription = ref({
  topic: "test/config",
  qos: 0 as mqtt.QoS,
});

// Publish topic to contact the Python Synth

const publish = ref({
  topic: "frontend/volume",
  qos: 0 as mqtt.QoS,
  payload: "10",
  
});

// Wanna send onces when we start
const start_publish = ref({
  topic: "test/frontend",
  qos: 0 as mqtt.QoS,
  payload: "1",
  
});



const receiveNews = ref("");

// ur client type mqttClient 
let client = ref({
  connected: false,
} as mqtt.MqttClient);

const subscribeSuccess = ref(false);
const btnLoadingType = ref("");
const retryTimes = ref(0);


const initData = () => {
  client.value = {
    connected: false,
  } as mqtt.MqttClient;
  retryTimes.value = 0;
  btnLoadingType.value = "";
  subscribeSuccess.value = false;
};



// Direcly set the connection link ws://mqtt.devbit.be:80/ws
const createConnection = () => {
  try {
    btnLoadingType.value = "connect";
    
    // Connection URL 
    const connectUrl = "ws://pi-of-terror:8080/ws";
    //const connectUrl = "ws://mqtt.devbit.be:80/ws";

    //options
    const { options } = connection;

    client.value = mqtt.connect(connectUrl, options);

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
  const { topic, qos } = subscription.value;
  client.value.subscribe(
    topic,
    { qos },
    (error: Error, granted: mqtt.ISubscriptionGrant[]) => {
      btnLoadingType.value = "";
      if (error) {
        console.log("subscribe error:", error);
        return;
      }
      subscribeSuccess.value = true;
      console.log("subscribe successfully:", granted);

      console.log("Value-from-sub:", subscription.value);
      // We save the value that we subcribe to in an store and we visualize it.
    }
  );
};


// publish message
// https://github.com/mqttjs/MQTT.js#mqttclientpublishtopic-message-options-callback

const doPublishValue = () => {
  // Save the value in box from the subcribe.
  const { topic, qos, val } = box5.value;
  client.value.publish(topic, val.toString() , { qos }, (error) => {
    if (error) {
      console.log("publish error:", error);
      return;
    }
    console.log(`published message: ${val}`);
  });
};

// We publisch only when the value changes in box1.value
watch(box5.value, async(newval, oldval) => {
  console.log("publisching value via Watch")
  doPublishValue()
})


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

// We publisch only when the value changes frequency values
watch(frequency.value, async(newval, oldval) => {
  console.log("publisching value via Watch")
  pub_frequency();
})



const pub_wave = () => {
  // Save the value in box from the subcribe.
 
  const { topic, qos, val } =  wave.value;
  client.value.publish(topic, val.toString() , { qos }, (error) => {
    btnLoadingType.value = "";
    if (error) {
      console.log("publish error:", error);
      return;
    }

    console.log(`published message : ${val}`);
  });
};

// We publisch only when the wave value changes 
watch(wave.value, async(newval, oldval) => {
  console.log("publisching value via Watch")
  pub_wave ();
})

// Need a function to check when the value of the topic has changed and we react on it 


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

// We change the value of the global ref every time we call the function
const color = computed(()=>{
    return 'primary';
})
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


// while, we subribe at real time 
onMounted(()=>{
  // We make first the conection 

  createConnection();
  // We subcribe onces only for the configuration soo every user has the same configuration
  doSubscribeConfig();
  doPublishOnceStart();
  doPublishValue();
  pub_frequency();


})

</script>

<template>
  <v-container>
    <v-row>
      <v-col class="mb-4">
            <h1 class="display-2 font-weight-bold mb-3">
              Interactive Soundboard
            </h1>
                          <v-select
                            label="Which boxes are connected?"
                            v-model="boxes"
                            :items="devices_.activedevices"
                            multiple
                            persistent-hint>
                          </v-select>

      <!-- Scalabel for all devices-->
     <v-card v-for="device in devices_.activedevices"
      :key="device.id"
> 
                  <p align="left">ESP {{device}} </p>

          </v-card>
    </v-col>

<v-col cols="12">

<p align="left">Volume: </p>

<v-slider
        v-model="box5.val"
        :color="box5.color"
        step="5"
        thumb-label
        ticks
  ></v-slider>

  <p align="left">Frequency: </p>

<!-- We link it with an frequency box-->

<v-slider
        v-model="frequency.val"
        :color="frequency.color"
        step="5"
        thumb-label
        ticks
  ></v-slider>

  <form action="/action_page.php" align="left">
                          <label for="wave">Choose the wave: </label>

                            <select id="wave" name="wave">

                            <option value="sinus">Sinus</option>

                            <option value="triangle">Triangle</option>

                            <option value="square">Square</option>

                            <option value="sawtooth">Sawtooth</option>

                          </select>
</form>

<v-cols cols="12" class="mt-5">

<v-p> Your chosen wave is </v-p>  <v-p class="text-h5 color-purple">{{wave.name}}</v-p>

<v-spacer> </v-spacer>

<v-btn class="mt-5" @click="sinus" > sinus </v-btn>

<v-spacer> </v-spacer>

<v-btn class="mt-5" @click="triangle"> triangle</v-btn>

<v-spacer> </v-spacer>

<v-btn class="mt-5" @click="square"> square</v-btn>

<v-spacer> </v-spacer>

<v-btn class="mt-5 mb-5" @click="sawtooth"> sawtooth</v-btn>

<v-space> </v-space>


<!-- 
<v-color-picker 
                    dot-size="25"
                    hide-canvas
                    hide-inputs
                    hide-sliders
                    show-swatches
                    swatches-max-height="200"
                    value="FF0000"
                    input=value

                          class="mt-5"
></v-color-picker>

-->

</v-cols>



</v-col>


    </v-row>
  </v-container>

</template>



<style scoped>
    .primary{
        color: purple; 
        
    }
   

</style>