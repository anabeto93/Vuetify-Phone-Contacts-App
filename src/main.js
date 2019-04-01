import Vue from 'vue'
import './plugins/vuetify'
import router from './router'
import axios from 'axios'
import App from './App.vue'

window.axios= require('axios')

window.token = localStorage.getItem('token');

axios.defaults.baseURL = 'https://passport.app/api/v1'
axios.defaults.headers.common['Authorization'] = "Bearer "+window.token;
axios.defaults.headers.common['Content-type'] = "application/json";

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
