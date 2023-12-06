<template>
  <div class="container d-flex align-items-center justify-content-center min-vh-100 my-3 my-lg-4">
    <div class="row no-gutters justify-content-center w-100">
      <div class="col-11 col-md-6">
        <!-- connect broker -->
        <div v-if="currentStep === 0" class="card shadow-sm">
          <div class="card-header bg-white text-center p-4">
            <h4 class="mb-0">Connect Brokerage</h4>
          </div>
          <div class="card-body">
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
                <form @submit.prevent="event.handleSubmit(() => updateBrokerKeys(event))">
                  <!-- alpaca key -->
                  <div class="row justify-content-center mb-3">
                    <div class="col-12 pt-2">
                      <h6 class="m-0">Public Key</h6>
                    </div>
                    <div class="col-12">
                      <validation-provider name="Alpaca public key" rules="required" v-slot="{ errors }">
                        <input v-model="alpacaKey" type="text" :class="{'is-invalid': errors.length}" class="form-control">
                        <div class="invalid-feedback">
                          {{ errors[0] }}
                        </div>
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
                        <input v-model="alpacaSecret" type="text" :class="{'is-invalid': errors.length}" class="form-control">
                        <div class="invalid-feedback">
                          {{ errors[0] }}
                        </div>
                      </validation-provider>
                    </div>
                  </div>

                  <!-- save changes -->
                  <div class="row mt-3 mt-md-0">
                    <div class="col-12 d-flex justify-content-end">
                      <button type="submit" class="btn btn-primary">Next</button>
                    </div>
                  </div>
                </form>
              </validation-observer>
            </div>

            <!-- tastytrade -->
            <div v-if="broker === 'tastytrade'" class="mt-3">
              <validation-observer v-slot="event">
                <form @submit.prevent="event.handleSubmit(() => updateBrokerKeys(event))">
                  <!-- tastytrade username -->
                  <div class="row mb-3">
                    <div class="col-12 pt-2">
                      <h6 class="m-0">Username</h6>
                    </div>
                    <div class="col-12">
                      <validation-provider name="user" rules="required" v-slot="{ errors }">
                        <input-mask v-model="tastyTradeUsername" :mask="/^\S+$/" type="text" :class="{'is-invalid': errors.length}" class="form-control"/>
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
                        <input v-model="tastyTradePassword" type="password" :class="{'is-invalid': errors.length}" class="form-control" placeholder="Password">
                        <div class="invalid-feedback">{{ errors[0] }}</div>
                      </validation-provider>
                    </div>
                  </div>

                  <!-- save changes -->
                  <div class="row mt-3 mt-md-0">
                    <div class="col-12 d-flex justify-content-end">
                      <button type="submit" class="btn btn-primary">Next</button>
                    </div>
                  </div>
                </form>
              </validation-observer>
            </div>
          </div>
        </div>

        <!-- connect alphainsider -->
        <div v-else-if="currentStep === 1" class="card shadow-sm">
          <div class="card-header bg-white text-center p-4">
            <div class="back-btn">
              <button @click="back()" class="btn bg-white border px-3 py-1"><i class="fas fa-arrow-left"></i></button>
            </div>
            <h4 class="mb-0">Connect AlphaInsider</h4>
          </div>
          <div class="card-body">
            <validation-observer v-slot="event">
              <form @submit.prevent="event.handleSubmit(() => updateAlphaInsiderKeys(event))">
                <!-- new api key -->
                <div class="row">
                  <div class="col-12 pt-2">
                    <h6 class="m-0">AlphaInsider API Key</h6>
                  </div>
                  <div class="col-12">
                    <validation-provider name="AlphaInsider API Key" rules="required" v-slot="{ errors }">
                      <input v-model="alphainsiderKey" type="text" :class="{'is-invalid': errors.length}" class="form-control">
                      <div class="invalid-feedback">
                        {{ errors[0] }}
                      </div>
                    </validation-provider>
                  </div>
                </div>

                <!-- save changes -->
                <div class="row mt-3">
                  <div class="col-12 d-flex justify-content-end">
                    <button type="submit" class="btn btn-primary">Next</button>
                  </div>
                </div>
              </form>
            </validation-observer>
          </div>
        </div>

        <!-- select strategy -->
        <div v-else-if="currentStep === 2" class="card shadow-sm">
          <div class="card-header bg-white text-center p-4">
            <div class="back-btn">
              <button @click="back()" class="btn bg-white border px-3 py-1"><i class="fas fa-arrow-left"></i></button>
            </div>
            <h4 class="mb-0">Select Strategy</h4>
          </div>
          <div class="card-body">
            <!-- search strategy -->
            <v-strategy-search :strategy-type="'stock'" @input="selectedStrategy = $event"></v-strategy-search>

            <!-- strategy view -->
            <div v-if="selectedStrategy" class="card mt-3">
              <div class="card-body">
                <v-strategy :strategy="selectedStrategy"></v-strategy>
              </div>
            </div>

            <!-- save changes -->
            <div class="row mt-3">
              <div class="col-12 d-flex justify-content-end">
                <button @click="updateStrategy()" type="button" class="btn btn-primary">Next</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- set allocation -->
        <div v-else-if="currentStep === 3" class="card shadow-sm">
          <div class="card-header bg-white text-center p-4">
            <div class="back-btn">
              <button @click="back()" class="btn bg-white border px-3 py-1"><i class="fas fa-arrow-left"></i></button>
            </div>
            <h4 class="mb-0">Set Allocation</h4>
          </div>
          <div class="card-body">
            <validation-observer v-slot="event">
              <form @submit.prevent="event.handleSubmit(() => updateBufferAmount(event))">
                <!-- allocation -->
                <div class="row mb-3">
                  <div class="col-12 pt-2">
                    <h6 class="m-0">Allocation To Trading Bot</h6>
                  </div>
                  <div class="col-12">
                    <validation-provider name="Allocation Amount" rules="min_value:25000|required" v-slot="{ errors }">
                      <input v-model="allocation" type="number" step="1" :class="{'is-invalid': errors.length}" class="form-control">
                      <div class="invalid-feedback">
                        {{ errors[0] }}
                      </div>
                    </validation-provider>
                  </div>
                </div>

                <!-- save changes -->
                <div class="row mt-3">
                  <div class="col-12 d-flex justify-content-end">
                    <button type="submit" class="btn btn-primary">Next</button>
                  </div>
                </div>
              </form>
            </validation-observer>
          </div>
        </div>

        <!-- finish -->
        <div v-else-if="currentStep === 4" class="card card-finished shadow-sm">
          <div class="card-body d-flex align-items-center justify-content-center">
            <div class="back-btn">
              <button @click="back()" class="btn bg-white border px-3 py-1"><i class="fas fa-arrow-left"></i></button>
            </div>
            <div class="row justify-content-center w-100">
              <div class="col-12 col-lg-8 text-center">
                <h1>You're all set!</h1>
                <button class="btn btn-primary btn-block">Finish</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vDropdownMenu from '@/components/v-dropdown-menu.vue';
