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
      const res = await axios(`/register`, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        withCredentials: true,
        credentials: "same-origin",
        data: registerCreds,
      });

      console.log({ res });
    };

    const login = async () => {
      const res = await axios(`/login`, {
        method: "GET",
        headers: {
          Authorization: "Basic bWhhY3hlcm1vb2Q5MTQ6VGVzdEAxMjM0NQ==",
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