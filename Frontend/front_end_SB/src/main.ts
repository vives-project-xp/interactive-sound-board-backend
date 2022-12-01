import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

//mqtt 
import mqttVueHook from 'mqtt-vue-hook'

loadFonts()

//We add ur mqqt instance
const  protocol =  'mqtt';
const host = "mqtt.devbit.be";
const port = 1883;



createApp(App)
  .use(router)
  .use(vuetify)

  .use(mqttVueHook, `${protocol}://${host}:${port}`, {
    clean: false,
    keepalive: 60,
    clientId: `mqtt_client_${Math.random().toString(16).substring(2, 10)}`,
    connectTimeout: 4000,
})
.mount('#app')


