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
    strategySubscriptions: [],
    ...JSON.parse(sessionStorage.getItem('store'))
  },
  
  //==== MUTATIONS ====
  mutations: {
    saveState(state, data) {
      Object.assign(state, _.cloneDeep({
        ...data
      }));
      // Save session storage
      if(Object.keys(data).some((item) => ['authToken', 'strategySubscriptions'].includes(item))) {
        sessionStorage.setItem('store', JSON.stringify({
          authToken: state.authToken,
          strategySubscriptions: state.strategySubscriptions
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
        strategySubscriptions: [],
      }));
      sessionStorage.setItem('store', JSON.stringify({
        authToken: state.authToken,
        strategySubscriptions: state.strategySubscriptions
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
      return getters.authTokenInfo.user_id;
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
    
    //DONE: logout <redirectLogin>
    async logout({state, commit, getters, dispatch}, params = {}) {
      commit('resetState');
      return ((params.redirectLogin && router.app._route.path !== '/login') ? router.replace('/login') : router.go())
    },
    
    //DONE: getStrategySubscriptions --[strategy_id]--
    async getStrategySubscriptions({state, commit, getters, dispatch}, params = {}) {
      //skip if not logged in
      if(!getters.isLoggedIn) return;
      //start loading
      await dispatch('startLoading', {label: ['getStrategySubscriptions']});
      //request getStrategySubscriptions
      return dispatch('request', {
        type: 'get',
        auth: true,
        url: 'getStrategySubscriptions',
        query: {
          strategy_id: params.strategy_id
        }
      })
      //set strategy subscriptions
      .then((strategySubscriptions) => {
        commit('saveState', {
          strategySubscriptions: ((params.strategy_id) ? _.unionBy(strategySubscriptions, state.strategySubscriptions, 'strategy_id') : strategySubscriptions)
        });
      })
      //error
      .catch((error) => {
        toastr.error('Failed to get strategy subscriptions.');
        throw error;
      })
      //finish loading
      .finally(() => {
        return dispatch('finishLoading', {label: ['getStrategySubscriptions']});
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
        try {
          //get token
          if(getters.isLoggedIn) await dispatch('getToken');
          //if token changed, update websocket
          if(prevToken !== state.authToken) await dispatch('wsUpdate', {force: true});
        }
        //error, disconnect
        catch(error) {
          await dispatch('wsDisconnect');
        }
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