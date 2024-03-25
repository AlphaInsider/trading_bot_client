<template>
<div>
  <!-- bot allocation -->
  <div class="card">
    <!-- title -->
    <div class="card-header d-flex align-items-center bg-white">
      <h5 class="text-primary mb-0">Strategies</h5>
      <div class="d-flex ml-auto">
        <button @click="showStrategySelectModal=true" :disabled="!$store.state.bot.alphainsider || !$store.state.bot.broker" type="button" class="btn btn-light btn-sm border ml-auto"><i class="fas fa-pencil-alt"></i> Edit</button>
      </div>
    </div>
    <!-- body -->
    <div class="card-body">
      <div v-if="$store.state.allocation.length > 0">
        <div v-for="(strategy, index) in $store.state.allocation" :key="strategy.strategy_id">
          <v-strategy :strategy="strategy"></v-strategy>
          <hr v-if="index !== $store.state.allocation.length-1">
        </div>
      </div>
      <div v-else class="d-flex-column bg-light rounded text-center py-4 mt-1">
        <h5 class="my-2">No Strategy Selected</h5>
      </div>
    </div>
  </div>
  
  <!-- general settings -->
  <div class="card mt-3">
    <!-- title -->
    <div class="d-flex card-header bg-white">
      <h5 class="text-primary mb-0">General Settings</h5>
    </div>
    <!-- body -->
    <div class="card-body">
      <!-- rebalance_on_start -->
      <div class="d-flex align-items-center p-1">
        <div>
          <p class="mb-0">Rebalance On Start</p>
          <small class="text-muted">Rebalance immediately when the trading bot starts.</small>
        </div>
        <div class="custom-control custom-switch ml-auto">
          <input @input="updateSettings({rebalance_on_start: !$store.state.bot.rebalance_on_start})" :checked="$store.state.bot.rebalance_on_start" type="checkbox" class="custom-control-input" id="rebalanceOnStart-switch">
          <label class="custom-control-label pointer" for="rebalanceOnStart-switch"></label>
        </div>
      </div>
      
      <!-- close_on_stop -->
      <div class="d-flex align-items-center p-1">
        <div>
          <p class="mb-0">Close On Stop</p>
          <small class="text-muted">Close all positions when the trading bot stops.</small>
        </div>
        <div class="custom-control custom-switch ml-auto">
          <input @input="updateSettings({close_on_stop: !$store.state.bot.close_on_stop})" :checked="$store.state.bot.close_on_stop" type="checkbox" class="custom-control-input" id="closeOnStop-switch">
          <label class="custom-control-label pointer" for="closeOnStop-switch"></label>
        </div>
      </div>
    </div>
  </div>
  
  <!-- modals -->
  <v-modal v-if="showStrategySelectModal" @close="showStrategySelectModal=false">
    <div class="card">
      <!-- title -->
      <div class="card-header bg-white d-flex p-3">
        <h5 class="text-primary mb-0">Strategy Select</h5>
        <h5 @click="showStrategySelectModal = false" class="mb-0 ml-auto"><i class="far fa-times text-muted pointer"></i></h5>
      </div>
      <!-- body -->
      <div class="card-body p-3">
        <v-setup-strategy @update="$router.go()"></v-setup-strategy>
      </div>
    </div>
  </v-modal>
</div>
</template>


<script>
import vStrategy from '@/components/v-strategy.vue';
import vSetupStrategy from '@/components/v-setup-strategy.vue';
import vModal from '@/components/v-modal.vue';

export default {
  components: {vStrategy, vSetupStrategy, vModal},
  data() {
    return {
      // strategies
      allocation: [],
      strategies: [],
      // modal
      showStrategySelectModal: false
    };
  },
  async mounted() {
    await this.$store.dispatch('getBotInfo');
    await this.$store.dispatch('getAllocation');
  },
  methods: {
    async updateSettings(setting) {
      // update bot settings
      return Promise.resolve()
      .then(async () => {
        // request updaateSettings
        await this.$store.dispatch('request', {
          type: 'post',
          auth: true,
          url: 'updateSettings',
          query: setting
        });
        
        // get bot info
        await this.$store.dispatch('getBotInfo');
      })
      // error
      .catch((error) => {
        toastr.error('Failed to update bot trading settings.');
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-btn {
  color: var(--secondary);
  &.active, &:hover {
    background: var(--light);
  }
  &.btn:focus {
    outline: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
}
</style>