<template>
<div>
  <!-- alphainsider api key -->
  <div class="card">
    <!-- title -->
    <div class="card-header d-flex align-items-center bg-white">
      <h5 class="text-primary mb-0">AlphaInsider API</h5>
      <div class="d-flex ml-auto">
        <router-link :to="{name: 'setup', query: {step: '0'}}" class="btn btn-light btn-sm border ml-auto"><i class="fas fa-pencil-alt"></i> Edit</router-link>
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
        <router-link :to="{name: 'setup', query: {step: '1'}}" class="btn btn-light btn-sm border ml-auto"><i class="fas fa-pencil-alt"></i> Edit</router-link>
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
          <img v-if="$store.state.bot.broker.type === 'alpaca'" src="/img/brokers/alpaca-logo.png" alt="Alpaca" width="60">
          <img v-else-if="$store.state.bot.broker.type === 'tastytrade'" src="/img/brokers/tastytrade-logo.svg" alt="TastyTrade" width="150">
          <img v-else-if="$store.state.bot.broker.type === 'bitfinex'" src="/img/brokers/bitfinex-logo.png" alt="Bitfinex" width="150">
          <img v-else-if="$store.state.bot.broker.type === 'binance'" src="/img/brokers/binance-logo.png" alt="Binance" width="60">
        </div>
      </div>
      
      <!-- no key -->
      <div v-else class="d-flex-column bg-light rounded text-center py-4 mt-1">
        <h5 class="my-2">No Broker API Key</h5>
      </div>
    </div>
  </div>
</div>
</template>


<script>
import vSetupAlphainsider from '@/components/v-setup-alphainsider.vue';
import vSetupBroker from '@/components/v-setup-broker.vue';
import vDate from '@/components/v-date.vue';
import vModal from '@/components/v-modal.vue';

export default {
  components: {vSetupAlphainsider, vSetupBroker, vDate, vModal},
  mounted() {
    this.$store.dispatch('getBotInfo');
  }
}
</script>