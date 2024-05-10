<template>
<div>
  <!-- watch websockets -->
  <v-websocket :channels="['wsAllocations:'+$store.state.bot.bot_id]" @message="$store.dispatch('setAllocations', {allocations: $event})"></v-websocket>
  
  <!-- bot allocation -->
  <div class="card">
    <!-- title -->
    <div class="card-header d-flex align-items-center bg-white">
      <h5 class="text-primary mb-0">Strategies</h5>
      <div class="d-flex ml-auto">
        <router-link :to="{name: 'setup', query: {step: '2'}}"  class="btn btn-light btn-sm border ml-auto"><i class="fas fa-pencil-alt"></i> Edit</router-link>
      </div>
    </div>
    <!-- body -->
    <div class="card-body p-3">
      <div v-if="$store.state.allocations.length > 0">
        <div class="card" :class="{'mt-2': index > 0}" v-for="(allocation, index) in $store.state.allocations" :key="allocation.allocation_id">
          <div class="card-header d-flex">
            <h6 class="align-self-center mb-0">Allocation Percent:</h6>
            <p class="ml-auto mb-0">% {{ $math.evaluate('floor(bignumber(a) * 100)', {a: allocation.percent}).toString() }}</p>
          </div>
          <div class="card-body">
            <v-strategy :strategy="allocation.strategy"></v-strategy>
          </div>
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
</div>
</template>


<script>
import vStrategy from '@/components/v-strategy.vue';
import vWebsocket from '@/components/v-websocket.vue';

export default {
  components: {vStrategy, vWebsocket},
  async mounted() {
    await this.$store.dispatch('getBotInfo');
    await this.$store.dispatch('getAllocations');
  },
  methods: {
    async updateSettings(setting) {
      //update bot settings
      return Promise.resolve()
      .then(async () => {
        //request updateBot
        await this.$store.dispatch('request', {
          type: 'post',
          auth: true,
          url: 'updateBot',
          query: {
            ...setting,
            bot_id: this.$store.state.bot.bot_id
          }
        });
        
        //get bot info
        await this.$store.dispatch('getBotInfo');
      })
      //error
      .catch((error) => {
        toastr.error('Failed to update bot settings.');
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