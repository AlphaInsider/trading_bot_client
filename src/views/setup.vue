<template>
<div class="container d-flex align-items-center justify-content-center min-vh-100">
  <div class="row no-gutters justify-content-center w-100">
    <div class="col-11 col-md-8 col-lg-6 col-xl-5">
      <!-- bot empty -->
      <div v-if="$_.isEmpty($store.state.bot)" class="d-flex flex-column align-items-center">
        <h4>Loading...</h4>
      </div>
      
      <!-- connect alphainsider -->
      <div v-else-if="!$store.state.bot.alphainsider" class="card shadow-sm">
        <div class="card">
          <!-- title -->
          <div class="card-header bg-white d-flex align-items-center p-3">
            <h5 class="text-primary mb-0">Connect AlphaInsider</h5>
          </div>
          <!-- body -->
          <div class="card-body p-3">
            <v-alphainsider @update="loadBot()"></v-alphainsider>
          </div>
        </div>
      </div>
      
      <!-- connect broker -->
      <div v-else-if="!$store.state.bot.broker" class="card shadow-sm">
        <div class="card">
          <!-- title -->
          <div class="card-header bg-white d-flex align-items-center p-3">
            <h5 class="text-primary mb-0">Connect Brokerage</h5>
          </div>
          <!-- body -->
          <div class="card-body p-3">
            <v-broker @update="loadBot()"></v-broker>
          </div>
        </div>
      </div>
      
      <!-- select strategy -->
      <div v-else-if="$store.state.allocation.length <= 0" class="card shadow-sm">
        <div class="card">
          <!-- title -->
          <div class="card-header bg-white d-flex align-items-center p-3">
            <h5 class="text-primary mb-0">Strategy Select</h5>
          </div>
          <!-- body -->
          <div class="card-body p-3">
            <v-strategy-select @update="loadBot()"></v-strategy-select>
          </div>
        </div>
      </div>
      
      <!-- finish -->
      <div v-else class="card py-5 shadow-sm">
        <div class="card-body d-flex align-items-center justify-content-center">
          <div class="row justify-content-center w-100">
            <div class="col-10 col-sm-8 text-center">
              <h1>You're all set!</h1>
              <router-link to="/" class="btn btn-primary btn-block" replace>Finish</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import vBroker from '@/components/v-broker.vue';
import vAlphainsider from '@/components/v-alphainsider.vue';
import vStrategySelect from '@/components/v-strategy-select.vue';

export default {
  components: {vBroker, vAlphainsider, vStrategySelect},
  mounted() {
    this.loadBot();
  },
  methods: {
    async loadBot() {
      await this.$store.dispatch('getBotInfo');
      await this.$store.dispatch('getAllocation');
    }
  }
}
</script>