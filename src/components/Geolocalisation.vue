<template>
  <div>
    <div>
      <Card :data="{ lag, long }" />

      <Wattime :data="{ lag, long }" />

    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import Card from "./Card.vue";
import Wattime from "./Wattime.vue";
export default {
  components: {
    Card,
    Wattime,
  },
  setup() {
    const lag = ref(""),
      long = ref("");

    const getCoordinate = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          lag.value = position.coords.latitude;
          long.value = position.coords.longitude;
        },
        (error) => {
          console.log(error.message);
        }
      );
    };
    onMounted(getCoordinate);

    return { lag, long };
  },
};
</script>

<style>
</style>