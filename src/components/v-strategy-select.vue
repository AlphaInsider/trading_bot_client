<template>
<div>
  <validation-observer v-slot="event">
    <form @submit.prevent="event.handleSubmit(() => updateAllocation(event))">
      <!-- search strategy -->
      <v-strategy-search :strategy-type="'stock'" @input="strategy = $event"></v-strategy-search>
      
      <!-- selected strategy -->
      <div v-if="strategy" class="card mt-3">
        <div class="card-body">
          <v-strategy :strategy="strategy"></v-strategy>
        </div>
      </div>
      <div v-else :class="((event.failed && !strategy) ? 'text-danger border border-danger' : 'text-muted')" class="d-flex-column bg-light rounded text-center py-4 mt-3">
        <h5 class="my-2">No Strategy Selected</h5>
      </div>
      
      <!-- save changes -->
      <div class="row mt-3">
        <div class="col-12 d-flex justify-content-end">
          <button :disabled="!strategy" type="submit" class="btn btn-primary">Save</button>
        </div>
      </div>
      
    </form>
  </validation-observer>
</div>
</template>

<script>
import vStrategy from '@/components/v-strategy.vue';
import vStrategySearch from '@/components/v-strategy-search.vue';

export default {
  components: {vStrategy, vStrategySearch},
  data() {
    return {
      strategy: undefined
    };
  },
  async mounted() {
    this.strategy = await this.$store.dispatch('getAllocation');
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
            strategy_id: this.strategy.strategy_id
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