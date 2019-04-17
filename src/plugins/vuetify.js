import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '../assets/stylus/main.styl';

/* Theme Ref: https://vuetifyjs.com/en/framework/theme#modifying-stylus-variables */
Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: '#576adb',
  },
});
