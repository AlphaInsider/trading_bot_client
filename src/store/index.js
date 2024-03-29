import Vue from 'vue';
import Vuex from 'vuex';
import * as jose from 'jose';
import axios from 'axios';
import moment from 'moment';
import * as math from 'mathjs';

Vue.use(Vuex);

export default new Vuex.Store({
  //==== STATE ====
  state: {
    windowSize: [],
    loading: [],
    wsChannels: [],
    wsSubscriptions: [],
    wsMessage: {},
    authToken: '',
    bot: {},
    allocation: [],
    ...JSON.parse(sessionStorage.getItem('store'))
  },
  
  //==== MUTATIONS ====
  mutations: {
    saveState(state, data) {
      Object.assign(state, _.cloneDeep({
        ...data
      }));
      // Save session storage
      if(Object.keys(data).some((item) => ['authToken'].includes(item))) {
        sessionStorage.setItem('store', JSON.stringify({
          authToken: state.authToken
        }));
      }
    },
    resetState(state, data) {
      // reset state
      Object.assign(state, _.cloneDeep({
        windowSize: state.windowSize,
        loading: [],
        wsChannels: [],
        wsSubscriptions: [],
        wsMessage: {},
        authToken: '',
        bot: {},
        allocation: []
      }));
      sessionStorage.setItem('store', JSON.stringify({
        authToken: state.authToken
      }));
    }
  },
  
  //==== GETTERS ====
  getters: {
    authTokenInfo(state, getters) {
      return ((state.authToken) ? jose.decodeJwt(state.authToken) : {})
    },
    isLoggedIn(state, getters) {
      return state.authToken !== '';
    },
    user_id(state, getters) {
      return ((state.bot.alphainsider) ? state.bot.alphainsider.user_id : undefined);
    },
    accountTier(state, getters) {
      return ((state.bot.alphainsider) ? state.bot.alphainsider.account_type : 'standard');
    },
    host(state, getters) {
      return ((/electron/i.test(navigator.userAgent)) ? 'electron' : 'digitalocean');
    },
    isMobileView(state, getters) {
      return !state.windowSize.includes('lg');
    }
  },
  
  //==== ACTIONS ====
  actions: {
    //DONE: setWindowSize <width> <height>
    async setWindowSize({state, commit, getters, dispatch}, params = {}) {
      //get window size
      let windowSize = [];
      if(params.width >= 0) windowSize.push('xs');
      if(params.width >= 567) windowSize.push('sm');
      if(params.width >= 768) windowSize.push('md');
      if(params.width >= 992) windowSize.push('lg');
      if(params.width >= 1200) windowSize.push('xl');
      commit('saveState', {
        windowSize: windowSize
      });
    },
    
    //DONE: startLoading <[label]>
    async startLoading({state, commit, getters, dispatch}, params = {}) {
      return Promise.all(params.label.map((label) => {
        //start loading
        if(!state.loading.includes(label)) {
          commit('saveState', {
            loading: state.loading.concat([label])
          });
        }
        //wait for loading to complete
        else {
          return dispatch('waitFor', {label: [label]})
          .then(() => {
            return dispatch('startLoading', {label: [label]});
          });
        }
      }));
    },
    
    //DONE: finishLoading <[label]>
    async finishLoading({state, commit, getters, dispatch}, params = {}) {
      //finish loading
      commit('saveState', {
        loading: _.without(state.loading, ...params.label)
      });
    },
    
    //DONE: waitFor <[label]>
    async waitFor({state, commit, getters, dispatch}, params = {}) {
      //if labels loading, delay and retry
      if(params.label.some((item) => state.loading.includes(item))) {
        await new Promise(resolve => setTimeout(resolve, 300));
        await dispatch('waitFor', params);
      }
    },
    
    //DONE: request <type> <url> <query> --headers-- --auth-- --responseType-- --loadingLabel--
    async request({state, commit, getters, dispatch}, params = {}) {
      //start loading
      if(params.loadingLabel) await dispatch('startLoading', {label: [params.loadingLabel]});
      //get auth token
      if(params.auth) await dispatch('getToken');
      //make request
      return axios({
        method: params.type,
        responseType: params.responseType || 'json',
        headers: {
          ...(params.auth ? {authorization: state.authToken} : {}),
          ...params.headers
        },
        url: '/api/' + params.url,
        params: ((params.type.toLowerCase() === 'get') ? params.query : undefined),
        data: ((params.type.toLowerCase() === 'post') ? params.query : undefined)
      })
      //success
      .then((response) => ((params.responseType && params.responseType !== 'json') ? response : response.data.response))
      //error
      .catch((error) => {
        //auth error, logout and redirect to login
        if(error.response && error.response.status === 401) {
          dispatch('logout', {redirectLogin: true});
        }
        throw error;
      })
      //finish loading
      .finally(() => {
        if(params.loadingLabel) return dispatch('finishLoading', {label: [params.loadingLabel]});
      });
    },
    
    //DONE: getToken
    async getToken({state, commit, getters, dispatch}, params = {}) {
      //if token expired, logout and redirect to login page
      if(getters.isLoggedIn && math.evaluate('(a + 30) >= b', {a: moment().utc().unix(), b: getters.authTokenInfo.exp})) {
        dispatch('logout', {redirectLogin: true});
        throw new Error('Authentication Failed');
      }
    },
    
    //DONE: setTokens <authToken>
    async setTokens({state, commit, getters, dispatch}, params = {}) {
      //set tokens
      commit('saveState', {
        authToken: params.authToken
      });
    },
    
    //DONE: login --password--
    async login({state, commit, getters, dispatch}, params = {}) {
      //request login
      let {auth_token} = await dispatch('request', {
        type: 'post',
        auth: false,
        url: 'login',
        query: {
          password: params.password
        }
      });
      //set tokens
      await dispatch('setTokens', {authToken: auth_token});
      //get bot information
      await dispatch('getBotInfo');
      //get allocation
      await dispatch('getAllocation');
    },
    
    //DONE: logout <redirectLogin>
    async logout({state, commit, getters, dispatch}, params = {}) {
      commit('resetState');
      return ((params.redirectLogin && router.app._route.path !== '/login') ? router.replace('/login') : router.go())
    },
    
    //DONE: getBotInfo
    async getBotInfo({state, commit, getters, dispatch}, params = {}) {
      return Promise.resolve()
      .then(async () => {
        //skip if not logged in
        if(!getters.isLoggedIn) return {};
        
        //request getBotInfo
        let bot = await dispatch('request', {
          type: 'get',
          auth: true,
          url: 'getBotInfo'
        });
        
        //return
        return bot;
      })
      
      //save state
      .then((data) => {
        commit('saveState', {
          bot: data
        });
        return data;
      })
      
      //error
      .catch((error) => {
        toastr.error('Failed to get trading bot information.');
        throw error;
      });
    },
    
    //DONE: getAllocation
    async getAllocation({state, commit, getters, dispatch}, params = {}) {
      return Promise.resolve()
      .then(async () => {
        //skip if not logged in or alphainsider not set, return
        if(!getters.isLoggedIn || !state.bot.alphainsider) return [];
        
        //request getAllocation
        let allocation = await dispatch('request', {
          type: 'get',
          auth: true,
          url: 'getAllocation',
          query: {}
        });
        
        //skip if no strategy allocation
        if(allocation.length <= 0) return [];
        
        //request getStrategies
        let strategies = await dispatch('request', {
          type: 'get',
          auth: true,
          url: 'getStrategies',
          query: {
            strategy_id: _.map(allocation, 'strategy_id')
          }
        });
        
        //calculate
        let computed = _.chain(strategies).map((strategy) => {
          let info = _.find(allocation, {strategy_id: strategy.strategy_id});
          return (info ? {...strategy, allocation_id: info.allocation_id, bot_id: info.bot_id} : null);
        }).compact().value();
        
        //return
        return computed;
      })
      
      //save state
      .then((data) => {
        commit('saveState', {
          allocation: data
        });
        return data;
      })
      
      //error
      .catch((error) => {
        toastr.error('Failed to get allocation.');
        throw error;
      });
    },
    
    //DONE: startBot
    async startBot({state, commit, getters, dispatch}, params = {}) {
      return Promise.resolve()
      .then(async () => {
        //skip if not logged in
        if(!getters.isLoggedIn) return;
        
        //request startBot
        await dispatch('request', {
          type: 'post',
          auth: true,
          url: 'startBot'
        });
        
        //getBotInfo
        await dispatch('getBotInfo');
      })
      
      // error
      .catch((error) => {
        toastr.error('Failed to start trading bot.');
        throw error;
      });
    },
    
    //DONE: stopBot
    async stopBot({state, commit, getters, dispatch}, params = {}) {
      return Promise.resolve()
      .then(async () => {
        //skip if not logged in
        if(!getters.isLoggedIn) return;
        
        //request startBot
        await dispatch('request', {
          type: 'post',
          auth: true,
          url: 'stopBot'
        });
        
        //getBotInfo
        await dispatch('getBotInfo');
      })
      
      // error
      .catch((error) => {
        toastr.error('Failed to stop trading bot.');
        throw error;
      });
    },
    
    //DONE: setBotStatus <status>
    async setBotStatus({state, commit, getters, dispatch}, params = {}) {
      //set bot status
      commit('saveState', {
        bot: {
          ...state.bot,
          status: params.status
        }
      });
    },
    
    //DONE: wsConnect
    async wsConnect({state, commit, getters, dispatch}, params = {}) {
      //update websocket
      await dispatch('wsUpdate', {force: true});
      //start heartbeat
      let heartbeat = async () => {
        //set prevToken
        let prevToken = state.authToken;
        //get token
        return Promise.resolve()
        .then(async () => {
          //get token
          if(getters.isLoggedIn) await dispatch('getToken');
          //if token changed, update websocket
          if(prevToken !== state.authToken) await dispatch('wsUpdate', {force: true});
        })
        //error, disconnect
        .catch(async (error) => {
          await dispatch('wsDisconnect');
        });
      }
      clearInterval(window.websocketHeartbeat);
      window.websocketHeartbeat = setInterval(heartbeat, 5000);
    },
    
    //DONE: wsDisconnect
    async wsDisconnect({state, commit, getters, dispatch}, params = {}) {
      //stop heartbeat
      clearInterval(window.websocketHeartbeat);
    },
    
    //DONE: wsUpdate --force--
    async wsUpdate({state, commit, getters, dispatch}, params = {}) {
      //get token
      if(getters.isLoggedIn) await dispatch('getToken');
      //get new channels
      let newChannels = _.chain(state.wsSubscriptions).map('channels').flatten().uniq().value();
      //if channels changed, update channels, update websocket
      if(!_.isEqual(_.sortBy(state.wsChannels), _.sortBy(newChannels)) || params.force) {
        //update channels
        commit('saveState', {
          wsChannels: newChannels
        });
        //websocket message
        let wsMessage = {
          event: 'subscribe',
          payload: {
            channels: newChannels,
            token: state.authToken || ''
          }
        };
        //send websocket message
        return Promise.resolve()
        .then(() => vue.$ws.json(wsMessage))
        .catch((error) => {});
      }
    },
    
    //DONE: wsSubscribe <id> --[channels]--
    async wsSubscribe({state, commit, getters, dispatch}, params = {}) {
      //get current wsSubscription if it exists
      let currWsSubscription = _.find(state.wsSubscriptions, {id: params.id});
      //build new wsSubscription
      let newWsSubscription = {
        id: params.id,
        channels: _.union(((currWsSubscription) ? currWsSubscription.channels : []), params.channels)
      }
      //remove current subscription from wsSubscriptions
      let updatedWsSubscriptions = state.wsSubscriptions.filter((item) => item.id !== params.id);
      //insert new subscription with subscriptions
      if(newWsSubscription.channels.length > 0) {
        updatedWsSubscriptions = updatedWsSubscriptions.concat([newWsSubscription]);
      }
      //commit change
      commit('saveState', {
        wsSubscriptions: updatedWsSubscriptions
      });
      //update websocket
      await dispatch('wsUpdate');
    },
    
    //DONE: wsUnsubscribe <id> --[channels]--
    async wsUnsubscribe({state, commit, getters, dispatch}, params = {}) {
      //get current wsSubscription if it exists
      let currWsSubscription = _.find(state.wsSubscriptions, {id: params.id});
      //build new wsSubscription
      let newWsSubscription = {
        id: params.id,
        channels: ((params.channels) ? _.without(((currWsSubscription) ? currWsSubscription.channels : []), ...params.channels) : [])
      }
      //remove current wsSubscription from wsSubscriptions
      let updatedWsSubscriptions = state.wsSubscriptions.filter((item) => item.id !== params.id);
      //insert new subscription with subscriptions
      if(newWsSubscription.channels.length > 0) {
        updatedWsSubscriptions = updatedWsSubscriptions.concat([newWsSubscription]);
      }
      //commit change
      commit('saveState', {
        wsSubscriptions: updatedWsSubscriptions
      });
      //update websocket
      await dispatch('wsUpdate');
    },
    
    //DONE: wsHandleMessage <message>
    wsHandleMessage({state, commit, getters, dispatch}, params = {}) {
      //parse message
      let message = JSON.parse(params.message);
      //if invalid channel, unsubscribe
      if(message.event === 'error' && message.response === 'Failed to subscribe to channel.') {
        return Promise.all(state.wsSubscriptions.map((item) => {
          if(item.channels.includes(message.channel)) return dispatch('wsUnsubscribe', {id: item.id, channels: [message.channel]});
        }));
      }
      //save websocket messages
      commit('saveState', {
        wsMessage: message
      });
    }
  }
});