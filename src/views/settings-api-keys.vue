<template>
  <div>
    <!-- alphainsider api key -->
    <div class="card">
      <!-- title -->
      <div class="card-header d-flex align-items-center bg-white">
        <h5 class="text-primary mb-0">AlphaInsider API</h5>
        <div class="d-flex ml-auto">
          <button @click="showAlphaInsiderModal=true" type="button" class="btn btn-light btn-sm border ml-auto"><i class="fas fa-pencil-alt"></i> Edit</button>
        </div>
      </div>
      <!-- body -->
      <div class="card-body">
        <!-- current api key -->
        <div v-if="$store.state.bot.alphainsider" class="d-flex">
          <!-- account tier -->
          <div class="border-right pr-3">
            <label>Account Tier</label>
            <h2 class="text-capitalize m-0">{{ $store.state.bot.alphainsider.account_type }}</h2>
          </div>
          <!-- key name -->
          <div class="pl-3">
            <label>Key Name</label>
            <h2 class="text-capitalize text-truncate m-0">{{ $store.state.bot.alphainsider.name }}</h2>
          </div>
          <!-- logo -->
          <div class="ml-auto align-self-center">
            <img src="/img/logo.png" alt="AlphaInsider" width="50">
          </div>
        </div>

        <!-- no key -->
        <div v-else class="d-flex-column bg-light rounded text-center py-4 mt-1">
          <h5 class="my-2">No AlphaInsider API Key</h5>
        </div>
      </div>
    </div>

    <!-- broker api key -->
    <div class="card mt-3">
      <!-- title -->
      <div class="card-header d-flex align-items-center bg-white">
        <h5 class="text-primary mb-0">Broker API</h5>
        <div class="d-flex ml-auto">
          <button @click="showBrokerModal=true" type="button" class="btn btn-light btn-sm border ml-auto"><i class="fas fa-pencil-alt"></i> Edit</button>
        </div>
      </div>
      <!-- Body -->
      <div class="card-body">
        <!-- info -->
        <div v-if="$store.state.bot.broker" class="d-flex">
          <!-- broker -->
          <div class="pr-3">
            <label>Current Broker</label>
            <h2 v-if="$store.state.bot.broker.type === 'tastytrade'" class="m-0">TastyTrade</h2>
            <h2 v-else class="text-capitalize m-0">{{ $store.state.bot.broker.type }}</h2>
          </div>
          <!-- type -->
          <div class="border-left px-3">
            <label>Type</label>
            <h2 class="text-capitalize m-0">{{ ($store.state.bot.broker.live ? 'Live' : 'Paper') }}</h2>
          </div>
          <!-- logo -->
          <div class="ml-auto align-self-center">
            <img v-if="$store.state.bot.broker.type === 'alpaca'" src="/img/brokers/alpaca-logo.png" alt="Alpaca" width="54">
            <img v-else-if="$store.state.bot.broker.type === 'tastytrade'" src="/img/brokers/tastytrade-logo.svg" alt="TastyTrade" width="150">
          </div>
        </div>

        <!-- no key -->
        <div v-else class="d-flex-column bg-light rounded text-center py-4 mt-1">
          <h5 class="my-2">No Broker API Key</h5>
        </div>
      </div>
    </div>
    
    <!-- modals -->
    <v-modal v-if="showAlphaInsiderModal" @close="showAlphaInsiderModal = false">
      <div class="card">
        <!-- title -->
        <div class="card-header bg-white d-flex align-items-center p-3">
          <h5 class="text-primary mb-0">Connect AlphaInsider</h5>
          <h5 @click="showAlphaInsiderModal = false" class="mb-0 ml-auto"><i class="far fa-times text-muted pointer"></i></h5>
        </div>
        <!-- body -->
        <div class="card-body p-3">
          <v-alphainsider @update="$router.go()"></v-alphainsider>
        </div>
      </div>
    </v-modal>
    <v-modal v-if="showBrokerModal" @close="showBrokerModal = false">
      <div class="card">
        <!-- title -->
        <div class="card-header bg-white d-flex align-items-center p-3">
          <h5 class="text-primary mb-0">Connect Brokerage</h5>
          <h5 @click="showBrokerModal = false" class="mb-0 ml-auto"><i class="far fa-times text-muted pointer"></i></h5>
        </div>
        <!-- body -->
        <div class="card-body p-3">
          <v-broker @update="$router.go()"></v-broker>
        </div>
      </div>
    </v-modal>
  </div>
</template>


<script>
import vAlphainsider from '@/components/v-alphainsider.vue';
import vBroker from '@/components/v-broker.vue';
import vDate from '@/components/v-date.vue';
import vModal from '@/components/v-modal.vue';

export default {
  components: {vAlphainsider, vBroker, vDate, vModal},
  data() {
    return {
      // modals
      showAlphaInsiderModal: false,
      showBrokerModal: false
    };
  },
  mounted() {
    this.$store.dispatch('getBotInfo');
  },
  methods: {}
}
</script>