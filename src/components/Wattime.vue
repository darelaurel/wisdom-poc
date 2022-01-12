<template>
  <div>
    <button @click="BalancingAuthority">Balancing Authority</button>
    <button @click="RealTimeEmissionIndex">Real Time Emission Index</button>
    <button @click="gridEmission">Grid Emission Data</button> <input type="checkbox"  v-model="grid_emission_checked" id="">
    <button @click="emissionForecast">Forecast Emission Data</button> <input type="checkbox"  v-model="forecast_emission_checked" id="">
    {{forecast_emission_checked}}
    <div v-if="grid_emission_checked">
      <form>
        <input type="datetime-local" v-model="gridEmissionData.starttime">
        <input type="datetime-local" v-model="gridEmissionData.endtime">
      </form>
    </div>

    <div v-if="forecast_emission_checked">
      <form>
        <input type="datetime-local" v-model="emissionForecastData.starttime">
        <input type="datetime-local" v-model="emissionForecastData.endtime">
      </form>
    </div>

    <Card :data="ba" />
    <Card :data="realTimeEmissionIndex" />
    <Card :data="gridEmissionValues" />
    <Card :data="emissionForecastValues" />
  </div>
</template>

<script>
import axios from "axios";
import { getBalancingAuthority,getRealTimeEmissionIndex ,getGridEmissionData,getEmissionForcast} from "./../config/api";
import { registerCreds } from "../config/credentials";
import { onMounted } from "@vue/runtime-core";
import Card from "./Card.vue"
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  components:{
    Card
  },
  data(){
    return {
      grid_emission_checked:false,
      forecast_emission_checked:false,
      ba:null,
      realTimeEmissionIndex:null,
      gridEmissionValues:null,
      emissionForecastValues:null,
      gridEmissionData:{
        starttime:null,
        endtime:null
      },
      emissionForecastData:{
        starttime:null,
        endtime:null
      }
    }
  },
  created() {},
  setup() {
    const register = async () => {
      try {
        const res = await axios(`/register`, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          data: registerCreds,
        });
        console.log({ res });
      } catch (error) {
        console.log({ error });
      }
    };

    const login = async () => {
      const { data } = await axios(`/login`, {
        method: "GET",
        mode: "no-cors",
        headers: {
          Authorization: `Basic ${btoa(
            `${registerCreds.username}:${registerCreds.password}`
          )}`,
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });

      localStorage.setItem("token", data.token);
    };

    onMounted(() => {
      if (!localStorage.getItem("token")) register();
      else login();
    });
  },
  methods: {
    async BalancingAuthority(){

      try {
        const response = await getBalancingAuthority(42.372,-72.519)
        if(!response.data)throw Error(response);
        this.ba=response.data
      } catch (error) {
        this.ba=error.message   
      }

    },

    async RealTimeEmissionIndex(){
      try {
        const response = await getRealTimeEmissionIndex(this.ba.abbrev)
        if(!response.data)throw Error(response);
        this.realTimeEmissionIndex=response.data
      } catch (error) {
        this.realTimeEmissionIndex=error.message   
      }
    },

    async gridEmission(){
      try {
        const response = await getGridEmissionData({...this.gridEmissionData,ba:'CAISO_NORTH'})
        if(!response.data)throw Error(response);
        this.gridEmissionValues=response.data
      } catch (error) {
        this.gridEmissionValues=error.message   
      }
    },

    async emissionForecast(){
      try {
        const response = await getEmissionForcast({...this.emissionForecastData,ba:'CAISO_NORTH'})
        if(!response.data)throw Error(response);
        this.emissionForecastValues=response.data
      } catch (error) {
        this.emissionForecastValues=error.message   
      }
    }



  },
};
</script>

<style>
</style>