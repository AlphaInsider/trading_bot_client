<template>
<div>
  <validation-observer key="broker" v-slot="event">
    <form @submit.prevent="event.handleSubmit(() => updateBroker(event))">
      <!-- broker allocation type -->
      <div class="d-flex justify-content-between align-items-center">
        <div class="line-height-sm">
          <label>Select Broker</label>
        </div>
      </div>
      <div class="mt-2">
        <div class="btn-group btn-group-toggle btn-block" data-toggle="buttons">
          <button type="button" @click="assetClass = 'stock'; selectBroker('alpaca');" :class="(assetClass === 'stock' ? 'btn-primary' : 'btn-outline-primary')" class="btn w-50">Stock</button>
          <button type="button" @click="assetClass = 'cryptocurrency'; selectBroker('bitfinex');" :class="(assetClass === 'cryptocurrency' ? 'btn-primary' : 'btn-outline-primary')" class="btn w-50">Cryptocurrency</button>
        </div>
      </div>
      
      <!-- stock brokers -->
      <div v-if="assetClass === 'stock'" class="d-flex justify-content-center mt-3">
        <!-- alpaca -->
        <div @click="selectBroker('alpaca')" :class="{active: broker === 'alpaca'}" class="option-select card mr-3">
          <div class="card-body d-flex flex-column align-items-center justify-content-around bg-white">
            <img src="/img/brokers/alpaca-logo.png" alt="Alpaca" width="100" class="p-2">
          </div>
          <div class="card-footer text-center">
            <h6 class="mb-0">Alpaca</h6>
          </div>
        </div>
        
        <!-- tastytrade -->
        <div @click="selectBroker('tastytrade')" :class="{active: broker === 'tastytrade'}" class="option-select card">
          <div class="card-body d-flex flex-column align-items-center justify-content-around bg-white">
            <img src="/img/brokers/tastytrade-logo.svg" alt="TastyTrade" width="120" class="p-2">
          </div>
          <div class="card-footer text-center">
            <h6 class="mb-0">TastyTrade</h6>
          </div>
        </div>
      </div>
      
      <!-- cryptocurrency brokers -->
      <div v-else class="d-flex justify-content-center mt-3">
        <!-- bitfinex -->
        <div @click="selectBroker('bitfinex')" :class="{active: broker === 'bitfinex'}" class="option-select card mr-3">
          <div class="card-body d-flex flex-column align-items-center justify-content-around bg-white">
            <img src="/img/brokers/bitfinex-logo.png" alt="Bitfinex" width="120" class="p-2">
          </div>
          <div class="card-footer text-center">
            <h6 class="mb-0">Bitfinex</h6>
          </div>
        </div>
        
        <!-- binance -->
        <div @click="selectBroker('binance')" :class="{active: broker === 'binance'}" class="option-select card">
          <div class="card-body d-flex flex-column align-items-center justify-content-around bg-white">
            <img src="/img/brokers/binance-logo.png" alt="Binance" width="100" class="p-2">
          </div>
          <div class="card-footer text-center">
            <h6 class="mb-0">Binance</h6>
          </div>
        </div>
      </div>
      
      <!-- broker live/paper -->
      <div class="d-flex justify-content-between align-items-center mt-3">
        <div class="line-height-sm">
          <label>Trading Type</label>
          <span v-tooltip:top="'Choose whether to trade using real money or a paper account on your broker.'" tabindex="0" class="text-muted pointer ml-2"><i class="fas fa-info-circle"></i></span>
        </div>
      </div>
      <div class="mt-2">
        <validation-provider key="trading_type" :rules="{required: true, oneOf: (($store.getters.accountTier === 'premium') ? ['paper', 'live'] : ($store.getters.accountTier === 'pro' && assetClass === 'cryptocurrency') ? ['paper', 'live'] : ['paper'])}" :immediate="true" v-slot="{ errors }">
          <div class="btn-group btn-group-toggle w-50" data-toggle="buttons">
            <button type="button" @click="tradingType = 'paper'" :disabled="['tastytrade', 'binance'].includes(broker)" :class="((tradingType === 'paper') ? 'btn-' : 'btn-outline-')+((errors.length > 0) ? 'danger' : 'primary')" class="btn">
              Paper
            </button>
            <button type="button" @click="tradingType = 'live'" :class="((tradingType === 'live') ? 'btn-' : 'btn-outline-')+((errors.length > 0) ? 'danger' : 'primary')" class="btn">
              Live
            </button>
          </div>
          <input type="hidden" v-model="tradingType">
          <!-- Broker trading type -->
          <small v-if="assetClass === 'stock' && errors.length > 0" class="text-danger">
            <br>You must <a href="https://alphainsider.com/account-pricing">upgrade to premium</a> for live stock trading.
          </small>
          <small v-else-if="assetClass === 'cryptocurrency' && errors.length > 0" class="text-danger">
            <br>You must <a href="https://alphainsider.com/account-pricing">upgrade to pro or premium</a> for live crypto trading.
          </small>
        </validation-provider>
      </div>
      
      <!-- alpaca -->
      <div v-if="broker === 'alpaca'" class="mt-3">
        <!-- alpaca key -->
        <div class="row justify-content-center mb-3">
          <div class="col-12">
            <h6 class="m-0">Public Key</h6>
          </div>
          <div class="col-12">
            <validation-provider key="alpaca_public" name="Alpaca public key" rules="required" v-slot="{ errors }">
              <input-mask
              v-model="alpacaKey"
              :mask="/^\S+$/"
              type="text"
              :disabled="disabledForm"
              :class="{'is-invalid': errors.length}"
              class="form-control"
              />
              <div class="invalid-feedback">{{ errors[0] }}</div>
            </validation-provider>
          </div>
        </div>
        
        <!-- alpaca secret -->
        <div class="row justify-content-center mb-3">
          <div class="col-12">
            <h6 class="m-0">Private Key</h6>
          </div>
          <div class="col-12">
            <validation-provider key="alpaca_secret" name="Alpaca private key" rules="required" v-slot="{ errors }">
              <input-mask
              v-model="alpacaSecret"
              :mask="/^\S+$/"
              type="text"
              :disabled="disabledForm"
              :class="{'is-invalid': errors.length}"
              class="form-control"
              />
              <div class="invalid-feedback">{{ errors[0] }}</div>
            </validation-provider>
          </div>
        </div>
      </div>
      
      <!-- tastytrade -->
      <div v-else-if="broker === 'tastytrade'" class="mt-3">
        <!-- tastytrade username -->
        <div class="row mb-3">
          <div class="col-12">
            <h6 class="m-0">Email</h6>
          </div>
          <div class="col-12">
            <validation-provider key="tastytrade_email" name="TastyTrade email" rules="email|required" v-slot="{ errors }">
              <input-mask
              v-model="tastyTradeEmail"
              :mask="/^\S+$/"
              type="text"
              :disabled="disabledForm"
              :class="{'is-invalid': errors.length}"
              class="form-control"
              />
              <div class="invalid-feedback">{{ errors[0] }}</div>
            </validation-provider>
          </div>
        </div>
        
        <!-- tastytrade password -->
        <div class="row mb-3">
          <div class="col-12">
            <h6 class="m-0">Password</h6>
          </div>
          <div class="col-12">
            <validation-provider key="tastytrade_password" name="TastyTrade password" rules="required" v-slot="{ errors }">
              <input
              v-model="tastyTradePassword"
              type="password"
              :disabled="disabledForm"
              :class="{'is-invalid': errors.length}"
              class="form-control"
              />
              <div class="invalid-feedback">{{ errors[0] }}</div>
            </validation-provider>
          </div>
        </div>
        
        <!-- tastytrade account_id -->
        <label>Account ID</label>
        <div class="form-group mb-2">
          <validation-provider key="tastytrade_accountid" name="TastyTrade account ID" rules="required" v-slot="{ errors }">
            <input-mask
            v-model="tastyTradeAccountId"
            :mask="/^\S+$/"
            type="text"
            :disabled="disabledForm"
            :class="{'is-invalid': errors.length}"
            class="form-control"
            />
            <div class="invalid-feedback">{{ errors[0] }}</div>
          </validation-provider>
        </div>
      </div>
      
      <!-- bitfinex -->
      <div v-else-if="broker === 'bitfinex'" class="mt-3">
        <!-- bitfinex key -->
        <div class="row justify-content-center mb-3">
          <div class="col-12">
            <h6 class="m-0">Public Key</h6>
          </div>
          <div class="col-12">
            <validation-provider key="bitfinex_public" name="Bitfinex public key" rules="required" v-slot="{ errors }">
              <input-mask
              v-model="bitfinexKey"
              :mask="/^\S+$/"
              type="text"
              :disabled="disabledForm"
              :class="{'is-invalid': errors.length}"
              class="form-control"
              />
              <div class="invalid-feedback">{{ errors[0] }}</div>
            </validation-provider>
          </div>
        </div>
        
        <!-- bitfinex secret -->
        <div class="row justify-content-center mb-3">
          <div class="col-12">
            <h6 class="m-0">Secret Key</h6>
          </div>
          <div class="col-12">
            <validation-provider key="bitfinex_secret" name="Bitfinex secret key" rules="required" v-slot="{ errors }">
              <input-mask
              v-model="bitfinexSecret"
              :mask="/^\S+$/"
              type="text"
              :disabled="disabledForm"
              :class="{'is-invalid': errors.length}"
              class="form-control"
              />
              <div class="invalid-feedback">{{ errors[0] }}</div>
            </validation-provider>
          </div>
        </div>
      </div>
      
      <!-- binance -->
      <div v-else-if="broker === 'binance'" class="mt-3">
        <!-- binance key -->
        <div class="row justify-content-center mb-3">
          <div class="col-12">
            <h6 class="m-0">Public Key</h6>
          </div>
          <div class="col-12">
            <validation-provider key="binance_public" name="Binance public key" rules="required" v-slot="{ errors }">
              <input-mask
              v-model="binanceKey"
              :mask="/^\S+$/"
              type="text"
              :disabled="disabledForm"
              :class="{'is-invalid': errors.length}"
              class="form-control"
              />
              <div class="invalid-feedback">{{ errors[0] }}</div>
            </validation-provider>
          </div>
        </div>
        
        <!-- binance secret -->
        <div class="row justify-content-center mb-3">
          <div class="col-12">
            <h6 class="m-0">Secret Key</h6>
          </div>
          <div class="col-12">
            <validation-provider key="binance_secret" name="Binance secret key" rules="required" v-slot="{ errors }">
              <input-mask
              v-model="binanceSecret"
              :mask="/^\S+$/"
              type="text"
              :disabled="disabledForm"
              :class="{'is-invalid': errors.length}"
              class="form-control"
              />
              <div class="invalid-feedback">{{ errors[0] }}</div>
            </validation-provider>
          </div>
        </div>
      </div>
      
      <!-- save changes -->
      <div class="row mt-3 mt-md-0">
        <div class="col-12 d-flex justify-content-end">
          <button :disabled="disabledForm" type="submit" class="btn btn-primary">Save</button>
        </div>
      </div>
    </form>
  </validation-observer>
