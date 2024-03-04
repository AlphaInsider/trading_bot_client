<template>
<div>
  <!-- search strategy -->
  <v-strategy-search @input="strategies = [$event]"></v-strategy-search>

  <div v-if="strategies.length > 0" class="mt-3">
    <!-- strategy list -->
    <div v-for="(strategy, index) in strategies" :key="strategy.strategy_id" :class="{'mt-2': index > 0}" class="card">
      <div class="card-body">
        <v-strategy :strategy="strategy"></v-strategy>
      </div>
    </div>
  </div>

  <div v-else class="d-flex-column bg-light rounded text-muted text-center py-4 mt-3">
    <h5 class="my-2">No Strategies Selected</h5>
  </div>

  <!-- save changes -->
  <div class="row mt-3">
    <div class="col-12 d-flex justify-content-end">
      <button @click="updateAllocation()" :disabled="strategies.length <= 0" type="submit" class="btn btn-primary">Save</button>
    </div>
  </div>
</div>
</template>

<script>
import vStrategy from '@/components/v-strategy.vue';
import vStrategySearch from '@/components/v-strategy-search.vue';

export default {
  components: {vStrategy, vStrategySearch},
  data() {
    return {
      strategies: []
    };
  },
  async mounted() {
    this.strategies = await this.$store.dispatch('getAllocation');
  },
  methods: {
    async updateAllocation() {
      //update allocation
      try {
        //request updateAllocation
        await this.$store.dispatch('request', {
          type: 'post',
          auth: true,
          url: 'updateAllocation',
          query: {
            strategy_id: this.strategies[0].strategy_id
          }
        });
        
        //success, emit update
        this.$emit('update');
      }
      //error
      catch(error) {
        toastr.error('Failed to update bot trading settings.');
      }
    }
  }
}
</script>