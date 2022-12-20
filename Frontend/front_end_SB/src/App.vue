<template>

  <!-- Background -->
 <span class="bg"></span>

  <v-app>

    <v-container fluid>
      <router-view/>
    </v-container>


    <v-footer color="white" app height="20" class="pa-5">
      <v-avatar
      class="text-white"
      color="black"
      size="66"
      > RA</v-avatar>
      
      <v-card-text class="text-h6 text-black"> Made by: Rayan Azzi   </v-card-text>
       <!-- Bij verschaling  -->
    
    </v-footer>


  </v-app>

 
 

</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',

  data () {
    return {
      //
    }
  },
})
</script>

//https://wallpaperaccess.com/music-4k

<style scoped>
.bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: url( './img/background.jpg') no-repeat center center;
    background-size: cover;
    background-color: red;
    transform: scale(1.1);
   
  }
</style>