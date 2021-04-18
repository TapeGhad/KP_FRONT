import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import * as io from "socket.io-client";
import VueSocketIO from "vue-socket.io";

import { environment } from './environments/environment';

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: io(environment.backendBaseUrl),
  })
);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
