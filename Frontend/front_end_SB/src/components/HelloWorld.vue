
<script>
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

    </v-row>
  </v-container>
</template>


