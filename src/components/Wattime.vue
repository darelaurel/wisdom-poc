<template>
  <div>
    <button @click="BalancingAuthority">Balancing Authority</button>
    <button @click="RealTimeEmissionIndex">Real Time Emission Index</button>
    <button @click="gridEmission">Grid Emission Data</button>
    <input type="checkbox" v-model="grid_emission_checked" id="" />
    <button @click="emissionForecast">Forecast Emission Data</button>
    <input type="checkbox" v-model="forecast_emission_checked" id="" />
    <button @click="historical">Historical Emission</button>
    <div v-if="grid_emission_checked">
      <form>
        <input type="datetime-local" v-model="gridEmissionData.starttime" />
        <input type="datetime-local" v-model="gridEmissionData.endtime" />
      </form>
    </div>

    <div v-if="forecast_emission_checked">
      <form>
        <input type="datetime-local" v-model="emissionForecastData.starttime" />
        <input type="datetime-local" v-model="emissionForecastData.endtime" />
      </form>
    </div>

    <Card :data="ba" />
    <Card :data="realTimeEmissionIndex" />
    <Card :data="gridEmissionValues" />
    <Card :data="emissionForecastValues" />
    <Card :data="historicalResponseError" />
  </div>
</template>

<script>
import axios from "axios";
import { registerCreds } from "../config/credentials";
import { onMounted } from "@vue/runtime-core";
import Card from "./Card.vue";
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  components: {
    Card,
  },
  data() {
    return {
      grid_emission_checked: false,
      forecast_emission_checked: false,
      ba: null,
      realTimeEmissionIndex: null,
      gridEmissionValues: null,
      emissionForecastValues: null,
      historicalResponseError: "",
      gridEmissionData: {
        starttime: null,
        endtime: null,
      },
      emissionForecastData: {
        starttime: null,
        endtime: null,
      },
    };
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
      const { data } = await axios.post("http://localhost:5500/login", {
        username: registerCreds.username,
        password: registerCreds.password,
      });
      console.log(data);

      localStorage.setItem("token", data.token);
    };

    onMounted(() => {
      if (!localStorage.getItem("token")) register();
      else login();
    });
  },
  methods: {
    async BalancingAuthority() {
      try {
        const response = await axios.post(
          "http://localhost:5500/balancing-authority",
          {
            lag: "42.372",
            long: "-72.519",
            token: localStorage.getItem("token"),
          }
        );

        console.log({ response });
        if (!response.data) throw Error(response);
        this.ba = response.data;
      } catch (error) {
        this.ba = error.message;
      }
    },

    async RealTimeEmissionIndex() {
      try {
        const response = await axios.post(
          "http://localhost:5500/real-time-emission-index",
          {
            lag: "42.372",
            long: "-72.519",
            token: localStorage.getItem("token"),
          }
        );

        console.log({ response });
        if (!response.data) throw Error(response);
        this.realTimeEmissionIndex = response.data;
      } catch (error) {
        this.realTimeEmissionIndex = error.message;
      }
    },

    async gridEmission() {
      try {
        const response = await axios.post(
          "http://localhost:5500/grid-emission-data",
          {
            ba: "CAISO_NORTH",
            token: localStorage.getItem("token"),
          }
        );

        console.log({ response });
        if (!response.data) throw Error(response);
        this.gridEmissionValues = response.data;
      } catch (error) {
        this.gridEmissionValues = error.message;
      }
    },

    async emissionForecast() {
      try {
        const response = await axios.post(
          "http://localhost:5500/emission-forecast",
          {
            ba: "CAISO_NORTH",
            starttime: this.emissionForecastData.starttime,
            endtime: this.emissionForecastData.endtime,
            token: localStorage.getItem("token"),
          }
        );

        console.log({ response });
        if (!response.data) throw Error(response);
        this.emissionForecastValues = response.data;
      } catch (error) {
        this.emissionForecastValues = error.message;
      }
    },

    async historical() {
      try {
        const response = await axios.post(
          "http://localhost:5500/historical-emission",
          {
            ba: "CAISO_NORTH",
            token: localStorage.getItem("token"),
          },
          {
            responseType: "blob",
          }
        );

        const downloadUrl = window.URL.createObjectURL(
          new Blob([response.data])
        );

        const link = document.createElement("a");

        link.href = downloadUrl;

        link.setAttribute("download", "file.zip"); //any other extension

        document.body.appendChild(link);

        link.click();

        link.remove();

        console.log({ response });
        if (!response.data) throw Error(response);
      } catch (error) {
        this.ba = error.message;
      }
    },
  },
};
</script>

<style>
</style>