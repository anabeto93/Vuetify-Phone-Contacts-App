<template>
  <v-app>
     <v-toolbar>
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-toolbar-title>
      <v-btn flat :to="{name:'home'}"> {{ title }} </v-btn>
      </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat :key="index" v-for="(menu, index) in menus" :to={name:menu.route}>{{ menu.name }}</v-btn>
      <!-- <v-btn @click="getUserInfo" color="success">Get User Info</v-btn> -->
    </v-toolbar-items>
  </v-toolbar>

  <router-view></router-view>
  </v-app>
</template>

<script>

import axios from 'axios';
import { Bus } from './plugins/event-bus';
axios.defaults.headers.common['Authorization'] = "Bearer "+window.token;

export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      title: "PhoneBook",
      menus: [],
      noAuthMenu: [
        {name: "Sign Up", route: "signup"},
        {name: "Login", route: "login"},
      ],
      authMenu: [
        { name: "Home", route: "home"},
        {name: "Logout", route: "logout"},
      ],
      //store it temporarily 
    }
  },
  methods: {
    getUserInfo() {
      axios.post('/user')
      .then((response) => {
        // eslint-disable-next-line
        console.log(response);
      })
    },
    onLoggedIn() {
      this.menus = this.authMenu;
    },
    onLogout() {
      this.menus = this.noAuthMenu;
    }
  },
  mounted() {
    if(window.token) {
      this.onLoggedIn();
    }
  },
  created() {
    this.menus = this.noAuthMenu;
    Bus.$on('loggedIn',()=> {
      this.onLoggedIn();
    })

    Bus.$on('logout',() => {
      this.onLogout();
    })
    // eslint-disable-next-line
    console.log('isAuthenticated ',window.isAuthenticated)
  }
}
</script>
