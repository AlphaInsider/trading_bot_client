import jQuery from 'jquery'; window.jQuery = jQuery;
import 'bootstrap';
import _ from 'lodash'; window._ = _;
import moment from 'moment'; window.moment = moment;
import toastr from 'toastr'; window.toastr = toastr;
import * as math from 'mathjs'; window.math = math;
import Sockette from 'sockette';
import PortalVue from 'portal-vue';
import PullToRefresh from 'pulltorefreshjs'; window.PullToRefresh = PullToRefresh;

import config from '../config.js'; window.config = config;
import Vue from 'vue';
import VueRouter from 'vue-router';
import {IMaskComponent} from 'vue-imask';
import {ValidationObserver, ValidationProvider, extend} from 'vee-validate/dist/vee-validate.full.esm';
import app from '@/app.vue';
import store from './store/index.js';

// Websocket URL
let wsBaseURL = (window.location.protocol === 'https:' ? 'wss://' : 'ws://')+window.location.host+'/ws';

//library settings
// moment config
moment.updateLocale('en', {
  relativeTime : {
    future: 'in %s',
    past:   '%s ago',
    s  : '%d secs',
    ss : '%d secs',
    m:  '%d min',
    mm: '%d mins',
    h:  '%d hr',
    hh: '%d hrs'
  }
});
// vee-validate config
extend('url', {
  validate: value => {
    try {
      let url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    }
    catch(e) {
      return false;
    }
  },
  message: 'The {_field_} field must be a valid url'
});
extend('invalid', {
  validate: (value) => {
    return false;
  },
  message: 'The {_field_} field is not valid'
});
// toastr config
window.toastr.options = {
  positionClass: 'toast-top-center',
  newestOnTop: true,
  timeOut: 6000
};

//vue settings
Vue.use(VueRouter);
Vue.use(PortalVue);
//template injected libraries
Object.defineProperty(Vue.prototype, '$config', {value: config});
Object.defineProperty(Vue.prototype, '$_', {value: _});
Object.defineProperty(Vue.prototype, '$moment', {value: moment});
Object.defineProperty(Vue.prototype, '$math', {value: math});
// $abbreviateNumber <number>
Object.defineProperty(Vue.prototype, '$abbreviateNumber', {
  value: (number = 0) => {
    let abrNum = number;
    const suffixes = ['','K','M','B','T'];
    let suffixNum = 0;
    while(abrNum >= 1000) {
      abrNum /= 1000;
      suffixNum++;
    }
    abrNum = (number < 1000 ? abrNum : abrNum.toPrecision(2));
    abrNum += suffixes[suffixNum];
    return abrNum;
  }
});
// $formatNumber <number> --round-- --symbol-- --fixedDecimal--
Object.defineProperty(Vue.prototype, '$formatNumber', {
  value: (number = '0', round, symbol = '', fixedDecimal = false) => {
    let formatNum = math.evaluate('abs(a)', {a: number}).toString();
    // return if number is 0
    if(math.evaluate('a == 0', {a: formatNum})) return symbol + '0';
    // round number
    if(_.isNumber(round)) {
      formatNum = math.evaluate('round(a, b)', {a: formatNum, b: round}).toString();
      if(math.evaluate('a == 0', {a: formatNum})) return symbol + '0..';
    }
    // convert number to string
    if(fixedDecimal && _.isNumber(round)) formatNum = math.evaluate(`format(bignumber(a), {notation: 'fixed', precision: b})`, {a: formatNum, b: round}).toString();
    // split at decimal
    let splitNum = formatNum.split('.');
    let left = splitNum[0];
    let right = ((splitNum.length > 1) ? '.' + splitNum[1] : '');
    // add comma every 3 digits on left of decimal
    let format = /(\d+)(\d{3})/;
    while (format.test(left)) {
      left = left.replace(format, '$1' + ',' + '$2');
    }
    return ((math.evaluate('a < 0', {a: number})) ? '-' : '') + symbol + left + right;
  }
});
Object.defineProperty(Vue.prototype, '$ws', {
  value: new Sockette(wsBaseURL, {
    onopen: (event) => store.dispatch('wsConnect'),
    onmessage: (event) => store.dispatch('wsHandleMessage', {message: event.data}),
    onclose: (event) => store.dispatch('wsDisconnect'),
    onerror: (event) => store.dispatch('wsDisconnect')
  })
});
//global components
Vue.component('input-mask', IMaskComponent);
Vue.component('validation-observer', ValidationObserver);
Vue.component('validation-provider', ValidationProvider);
//global directives
Vue.directive('tooltip',{
  bind: (el, binding) => {
    jQuery(el).tooltip({
      title: binding.value,
      placement: binding.arg
    });
  },
  update: (el, binding) => {
    jQuery(el).attr('data-original-title', binding.value);
  }
});

