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
    bot: {},
    ...JSON.parse(sessionStorage.getItem('store'))
  },
  
  //==== MUTATIONS ====
  mutations: {
    saveState(state, data) {
      Object.assign(state, _.cloneDeep({
        ...data
      }));
      // Save session storage
      if(Object.keys(data).some((item) => ['authToken', 'strategySubscriptions', 'bot'].includes(item))) {
        sessionStorage.setItem('store', JSON.stringify({
          authToken: state.authToken,
          strategySubscriptions: state.strategySubscriptions,
          bot: state.bot
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
        bot: {}
      }));
      sessionStorage.setItem('store', JSON.stringify({
        authToken: state.authToken,
        strategySubscriptions: state.strategySubscriptions,
        bot: state.bot
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
    setWindowSize({state, commit, getters, dispatch}, params = {}) {
      return Promise.resolve()
      //get window size
      .then(() => {
        let windowSize = [];
        if(params.width >= 0) windowSize.push('xs');
        if(params.width >= 567) windowSize.push('sm');
        if(params.width >= 768) windowSize.push('md');
        if(params.width >= 992) windowSize.push('lg');
        if(params.width >= 1200) windowSize.push('xl');
        commit('saveState', {
          windowSize: windowSize
        });
      });
    },
    
    //DONE: startLoading <[label]>
    startLoading({state, commit, getters, dispatch}, params = {}) {
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
    finishLoading({state, commit, getters, dispatch}, params = {}) {
      return Promise.resolve()
      //finish loading
      .then(() => {
        commit('saveState', {
          loading: _.without(state.loading, ...params.label)
        });
      });
    },
    
    //DONE: waitFor <[label]>
    waitFor({state, commit, getters, dispatch}, params = {}) {
      return Promise.resolve()
      //if labels loading, delay and retry
      .then(() => {
        if(params.label.some((item) => state.loading.includes(item))) {
          return new Promise((resolve) => setTimeout(() => resolve(), 300))
          .then(() => dispatch('waitFor', params));
        }
      });
    },
    
    //DONE: request <type> <url> <query> --headers-- --auth-- --responseType-- --loadingLabel--
    request({state, commit, getters, dispatch}, params = {}) {
      return Promise.resolve()
      //start loading
      .then(() => {
        if(params.loadingLabel) return dispatch('startLoading', {label: [params.loadingLabel]});
      })
      //get auth token
      .then(() => {
        if(params.auth) return dispatch('getToken');
      })
      //make request
      .then(() => {
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
        });
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
    
    //CHECK: getToken
    async getToken({state, commit, getters, dispatch}, params = {}) {
      //skip if token hasn't expired
      if(getters.isLoggedIn && math.evaluate('(a + 30) < b', {a: moment().utc().unix(), b: getters.authTokenInfo.exp})) return Promise.resolve();
      
      //else, logout and redirect to login
      dispatch('logout', {redirectLogin: true});
      throw new Error('Authentication Failed');
    },
    
    //DONE: setTokens <authToken>
    setTokens({state, commit, getters, dispatch}, params = {}) {
      return Promise.resolve()
      //set tokens
      .then(() => {
        commit('saveState', {
          authToken: params.authToken
        });
      });
    },
    
    //DONE: logout <redirectLogin>
    logout({state, commit, getters, dispatch}, params = {}) {
      commit('resetState');
      return ((params.redirectLogin && router.app._route.path !== '/login') ? router.replace('/login') : router.go())
    },

    //CHECK: getStrategySubscriptions --[strategy_id]--
    getStrategySubscriptions({state, commit, getters, dispatch}, params = {}) {
      //if not logged in
      if(!getters.isLoggedIn) return Promise.resolve();

      //start loading
      return dispatch('startLoading', {label: ['getStrategySubscriptions']})

      //request getStrategySubscriptions
      .then(() => {
        return dispatch('request', {
          type: 'get',
          auth: true,
          url: 'getStrategySubscriptions',
          query: {
            strategy_id: params.strategy_id
          }
        })
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
    
    //CHECK: getBotInfo
    getBotInfo({state, commit, getters, dispatch}, params = {}) {
      // if not logged in
      if(!getters.isLoggedIn) return Promise.resolve();

      //start loading
      return dispatch('startLoading', {label: ['getBotInfo']})

      // request getBotInfo
      .then(() => {
        return dispatch('request', {
          type: 'get',
          auth: true,
          url: 'getBotInfo'
        });
      })

      // set bot info
      .then((bot) => {
        commit('saveState', {
          bot
        });
      })

      // error
      .catch((error) => {
        toastr.error('Failed to get trading bot information.');
        throw error;
      })

      // finish loading
      .finally(() => {
        return dispatch('finishLoading', {label: ['getBotInfo']});
      });
    },
    
    //DONE: wsConnect
    wsConnect({state, commit, getters, dispatch}, params = {}) {
      return Promise.resolve()
      //update websocket
      .then(() => {
        return dispatch('wsUpdate', {force: true});
      })
      //start heartbeat
      .then(() => {
        let heartbeat = () => {
          //set prevToken
          let prevToken = state.authToken;
          //get token
          return Promise.resolve()
          .then(() => {
            if(getters.isLoggedIn) return dispatch('getToken');
          })
          //if token changed, update websocket
          .then(() => {
            if(prevToken !== state.authToken) return dispatch('wsUpdate', {force: true});
          })
          //error, disconnect
          .catch((error) => {
            return dispatch('wsDisconnect');
          });
        }
        clearInterval(window.websocketHeartbeat);
        window.websocketHeartbeat = setInterval(heartbeat, 5000);
      });
    },
    
    //DONE: wsDisconnect
    wsDisconnect({state, commit, getters, dispatch}, params = {}) {
      return Promise.resolve()
      //stop heartbeat
      .then(() => {
        clearInterval(window.websocketHeartbeat);
      });
    },
    
    //DONE: wsUpdate --force--
    wsUpdate({state, commit, getters, dispatch}, params = {}) {
      //get token
      return Promise.resolve()
      .then(() => {
        if(getters.isLoggedIn) return dispatch('getToken');
      })
      //update websocket
      .then(() => {
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
      });
    },
    
    //DONE: wsSubscribe <id> --[channels]--
    wsSubscribe({state, commit, getters, dispatch}, params = {}) {
      //subscribe
      return Promise.resolve()
      .then(() => {
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
      })
      //update websocket
      .then(() => {
        return dispatch('wsUpdate');
      });
    },
    
    //DONE: wsUnsubscribe <id> --[channels]--
    wsUnsubscribe({state, commit, getters, dispatch}, params = {}) {
      //unsubscribe
      return Promise.resolve()
      .then(() => {
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
      })
      //update websocket
      .then(() => {
        return dispatch('wsUpdate');
      });
    },
    
    //DONE: wsHandleMessage <message>
    wsHandleMessage({state, commit, getters, dispatch}, params = {}) {
      return Promise.resolve()
      //parse message
      .then(() => {
        return JSON.parse(params.message);
      })
      //handle events
      .then((message) => {
        //invalid channel, unsubscribe
        if(message.event === 'error' && message.response === 'Failed to subscribe to channel.') {
          return Promise.all(state.wsSubscriptions.map((item) => {
            if(item.channels.includes(message.channel)) return dispatch('wsUnsubscribe', {id: item.id, channels: [message.channel]});
          }));
        }
        //save websocket messages
        commit('saveState', {
          wsMessage: message
        });
      });
    }
  }
});