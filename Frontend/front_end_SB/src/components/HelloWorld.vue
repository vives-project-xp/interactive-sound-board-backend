
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

<script setup lang="ts">

// Adding ref and reactive
import {ref, reactive} from 'vue';
import * as mqtt from "mqtt/dist/mqtt.min";


// For the list to select the boxes 
const boxes = ref([]);
// In this arry i'm gone need to iterate de enable devices from the topic test/devices/
const box = ref(['box1' ])

const box1 = ref({
  label: 'color', 
  val : '3', 
  color: 'purple'
})

let box2 = ref({
  label: 'color', 
  val : '15', 
  color: 'purple'
})

let box3 = ref({
  label: 'color', 
  val : '4', 
  color: 'purple'
})

const box4 = ref({
  label: 'color', 
  val : '30', 
  color: 'purple'
})

const box5= ref({
  label: 'color', 
  val : '40', 
  color: 'purple'
})

// Mqtt part 

const qosList = [0, 1, 2];

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
  topic: "test/devices",
  qos: 0 as mqtt.QoS,
});

// Publish topic to contact the Python Synth 

const publish = ref({
  topic: "test/devices",
  qos: 0 as mqtt.QoS,
  payload: 'Hello',
  
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

// Direcly set the connection link ws://mqtt.devbit.be:80/ws
const createConnection = () => {
  try {
    btnLoadingType.value = "connect";
    
    // Connection URL 
    const connectUrl = "ws://mqtt.devbit.be:80/ws";

    //options
    const { options } = connection;

    client.value = mqtt.connect(connectUrl, options);

    if (client.value.on) {
      client.value.on("connect", () => {
        btnLoadingType.value = "";
        console.log("connection successful");
      });

      client.value.on("reconnect", handleOnReConnect);
      client.value.on("error", (error) => {
        console.log("connection error:", error);
      });

      client.value.on("message", (topic: string, message) => {
        receiveNews.value = receiveNews.value.concat(message.toString());
        console.log(`received message: ${message} from topic: ${topic}`);
        // We add the message recived by the topic devices 
        // 
          box.value.push(message.toString());
        
      
      });

    }
  } catch (error) {
    btnLoadingType.value = "";
    console.log("mqtt.connect error:", error);
  }
};

// subscribe topic
// https://github.com/mqttjs/MQTT.js#mqttclientsubscribetopictopic-arraytopic-object-options-callback
const doSubscribe = () => {
  btnLoadingType.value = "subscribe";
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
      // We add every time the value
      // box.push(payload) We push the value every time
      
   

    }
  );
};



// unsubscribe topic
// https://github.com/mqttjs/MQTT.js#mqttclientunsubscribetopictopic-array-options-callback
const doUnSubscribe = () => {
  btnLoadingType.value = "unsubscribe";
  const { topic, qos } = subscription.value;
  client.value.unsubscribe(topic, { qos }, (error) => {
    btnLoadingType.value = "";
    subscribeSuccess.value = false;
    if (error) {
      console.log("unsubscribe error:", error);
      return;
    }
    console.log(`unsubscribed topic: ${topic}`);
  });
};


// publish message
// https://github.com/mqttjs/MQTT.js#mqttclientpublishtopic-message-options-callback
const doPublish = () => {
  btnLoadingType.value = "publish";
  const { topic, qos, payload } = publish.value;



  // Save the value in box from the subcribe.
  client.value.publish(topic, payload, { qos }, (error) => {
    btnLoadingType.value = "";
    if (error) {
      console.log("publish error:", error);
      return;
    }
    console.log(`published message: ${payload}`);
  });
};


// disconnect
// https://github.com/mqttjs/MQTT.js#mqttclientendforce-options-callback
const destroyConnection = () => {
  if (client.value.connected) {
    btnLoadingType.value = "disconnect";
    try {
      client.value.end(false, () => {
        initData();
        console.log("disconnected successfully");
      });
    } catch (error) {
      btnLoadingType.value = "";
      console.log("disconnect error:", error);
    }
  }
};


