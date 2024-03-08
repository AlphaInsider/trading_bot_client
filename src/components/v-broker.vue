<template>
<div>
  <!-- broker select -->
  <div class="row">
    <div class="col-12 d-flex justify-content-center">
      <!-- toggle stock/crypto -->
      <div class="col-12 btn-group btn-group-justified bg-light rounded" role="group">
        <div class="btn-group w-100">
          <button @click="type = 'stock'; broker = 'alpaca'" type="button" :class="{'bg-light text-primary': type !== 'stock'}" class="btn btn-primary">
            <h5 class="m-0">Stocks</h5>
          </button>
        </div>
        <div class="btn-group w-100">
          <button @click="type = 'crypto'; broker = 'binance'" type="button" :class="{'bg-light text-primary': type !== 'crypto'}" class="btn btn-primary">
            <h5 class="m-0">Crypto</h5>
          </button>
        </div>
      </div>
    </div>
    
    <!-- stock brokers -->
    <div v-if="type === 'stock'" class="col-12 d-flex justify-content-center mt-3">
      <!-- alpaca -->
      <div @click="broker = 'alpaca'" :class="{active: broker === 'alpaca'}" class="option-select card mr-3">
        <div class="card-body d-flex flex-column align-items-center justify-content-around bg-white">
          <img src="/img/brokers/alpaca-logo.png" alt="Alpaca" width="100" class="p-2">
        </div>
        <div class="card-footer text-center">
          <h6 class="mb-0">Alpaca</h6>
        </div>
      </div>

      <!-- tastytrade -->
      <div @click="broker = 'tastytrade'" :class="{active: broker === 'tastytrade', 'disabled': $store.getters.accountTier !== 'premium'}" class="option-select card mr-3">
        <div class="card-body d-flex flex-column align-items-center justify-content-around bg-white">
          <img src="/img/brokers/tastytrade-logo.svg" alt="TastyTrade" width="120" class="p-2">
        </div>
        <div class="card-footer text-center">
          <h6 class="mb-0">TastyTrade</h6>
        </div>
      </div>
    </div>
    
    <!-- crypto brokers -->
    <div v-else class="col-12 d-flex justify-content-center mt-3">
      <!-- binance -->
      <div @click="broker = 'binance'" :class="{active: broker === 'binance', 'disabled': $store.getters.accountTier !== 'premium'}" class="option-select card">
        <div class="card-body d-flex flex-column align-items-center justify-content-around bg-white">
          <img src="/img/brokers/binance-logo.png" alt="Binance" width="100" class="p-2">
        </div>
        <div class="card-footer text-center">
          <h6 class="mb-0">Binance</h6>
        </div>
      </div>
    </div>
  </div>
  
  <!-- alpaca -->
  <div v-if="broker === 'alpaca'" class="mt-3">
    <validation-observer key="alpaca" v-slot="event">
      <form @submit.prevent="event.handleSubmit(() => updateBroker(event))">
        <!-- alpaca key -->
        <div class="row justify-content-center mb-3">
          <div class="col-12 pt-2">
            <h6 class="m-0">Public Key</h6>
          </div>
          <div class="col-12">
            <validation-provider name="Alpaca public key" rules="required" v-slot="{ errors }">
              <input-mask
              v-model="alpacaKey"
              :mask="/^\S+$/"
              type="text"
              :class="{'is-invalid': errors.length}"
              class="form-control"
              />
              <div class="invalid-feedback">{{ errors[0] }}</div>
            </validation-provider>
          </div>
        </div>
        
        <!-- alpaca secret -->
        <div class="row justify-content-center mb-3">
          <div class="col-12 pt-2">
            <h6 class="m-0">Private Key</h6>
          </div>
          <div class="col-12">
            <validation-provider name="Alpaca private key" rules="required" v-slot="{ errors }">
              <input-mask
              v-model="alpacaSecret"
              :mask="/^\S+$/"
              type="text"
              :class="{'is-invalid': errors.length}"
              class="form-control"
              />
              <div class="invalid-feedback">{{ errors[0] }}</div>
            </validation-provider>
          </div>
        </div>
        
        <!-- save changes -->
        <div class="row mt-3 mt-md-0">
          <div class="col-12 d-flex justify-content-end">
            <router-link to="/broker-tutorial" class="btn btn-light border mr-2">Tutorial</router-link>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </div>
      </form>
    </validation-observer>
  </div>
  
  <!-- tastytrade -->
  <div v-else-if="broker === 'tastytrade'" class="mt-3">
    <validation-observer key="tastytrade" v-slot="event">
      <form @submit.prevent="event.handleSubmit(() => updateBroker(event))">
        <!-- tastytrade username -->
        <div class="row mb-3">
          <div class="col-12 pt-2">
            <h6 class="m-0">Email</h6>
          </div>
          <div class="col-12">
            <validation-provider name="email" rules="email|required" v-slot="{ errors }">
              <input-mask
              v-model="tastyTradeEmail"
              :mask="/^\S+$/"
              type="text"
              :class="{'is-invalid': errors.length}"
              class="form-control"
              />
              <div class="invalid-feedback">{{ errors[0] }}</div>
            </validation-provider>
          </div>
        </div>
        
        <!-- tastytrade password -->
        <div class="row mb-3">
          <div class="col-12 pt-2">
            <h6 class="m-0">Password</h6>
          </div>
          <div class="col-12">
            <validation-provider name="TastyTrade Password" rules="required" v-slot="{ errors }">
              <input
              v-model="tastyTradePassword"
              type="password"
              :class="{'is-invalid': errors.length}"
              class="form-control"
              placeholder="Password"
              />
              <div class="invalid-feedback">{{ errors[0] }}</div>
            </validation-provider>
          </div>
        </div>
        
        <!-- tastytrade account_id -->
        <label>Account ID</label>
        <div class="form-group mb-2">
          <validation-provider name="account_id" rules="required" v-slot="{ errors }">
            <input-mask
            v-model="tastyTradeAccountId"
            :mask="/^\S+$/"
            type="text"
            :class="{'is-invalid': errors.length}"
            class="form-control"
            />
            <div class="invalid-feedback">{{ errors[0] }}</div>
          </validation-provider>
        </div>
        
        <!-- save changes -->
        <div class="row mt-3 mt-md-0">
          <div class="col-12 d-flex justify-content-end">
            <router-link to="/broker-tutorial" class="btn btn-light border mr-2">Tutorial</router-link>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </div>
      </form>
    </validation-observer>
  </div>
  
  <!-- binance -->
  <div v-else-if="broker === 'binance'" class="mt-3">
    <validation-observer key="binance" v-slot="event">
      <form @submit.prevent="event.handleSubmit(() => updateBroker(event))">
        <!-- binance key -->
        <div class="row justify-content-center mb-3">
          <div class="col-12 pt-2">
            <h6 class="m-0">Public Key</h6>
          </div>
          <div class="col-12">
            <validation-provider name="Binance public key" rules="required" v-slot="{ errors }">
              <input-mask
              v-model="binanceKey"
              :mask="/^\S+$/"
              type="text"
              :class="{'is-invalid': errors.length}"
              class="form-control"
              />
              <div class="invalid-feedback">{{ errors[0] }}</div>
            </validation-provider>
          </div>
        </div>

        <!-- binance secret -->
        <div class="row justify-content-center mb-3">
          <div class="col-12 pt-2">
            <h6 class="m-0">Secret Key</h6>
          </div>
          <div class="col-12">
            <validation-provider name="Binance secret key" rules="required" v-slot="{ errors }">
              <input-mask
              v-model="binanceSecret"
              :mask="/^\S+$/"
              type="text"
              :class="{'is-invalid': errors.length}"
              class="form-control"
              />
              <div class="invalid-feedback">{{ errors[0] }}</div>
            </validation-provider>
          </div>
        </div>

        <!-- save changes -->
        <div class="row mt-3 mt-md-0">
          <div class="col-12 d-flex justify-content-end">
            <router-link to="/broker-tutorial" class="btn btn-light border mr-2">Tutorial</router-link>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </div>
      </form>
    </validation-observer>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      type: 'stock',
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
      binanceSecret: undefined
    };
  },
  methods: {
    updateBroker() {
      // update Alpaca
      if(this.broker === 'alpaca') {
        //error if token is live account and user is not premium account
        if(!_.startsWith(this.alpacaKey, 'P') && this.$store.getters.accountTier !== 'premium') {
          toastr.error('You must have an AlphaInsider premium account to live trade on Alpaca.');
          return;
        }
        return this.$store.dispatch('request', {
          type: 'post',
          auth: true,
          url: 'updateBrokerAlpaca',
          query: {
            alpaca_key: this.alpacaKey,
            alpaca_secret: this.alpacaSecret
          }
        })
        //success, emit update
        .then(() => {
          this.$emit('update');
        })
        // error, toast error
        .catch(() => {
          toastr.error('Failed to set Alpaca API key.');
        });
      }
      
      // update TastyTrade
      else if(this.broker === 'tastytrade') {
        //error if user is not premium account
        if(this.$store.getters.accountTier !== 'premium') {
          toastr.error('You must have an AlphaInsider premium account to live trade on TastyTrade.');
          return;
        }
        return this.$store.dispatch('request', {
          type: 'post',
          auth: true,
          url: 'updateBrokerTastytrade',
          query: {
            tastytrade_email: this.tastyTradeEmail,
            tastytrade_password: this.tastyTradePassword,
            account_id: this.tastyTradeAccountId
          }
        })
        //success, emit update
        .then(() => {
          this.$emit('update');
        })
        // error, toast error
        .catch(() => {
          toastr.error('Failed to set TastyTrade API key.');
        });
      }

      // update Binance
      else if(this.broker === 'binance') {
        //error if user is not pro or premium account
        if(!['pro', 'premium'].includes(this.$store.getters.accountTier)) {
          toastr.error('You must have an AlphaInsider pro or premium account to live trade on Binance.');
          return;
        }
        return this.$store.dispatch('request', {
          type: 'post',
          auth: true,
          url: 'updateBrokerBinance',
          query: {
            binance_key: this.binanceKey,
            binance_secret: this.binanceSecret
          }
        })
        //success, emit update
        .then(() => {
          this.$emit('update');
        })
        // error, toast error
        .catch((error) => {
          toastr.error('Failed to set Binance API key. Incorrect jurisdiction or key.');
        });
      }
      else {
        toastr.error('Failed to set key.');
      }
    }
  }
}
</script>