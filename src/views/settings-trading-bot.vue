<template>
<div>
  <!-- bot allocation -->
  <div class="card">
    <!-- title -->
    <div class="card-header d-flex align-items-center bg-white">
      <h5 class="text-primary mb-0">AlphaInsider API</h5>
      <div class="d-flex ml-auto">
        <button @click="showStrategySelectModal=true" type="button" class="btn btn-light btn-sm border ml-auto"><i class="fas fa-pencil-alt"></i> Edit</button>
      </div>
    </div>
    <!-- body -->
    <div class="card-body">
      <div v-if="strategies.length > 0">
        <div v-for="(strategy, index) in strategies" :key="strategy.strategy_id">
          <v-strategy :strategy="strategy"></v-strategy>
          <hr v-if="index !== strategies.length-1">
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
      <!-- bot error handling -->
      <div class="p-1">
        <!-- checkbox -->
        <div class="d-flex align-items-center">
          <div>
            <p class="mb-0">Close On Stop</p>
            <small class="text-muted">Close all positions when the trading bot stops.</small>
          </div>
          <div class="custom-control custom-switch ml-auto">
            <input @change="updateCloseOnStop()" v-model="closeOnStop" type="checkbox" class="custom-control-input" id="subscription-switch">
            <label class="custom-control-label pointer" for="subscription-switch"></label>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- modals -->
  <v-modal v-if="showStrategySelectModal" @close="showStrategySelectModal=false">
    <v-strategy-select @update="($event) => updateStrategy($event)"></v-strategy-select>
  </v-modal>
</div>
</template>


<script>
import vStrategy from "@/components/v-strategy.vue";
import vAlphainsider from "@/components/v-alphainsider.vue";
import vStrategySelect from '@/components/v-strategy-select.vue';
import vModal from '@/components/v-modal.vue';

export default {
  components: {vAlphainsider, vStrategy, vStrategySelect, vModal},
  data() {
    return {
      // strategy
      strategies: [],
      // general
      closeOnStop: true,
      // modal
      showStrategySelectModal: false
    };
  },
  mounted() {},
  methods: {
    updateStrategy(strategies) {
      this.showStrategySelectModal = false;
      this.strategies = strategies;
    },
    updateCloseOnStop() {
      this.closeOnStop = !this.closeOnStop;
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