const handleProtocolChange = (value: string) => {
  connection.port = value === "ws" ? 8084 : 80;
  connection.port = value === "wss" ? 8084 : 8083;
  connection.port = value === "mqtt" ? 8084 : 1883;

};


</script>

<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Interactive Soundboard
        </h1>
        
  
  <v-select
    label="Which boxes are connected?"
    v-model="boxes"
    :items="box"
    multiple
    persistent-hint>
  </v-select>

  
  
  <p align="left">Box 1?</p>
<form action="/action_page.php" align="left">
  <label for="instrument">Choose an instrument: </label>
  <select id="instrument" name="instrument">
    <option value="instrument1">Instrument1</option>
    <option value="instrument2">Instrument2</option>
    <option value="instrument3">Instrument3</option>
    <option value="instrument4">Instrument4</option>
  </select>
</form>
<p align="left">Volume: </p>
<v-slider
        v-model="box1.val"
        :color="box1.color"
        step="10"
        thumb-label
        ticks
  ></v-slider>

<p align="left">Box 2?</p>
<form action="/action_page.php" align="left">
  <label for="instrument">Choose an instrument: </label>
  <select id="instrument" name="instrument">
    <option value="instrument1">Instrument1</option>
    <option value="instrument2">Instrument2</option>
    <option value="instrument3">Instrument3</option>
    <option value="instrument4">Instrument4</option>
  </select>
</form>
<p align="left">Volume: </p>
<v-slider
        v-model="box2.val"
        :color="box2.color"
        step="10"
        thumb-label
        ticks
  ></v-slider>
<p align="left">Box 3?</p>
<form action="/action_page.php" align="left">
  <label for="instrument">Choose an instrument: </label>
  <select id="instrument" name="instrument">
    <option value="instrument1">Instrument1</option>
    <option value="instrument2">Instrument2</option>
    <option value="instrument3">Instrument3</option>
    <option value="instrument4">Instrument4</option>
  </select>
</form>
<p align="left">Volume: </p>
<v-slider
        v-model="box3.val"
        :color="box3.color"
        step="10"
        thumb-label
        ticks
  ></v-slider>
<p align="left">Box 4?</p>
<form action="/action_page.php" align="left">
  <label for="instrument">Choose an instrument: </label>
  <select id="instrument" name="instrument">
    <option value="instrument1">Instrument1</option>
    <option value="instrument2">Instrument2</option>
    <option value="instrument3">Instrument3</option>
    <option value="instrument4">Instrument4</option>
  </select>
</form>
<p align="left">Volume: </p>
<v-slider
        v-model="box4.val"
        :color="box4.color"
        step="10"
        thumb-label
        ticks
  ></v-slider>
  <p align="left">Box 5?</p>
<form action="/action_page.php" align="left">
  <label for="instrument">Choose an instrument: </label>
  <select id="instrument" name="instrument">
    <option value="instrument1">Instrument1</option>
    <option value="instrument2">Instrument2</option>
    <option value="instrument3">Instrument3</option>
    <option value="instrument4">Instrument4</option>
  </select>
</form>
<p align="left">Volume: </p>
<v-slider
        v-model="box5.val"
        :color="box5.color"
        step="10"
        thumb-label
        ticks
  ></v-slider>

      </v-col>

      


      <!-- For debuggin purpuse-->
     <v-col cols="12">
      <!-- V-models for host port mountpoint client id username and password-->
       <!--Make an V card and place it in -->

       <!-- As response we get connection successful if it worked -->
       <v-btn  @click="createConnection" :loading="btnLoadingType === 'connect'"> Connect </v-btn>
       <v-btn @click="doSubscribe"  :loading="btnLoadingType === 'subscribe'"> subscribe    </v-btn>
       <v-btn @click="doPublish" :loading="btnLoadingType === 'publish'" > publisch </v-btn>

        <!--Feedback when we connect -->



     </v-col>



    </v-row>
  </v-container>
</template>


<style>

</style>
