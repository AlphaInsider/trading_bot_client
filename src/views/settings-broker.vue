<template>
<div>
  <!-- current api key -->
  <div class="card">
    <div class="card-body">
      <!-- key -->
      <div v-if="currentToken" class="row">
        <!-- info -->
        <div class="col d-flex">
          <!-- broker -->
          <div class="pr-4">
            <label>Current Broker</label>
            <h1 v-if="currentToken.broker === 'tastytrade'" class="m-0">TastyTrade</h1>
            <h1 v-else class="text-capitalize m-0">{{ currentToken.broker }}</h1>
          </div>
          <!-- type -->
          <div class="border-left pl-4">
            <label>Type</label>
            <h1 class="text-capitalize m-0">{{ currentToken.type }}</h1>
          </div>
        </div>
        <!-- logo -->
        <div class="col-auto align-self-center">
          <img v-if="currentToken.broker === 'alpaca'" src="/img/brokers/alpaca-logo.png" alt="Alpaca" width="54">
          <img v-else-if="currentToken.broker === 'tastytrade'" src="/img/brokers/tastytrade-logo.svg" alt="TastyTrade" width="150">
        </div>
      </div>
      
      <!-- no key -->
      <div v-else class="text-center p-2">
        <h5 class="text-muted mb-0">No AlphaInsider API Key Found</h5>
      </div>
    </div>
  </div>
  
  <!-- alpaca api -->
  <div class="card mt-3">
    <!-- title -->
    <div class="card-header d-flex align-items-center bg-white">
      <h5 class="text-primary mb-0">Update API Keys</h5>
      <div class="d-flex ml-auto">
        <a href="/" class="btn btn-sm btn-primary">Help</a>
      </div>
    </div>
    <!-- body -->
    <div class="card-body">
      <!-- broker select -->
      <div class="row mb-3">
        <div class="col-12 col-md-4 d-flex justify-content-end">
          <h6 class="m-0">Select Broker</h6>
        </div>
        <div class="col-12 col-md-6 d-flex">
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
      <div v-if="broker === 'alpaca'">
        <validation-observer v-slot="event">
          <form @submit.prevent="event.handleSubmit(() => updateKeys(event))">
            <!-- alpaca key -->
            <div class="row mb-3">
              <div class="col-12 col-md-4 text-md-right pt-2">
                <h6 class="m-0">Public Key</h6>
              </div>
              <div class="col-12 col-md-6">
                <validation-provider name="Alpaca public key" rules="required" v-slot="{ errors }">
                  <input v-model="alpacaKey" type="text" :class="{'is-invalid': errors.length}" class="form-control">
                  <div class="invalid-feedback">
                    {{ errors[0] }}
                  </div>
                </validation-provider>
              </div>
            </div>

            <!-- alpaca secret -->
            <div class="row mb-3">
              <div class="col-12 col-md-4 text-md-right pt-2">
                <h6 class="m-0">Private Key</h6>
              </div>
              <div class="col-12 col-md-6">
                <validation-provider name="Alpaca private key" rules="required" v-slot="{ errors }">
                  <input v-model="alpacaSecret" type="text" :class="{'is-invalid': errors.length}" class="form-control">
                  <div class="invalid-feedback">
                    {{ errors[0] }}
                  </div>
                </validation-provider>
              </div>
            </div>

            <!-- save changes -->
            <div class="row mt-3 mt-md-0">
              <div class="col-12 col-md-6 offset-md-4">
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </form>
        </validation-observer>
      </div>
      
      <!-- tastytrade -->
      <div v-if="broker === 'tastytrade'">
        <validation-observer v-slot="event">
          <form @submit.prevent="event.handleSubmit(() => updateKeys(event))">
            <!-- tastytrade username -->
            <div class="row mb-3">
              <div class="col-12 col-md-4 text-md-right pt-2">
                <h6 class="m-0">Username</h6>
              </div>
              <div class="col-12 col-md-6">
                <validation-provider name="user" rules="required" v-slot="{ errors }">
                  <input-mask v-model="tastyTradeUsername" :mask="/^\S+$/" type="text" :class="{'is-invalid': errors.length}" class="form-control"/>
                  <div class="invalid-feedback">{{ errors[0] }}</div>
                </validation-provider>
              </div>
            </div>

            <!-- tastytrade password -->
            <div class="row mb-3">
              <div class="col-12 col-md-4 text-md-right pt-2">
                <h6 class="m-0">Password</h6>
              </div>
              <div class="col-12 col-md-6">
                <validation-provider name="TastyTrade Password" rules="required" v-slot="{ errors }">
                  <input v-model="tastyTradePassword" type="password" :class="{'is-invalid': errors.length}" class="form-control" placeholder="Password">
                  <div class="invalid-feedback">{{ errors[0] }}</div>
                </validation-provider>
              </div>
            </div>

            <!-- save changes -->
            <div class="row mt-3 mt-md-0">
              <div class="col-12 col-md-6 offset-md-4">
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </form>
        </validation-observer>
      </div>
    </div>
  </div>
</div>
</template>


<script>
export default {
  data() {
    return {
      broker: 'alpaca',
      currentToken: {
        broker: 'alpaca',
        type: 'live'
      },
      alpacaKey: undefined,
      alpacaSecret: undefined,
      tastyTradeUsername: undefined,
      tastyTradePassword: undefined
    };
  },
  mounted() {},
  methods: {
    updateKeys() {}
  }
}
</script>

<style lang="scss" scoped>
</style>