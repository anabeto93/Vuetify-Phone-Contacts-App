<template>
  <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <h3>You are logged out</h3>
          </v-flex>
        </v-layout>
      </v-container>
</template>

<script>
import { setTimeout } from 'timers';
import {Bus} from '../plugins/event-bus';

  export default {
    data: () => ({
      email: null,
      password: null,
    }),
    created() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      Bus.$emit('logout')
      window.isAuthenticated = false;
      let here = this;
      setTimeout(function() {
        here.$router.push('home');
      },500);
    }
  }
</script>

<style>

</style>
