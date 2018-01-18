import Vue from 'vue';
// import Vuex from 'vuex';

import Components from '../src/index';

import App from './app';
// import router from './router';

Vue.use(Components);

var vm = new Vue({
  el: '#app',
  // router,
  template: '<App/>',
  components: { App }
});
