<template>
<div>
  <!-- broker select -->
  <div class="row">
    <div class="col-12 d-flex justify-content-center">
      <!-- alpaca -->
      <div @click="broker = 'alpaca'" :class="{active: broker === 'alpaca'}" class="option-select card mr-3">
        <div class="card-body d-flex flex-column align-items-center justify-content-around bg-white">
          <img src="/img/brokers/alpaca-logo.png" alt="Alpaca" width="54">
        </div>
        <div class="card-footer text-center">
          <h6 class="mb-0">Alpaca</h6>
        </div>
      </div>
      <!-- tastytrade -->
      <div @click="broker = 'tastytrade'" :class="{active: broker === 'tastytrade'}" class="option-select card">
        <div class="card-body d-flex flex-column align-items-center justify-content-around bg-white">
          <img src="/img/brokers/tastytrade-logo.svg" alt="TastyTrade" width="100">
        </div>
        <div class="card-footer text-center">
          <h6 class="mb-0">TastyTrade</h6>
        </div>
      </div>
    </div>
  </div>

  <!-- alpaca -->
  <div v-if="broker === 'alpaca'" class="mt-3">
    <validation-observer v-slot="event">
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
            <router-link to="/broker-tutorial" class="btn btn-light border mr-2">Help</router-link>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </div>
      </form>
    </validation-observer>
  </div>

  <!-- tastytrade -->
  <div v-else-if="broker === 'tastytrade'" class="mt-3">
    <validation-observer v-slot="event">
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
            <router-link to="/broker-tutorial" class="btn btn-light border mr-2">Help</router-link>
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
      broker: 'alpaca',
      // alpaca
      alpacaKey: undefined,
      alpacaSecret: undefined,
      // tastytrade
      tastyTradeEmail: undefined,
      tastyTradePassword: undefined,
      tastyTradeAccountId: undefined
    };
  },
  methods: {
    updateBroker() {
      // update Alpaca
      if(this.broker === 'alpaca') {
        // request updateBrokerAlpaca
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
          toastr.error('Failed to update Alpaca API key.');
        });
      }
      // update TastyTrade
      else {
        // request updateBrokerTastytrade
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
          toastr.error('Failed to update TastyTrade API key.');
        });
      }
    }
  }
}
</script>