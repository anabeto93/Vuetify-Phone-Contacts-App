<template>
  <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>SignUp form</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-btn icon large href="https://codepen.io/johnjleider/pen/wyYVVj" target="_blank" v-on="on">
                      <v-icon large>mdi-codepen</v-icon>
                    </v-btn>
                  </template>
                  <span>Codepen</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field prepend-icon="person" name="name" label="Name" type="text" v-model="name"></v-text-field>
                  <v-text-field prepend-icon="email" name="email" label="Email" type="email" v-model="email"></v-text-field>
                  <v-text-field id="password" prepend-icon="lock" name="password" label="Password" type="password" v-model="password"></v-text-field>
                  <v-text-field id="password-confirm" prepend-icon="lock" name="password_confirmation" label="Confirm Password" type="password" v-model="password_confirmation"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" type="submit" @click="registerUser">Sign Up</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
</template>

<script>
import axios from 'axios';
import {Bus} from '../plugins/event-bus'

  export default {
    data: () => ({
      email: null,
      name: null,
      password: null,
      password_confirmation: null
    }),
    methods: {
      registerUser() {
        axios.post('/register', 
        {
          name: this.name, 
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation
        })
        .then((response) => {
          // eslint-disable-next-line
          console.log(response);
          let accessToken = response.data.auth.access_token;
          let user = response.data.user;
          localStorage.setItem('token',accessToken);
          localStorage.setItem('user',user.name);

          Bus.$emit('loggedIn')
          //set the person to signed in
          window.isAuthenticated = true;
          //redirect to the home page
          this.$router.push('home')
          
  
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log('Register Error', error);
        })
      }
    }
  }
</script>

<style>

</style>
