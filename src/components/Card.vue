<template>
  <div>
      {{data}}
  </div>
</template>

<script>
//import Wattime from "./Wattime.vue"
export default {
    props:{
        data:{
            type:Object,
            required:true
        }
    },
    components:{
        //Wattime
    }
}
</script>

<style>

</style>