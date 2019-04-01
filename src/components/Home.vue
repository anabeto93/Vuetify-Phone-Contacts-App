<template>
  <v-container fluid fill-height>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <img src="@/assets/logo.png" alt="Vuetify.js" class="mb-5">

        <!-- <div v-for="(contact,index) in contacts" :key="index">
          <h3>{{contact.mobile}}</h3>
        </div> -->
        <phonebook></phonebook>

      </v-layout>
    </v-slide-y-transition>      
  </v-container>
</template>

<script>
import axios from 'axios';
import phonebook from '@/components/PhonebookDatatable'

  export default {
    components: {
      phonebook
    },
    data: () => ({
      contacts: [],
    }),
    methods: {
      getContacts() {
        axios.get('/contacts')
        .then((response) => {
          // eslint-disable-next-line
          console.log(response);
          let gottenContacts = response.data.data;
          this.contacts = gottenContacts;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log('All contacts Error', error);
        })
      }
    },
    mounted() {
      // eslint-disable-next-line
      //console.log('And the token is ',localStorage.getItem('token'))
      if(!window.isAuthenticated) {
        this.$router.push('login')
      }else {
        // eslint-disable-next-line
        console.log('Checking if token exists')
        if(localStorage.getItem('token')) {
          let authMenu = [
            { name: "Home", route: "home"},
            {name: "Logout", route: "logout"}
          ];
          window.defaultMenu = authMenu;
        }
        //this.getContacts();
      }
    },
    created() {
      //axios.defaults.headers.common['Authorization'] = "Bearer "+localStorage.getItem('token');
    }
  }
</script>

<style>

</style>
