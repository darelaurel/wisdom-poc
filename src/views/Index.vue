<template>
  <div>
    <div>

      <Geolocalisation />
      
    </div>
  </div>
</template>

<script>
// import CustomInput from '../components/CustomInput.vue';
// import BaseButton from '../components/BaseButton.vue';
// import About from './About.vue';
import Geolocalisation from "../components/Geolocalisation.vue"


export default {
    components:{
      Geolocalisation,
      // CustomInput,
      // BaseButton
      // // About
    },
    data(){
      return {
        name:""
      }
    },
    watch:{
      name(newValue){
        console.log({newValue})
      }
    },
    methods:{
      scream(){
        console.log("ok cool")
      }
    }
}

</script>

<style>
</style>