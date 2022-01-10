<template>
  <div></div>
</template>

<script>
import { onMounted } from "@vue/runtime-core";
import axios from "axios";
import { registerCreds } from "../config/credentials";
// import { BASE_URL } from "./../config/api";
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
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
        console.log({res})
      } catch (error) {
        console.log({ error });
      }
    };

    const login = async () => {
      const res = await axios(`/login`, {
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

      console.log({ res });
    };

    onMounted(() => {
      register();
      login();
    });
  },
};
</script>

<style>
</style>