</div>
</template>

<script>
export default {
  data() {
    return {
      assetClass: 'stock',
      tradingType: 'paper',
      broker: 'alpaca',
      // alpaca
      alpacaKey: undefined,
      alpacaSecret: undefined,
      // tastytrade
      tastyTradeEmail: undefined,
      tastyTradePassword: undefined,
      tastyTradeAccountId: undefined,
      // binance
      binanceKey: undefined,
      binanceSecret: undefined,
      // bitfinex
      bitfinexKey: undefined,
      bitfinexSecret: undefined
    };
  },
  computed: {
    disabledForm() {
      //stock brokers: premium tier for live trading
      if(this.assetClass === 'stock' && this.$store.getters.accountTier !== 'premium' && this.tradingType === 'live') return true;
      //cyptocurrency brokers: pro/premium tier for live trading
      else if(this.assetClass === 'cryptocurrency' && !['pro', 'premium'].includes(this.$store.getters.accountTier) && this.tradingType === 'live') return true;
    }
  },
  async mounted() {
    await this.$store.dispatch('getBotInfo');
  },
  methods: {
    selectBroker(broker) {
      this.broker = broker;
      this.tradingType = (['tastytrade', 'binance'].includes(broker) ? 'live' : 'paper');
      this.$emit('broker', broker);
    },
    updateBroker() {
      //skip if no bot_id
      if(!this.$store.state.bot.bot_id) return Promise.resolve();
      
      let keys = {};
      
      //alpaca
      if(this.broker === 'alpaca') {
        keys = {
          alpaca_key: this.alpacaKey,
          alpaca_secret: this.alpacaSecret
        };
      }
      //tastytrade
      else if(this.broker === 'tastytrade') {
        keys = {
          tastytrade_email: this.tastyTradeEmail,
          tastytrade_password: this.tastyTradePassword,
          account_id: this.tastyTradeAccountId
        };
      }
      //bitfinex
      else if(this.broker === 'bitfinex') {
        keys = {
          bitfinex_key: this.bitfinexKey,
          bitfinex_secret: this.bitfinexSecret
        };
      }
      //binance
      else if(this.broker === 'binance') {
        keys = {
          binance_key: this.binanceKey,
          binance_secret: this.binanceSecret
        };
      }
      // error
      else {
        toastr.error('Broker not permitted');
        return;
      }
      
      return this.$store.dispatch('request', {
        type: 'post',
        auth: true,
        url: 'updateBroker',
        query: {
          bot_id: this.$store.state.bot.bot_id,
          broker: {
            type: this.broker,
            live: (this.tradingType === 'live'),
            ...keys
          }
        }
      })
      //success, emit update
      .then(() => {
        this.$emit('update');
      })
      // error, toast error
      .catch(() => {
        if(['alpaca', 'tastytrade'].includes(this.broker)) toastr.error('Failed to set API keys. Invalid keys.');
        else if(['binance', 'bitfinex'].includes(this.broker)) toastr.error('Failed to set API keys. Invalid keys or IP location not permitted.');
      });
    }
  }
}
</script>