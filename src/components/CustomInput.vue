<template>
  <div>
      <input type="text" :value="title" @input="$emit('update:title',$event.target.value)">
      slot <slot />
  </div>
</template>

<script>
export default {
    props:{
        title:String
    }
}
</script>

<style>

</style>