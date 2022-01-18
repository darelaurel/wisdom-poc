<template>
  <div>
      <button v-bind="{...$attrs}"><slot></slot></button>
  </div>
</template>

<script>
export default {
    inheritAttrs:false
}
</script>

<style>

</style>