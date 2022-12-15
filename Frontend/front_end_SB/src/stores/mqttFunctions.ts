

import { defineStore} from "pinia";
import {computed, ref} from 'vue';

import * as mqtt from "mqtt/dist/mqtt.min";

import type {Devices} from '@/types/devices';
import { json } from 'stream/consumers';

export const mqtt_functions = defineStore('mqtt', ()=> {

    // ur client type mqttClient 
let client = ref({
    connected: false,
  } 


// Connection data 
const connection = reactive({
    clean: true,
    clientId: "emqx_vue3_" + Math.random().toString(16).substring(2, 8),
    // auth
    username: "No_matter",
    password: "no_matter",
  });

  

  

  // Direcly set the connection link ws://mqtt.devbit.be:80/ws
const createConnection = () => {
    try {
      
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


    


})