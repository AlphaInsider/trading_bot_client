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
        <div v-if="alphainsiderToken" class="row">
          <!-- name -->
          <div class="col">
            <label>Current API Key</label>
            <h1 class="text-capitalize m-0">{{ alphainsiderToken.name }}</h1>
          </div>
          <!-- logo -->
          <div class="col-auto align-self-center">
            <img src="/img/logo.png" alt="AlphaInsider" width="50">
          </div>
        </div>

        <!-- no key -->
        <div v-else class="text-center p-2">
          <h5 class="text-muted mb-0">No AlphaInsider API Key Found</h5>
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
        <!-- key -->
        <div v-if="brokerToken" class="row">
          <!-- info -->
          <div class="col d-flex">
            <!-- broker -->
            <div class="pr-4">
              <label>Current Broker</label>
              <h1 v-if="brokerToken.broker === 'tastytrade'" class="m-0">TastyTrade</h1>
              <h1 v-else class="text-capitalize m-0">{{ brokerToken.broker }}</h1>
            </div>
            <!-- type -->
            <div class="border-left pl-4">
              <label>Type</label>
              <h1 class="text-capitalize m-0">{{ brokerToken.type }}</h1>
            </div>
          </div>
          <!-- logo -->
          <div class="col-auto align-self-center">
            <img v-if="brokerToken.broker === 'alpaca'" src="/img/brokers/alpaca-logo.png" alt="Alpaca" width="54">
            <img v-else-if="brokerToken.broker === 'tastytrade'" src="/img/brokers/tastytrade-logo.svg" alt="TastyTrade" width="150">
          </div>
        </div>

        <!-- no key -->
        <div v-else class="text-center p-2">
          <h5 class="text-muted mb-0">No Broker API Key Found</h5>
        </div>
      </div>
    </div>
    
    <!-- modals -->
    <v-modal v-if="showAlphaInsiderModal" @close="showAlphaInsiderModal=false">
      <v-alphainsider @update="showAlphaInsiderModal=false"></v-alphainsider>
    </v-modal>
    <v-modal v-if="showBrokerModal" @close="showBrokerModal=false">
      <v-broker @update="showBrokerModal=false"></v-broker>
    </v-modal>
  </div>
</template>


<script>
import vAlphainsider from "@/components/v-alphainsider.vue";
import vBroker from '@/components/v-broker.vue';
import vModal from '@/components/v-modal.vue';

export default {
  components: {vAlphainsider, vBroker, vModal},
  data() {
    return {
      alphainsiderToken: {
        token_id: '123',
        name: 'Test Token',
        type: 'api',
        expires: moment().add(2, 'years').toISOString(),
        created_at: moment().subtract(1, 'month').toISOString(),
        scope: ['test_permission']
      },
      brokerToken: {
        broker: 'alpaca',
        type: 'live'
      },
      // modals
      showAlphaInsiderModal: false,
      showBrokerModal: false
    };
  },
  mounted() {},
  methods: {}
}
</script>