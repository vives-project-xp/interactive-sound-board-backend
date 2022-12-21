

<script setup lang="ts">
import MqttComponent from '../components/MqttDemo.vue'

// Adding ref and reactive
import {ref, onMounted, watch, computed} from 'vue';

import {mqttFunctions}  from '@/stores/mqttFunctions';

// For the list to select the boxes
const boxes = ref([]);
// In this arry i'm gone need to iterate de enable devices from the topic test/devices/

const Loading = ref(false);
const mqttF = mqttFunctions();

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


//All ur devices
const devices_ = ref([] as Devices[]);

</script>

<template>

  <v-container >
    <v-row>
      <v-col class="mb-4">
            <v-div class="display-2 font-weight-bold mb-3 text-h2 text-white">
              Interactive Soundboard
            </v-div> 
            <v-spacer></v-spacer>
            
                <v-p class="text-white text-h5 text-h3 text-grey darken-3"> Welcome to interactive soundboard, you can see all the available devices, you can change 
                  the volume and the frequency. If you wish, you can also change the synthesiser function to Triangle, Square and Sawtooth to give it an other touch, feel free to 
                  change the parameter.
                </v-p>
           
                          <v-select
                            label="Which boxes are connected?"
                            v-model="boxes"
                            :items="mqttF.devices_.activedevices"
                            multiple
                            class="text-white "
                            persistent-hint>
                      
                          </v-select>
      <!-- Scalabel for all devices-->

     <v-card class="mt-2 text-h5 text"  v-for="device in mqttF.devices_.activedevices"
      :key="device.id"
> 
                  <v-p class="text-purple" align="left">ESP </v-p>  <v-p  align="left">{{device}} </v-p>
          </v-card>
    </v-col>

<v-col cols="12" class="text-h4 text-white">

<p align="left">Volume: </p>

<v-slider
        v-model="mqttF.volume.val"
        :color="mqttF.volume.color"
        step="5"
        thumb-label
        ticks
  ></v-slider>

  <p class="hidden-xs" align="left">Frequency: </p>
  <p  class="hidden-xl hidden-lg hidden-md hidden-sm text-black" align="left">Frequency: </p>

<!-- We link it with an frequency box-->

<v-slider
        v-model="mqttF.frequency.val"
        :color="mqttF.frequency.color"
        step="5"
        thumb-label
        ticks
  ></v-slider>



<v-cols cols="12" class="mt-5 text-white ">

<v-p class="hidden-xs text-white"> Your chosen wave is </v-p>  

<v-p class="hidden-xl hidden-lg hidden-md hidden-sm text-black"> Your chosen wave is </v-p>  <v-p class="text-h3 text-purple darken-4">{{mqttF.wave.name}}</v-p>

<v-spacer> </v-spacer>

<v-btn class="mt-5 text-black" @click="mqttF.sinus" > sinus </v-btn>

<v-spacer> </v-spacer>

<v-btn class="mt-5 text-black" @click="mqttF.triangle"> triangle</v-btn>

<v-spacer> </v-spacer>

<v-btn class="mt-5 text-black" @click="mqttF.square"> square</v-btn>

<v-spacer> </v-spacer>

<v-btn class="mt-5 mb-5 text-black" @click="mqttF.sawtooth"> sawtooth</v-btn>

<v-spacer> </v-spacer>

<!-- Octave section-->
<v-p class="text-black"> Your chosen Octave is </v-p>  <v-p class="text-h3 text-purple darken-4">{{mqttF.octave.name}}</v-p>
<v-spacer> </v-spacer>

<v-btn class="mt-5 mb-5 text-black" @click="mqttF.Octave2"> 2nd Octave</v-btn>

<v-spacer> </v-spacer>

<v-btn class="mt-5 mb-5 text-black" @click="mqttF.Octave4"> 4Th Octave</v-btn>

<v-spacer> </v-spacer>
<!-- Add octave  Function Buttons -->



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
<v-card v-if="mqttF.loading"> Loading </v-card>

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