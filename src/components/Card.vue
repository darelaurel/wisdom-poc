<template>
  <div>
      {{JSON.stringify(data)}}
  </div>
</template>

<script>
export default {
    props:{
        data:{
            type:Object,
            required:true
        }
    }
}
</script>

<style>

</style>