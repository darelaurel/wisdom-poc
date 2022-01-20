<template>
  <div>
    <div>
      <Card :data="{ lag, long }" />
      
        <l-map @click="addMarker" style="height: 50vh" :zoom="zoom" :center="center">
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          <l-marker :lat-lng="markerLatLng"></l-marker>
        </l-map>
        {{JSON.stringify(markerLatLng)}}
      <Wattime style="marginTop:4rem" :data="{ lag, long }" />



    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import Card from "./Card.vue";
import "leaflet/dist/leaflet.css"
import {LMap, LTileLayer, LMarker} from "@vue-leaflet/vue-leaflet";
import Wattime from "./Wattime.vue";
export default {
  components: {
    Card,
    Wattime,
    LMap,
    LTileLayer, LMarker
  },
  setup() {
    const lag = ref(""),
      long = ref("");
    
    let zoom = ref(15), 
        center = ref([51.505, -0.159]),
        markerLatLng = ref([51.504, -0.159]),
        url =ref('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
        attribution = '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors'

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

    const addMarker=(event)=>{
      console.log(event.latlng.lat)
      markerLatLng.value = [event.latlng.lat,event.latlng.lng]
      lag.value=event.latlng.lat
      long.value=event.latlng.lng
      center.value = [event.latlng.lat,event.latlng.lng]
    }

    onMounted(getCoordinate);

    return { lag, long,zoom,center,markerLatLng,url,attribution,addMarker };
  },
};
</script>

<style>
</style>