//routes
let routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
    meta: {
      auth: false,
      hideNav: true
    },
    beforeEnter: async (to, from, next) => {
      //if host is desktop and not logged in, login and redirect home or setup
      if(store.getters.host === 'electron' && !store.getters.isLoggedIn) {
        await store.dispatch('login');
        if(store.state.bot.status === 'off' && (!store.state.bot.alphainsider || !store.state.bot.broker || store.state.allocations.length <= 0)) next({name: 'setup'});
        else next({name: 'home'});
      }
      //else, continue
      else {
        next();
      }
    }
  },
  {
    path: '/setup',
    name: 'setup',
    component: () => import('@/views/setup.vue'),
    meta: {
      auth: true,
      hideNav: true
    }
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home.vue'),
    meta: {
      auth: true
    }
  },
  {
    path: '/settings',
    component: () => import('@/views/settings.vue'),
    children: [
      {
        path: '',
        name: 'settings',
        component: () => import('@/views/settings-user.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: 'user',
        name: 'settings_user',
        component: () => import('@/views/settings-user.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: 'trading-bot',
        name: 'settings_trading_bot',
        component: () => import('@/views/settings-trading-bot.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: 'api-keys',
        name: 'settings_api_keys',
        component: () => import('@/views/settings-api-keys.vue'),
        meta: {
          auth: true
        }
      }
    ]
  },
  {
    path: '/risk-disclaimer',
    name: 'risk_disclaimer',
    component: () => import('@/views/risk-disclaimer.vue')
  },
  {
    path: '/privacy-policy',
    name: 'privacy_policy',
    component: () => import('@/views/privacy-policy.vue')
  },
  {
    path: '/password-tutorial',
    name: 'password_tutorial',
    component: () => import('@/views/tutorial-password.vue')
  },
  {
    path: '/update-tutorial',
    name: 'update_tutorial',
    component: () => import('@/views/tutorial-update.vue')
  },
  {
    path: '/page-not-found',
    name: 'error',
    component: () => import('@/views/error.vue')
  },
  {
    path: '*',
    redirect: '/page-not-found'
  }
];

//init router
window.router = new VueRouter({
  routes: routes,
  mode: 'history',
  scrollBehavior: (to, from, savedPosition) => {
    if(savedPosition) {
      return savedPosition;
    }
    else if(to.path === from.path) {
      return null;
    }
    else {
      return {x: 0, y: 0};
    }
  }
});

//before each route change
router.beforeEach(async (to, from, next) => {
  //trying to get to page for logged in users, but not logged in, redirect to login
  if(to.meta.auth === true && store.getters.isLoggedIn === false) {
    next({
      name: 'login',
      ...((to.name !== 'home') ? {query: {redirect: to.fullPath}} : {})
    });
  }
  //trying to get to page for logged out users, but not logged out, redirect to dashboard
  else if(to.meta.auth === false && store.getters.isLoggedIn === true) {
    next('/');
  }
  //continue
  else {
    next();
  }
});

//start app
window.vue = new Vue({
  router,
  store,
  render: h => h(app)
}).$mount('#app');
