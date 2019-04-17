import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './stores/store';

/* Import babel-polyfill for IE11 + Safari 9 support */
import 'babel-polyfill';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