import vStrategySearch from '@/components/v-strategy-search.vue';
import vStrategy from '@/components/v-strategy.vue';

export default {
  components: {vStrategy, vStrategySearch, vDropdownMenu},
  data() {
    return {
      // step
      currentStep: 0,
      // broker
      broker: 'alpaca',
      alpacaKey: undefined,
      alpacaSecret: undefined,
      tastyTradeUsername: undefined,
      tastyTradePassword: undefined,
      // alphainsider
      alphainsiderKey: undefined,
      // strategy
      selectedStrategy: undefined,
      // allocation 
      allocation: 0
    };
  },
  mounted() {},
  methods: {
    back() {
      this.currentStep = (this.currentStep > 0 ? this.currentStep-1 : this.currentStep);
    },
    next() {
      this.currentStep = this.currentStep+1;
    },
    updateBrokerKeys() {
      this.next();
    },
    updateAlphaInsiderKeys() {
      this.next();
    },
    updateStrategy() {
      this.next();
    },
    updateBufferAmount() {
      this.next();
    }
  }
}
</script>

<style lang="scss" scoped>
.back-btn {
  position: absolute;
  top: 8px;
  left: -20px;
  button {
    font-size: 1.5rem;
  }
}
.card-finished {
  height: 275px;
}
//transition
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>