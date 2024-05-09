<template>
<div>
  <!-- search strategy -->
  <v-subscription-search :excludes="$_.map(strategies, 'strategy_id')" @input="strategies = $_.concat({...$event, percent: '0'}, strategies)"></v-subscription-search>
  
  <div v-if="strategies.length > 0" class="mt-3">
    <!-- percent invalid -->
    <p v-if="!validPercent" class="d-flex text-center text-danger mb-0">Total percent must be below 100.</p>
    <!-- strategy list -->
    <div v-for="(strategy, index) in strategies" :key="strategy.strategy_id" :class="{'mt-2': index > 0, 'border-danger': !validPercent}" class="card">
      <div class="card-header d-flex align-items-center">
        <h6 class="mb-0">Allocation Percent:</h6>
        <!-- set allocation percent -->
        <div class="input-percent ml-auto">
          <validation-provider name="Allocation" rules="min_value:0|max_value:100|required" v-slot="{ errors }">
            <input-mask
            v-model="strategy.percent"
            mask="% num"
            :blocks="{num: {mask: /^(100|[1-9]?[0-9])$/}}"
            :unmask="true"
            :lazy="false"
            :class="{'is-invalid': errors.length || !validPercent}"
            class="form-control"
            ></input-mask>
          </validation-provider>
        </div>
        <!-- delete allocation  -->
        <button type="button" @click="strategies.splice(index, 1)" class="btn ml-2 p-0"><i class="text-danger fas fa-trash"></i></button>
      </div>
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
      <button @click="updateAllocations()" :disabled="strategies.length <= 0 || !validPercent" type="submit" class="btn btn-primary">Save</button>
    </div>
  </div>
</div>
</template>

<script>
import vStrategy from '@/components/v-strategy.vue';
import vSubscriptionSearch from '@/components/v-subscription-search.vue';

export default {
  components: {vStrategy, vSubscriptionSearch},
  data() {
    return {
      allocations: [],
      strategies: []
    };
  },
  computed: {
    validPercent() {
      return math.evaluate('sum(a) <= 100', {a: _.map(this.strategies, 'percent')});
    }
  },
  watch: {
    allocations: {
      handler(newVal, oldVal) {
        //update strategy listing
        let strategies = _.map(newVal, (allocation) => {
          return {
            ...allocation.strategy,
            percent: math.evaluate('floor(bignumber(a) * 100)', {a: allocation.percent}).toString()
          };
        });
        this.strategies = _.chain(this.strategies).concat(strategies).uniqBy('strategy_id').value();
      },
      deep: true
    }
  },
  async mounted() {
    this.allocations = await this.$store.dispatch('getAllocations');
  },
  methods: {
    async updateAllocations() {
      //update allocation
      return Promise.resolve()
      .then(async () => {
        //request updateAllocation
        await this.$store.dispatch('request', {
          type: 'post',
          auth: true,
          url: 'updateAllocations',
          query: {
            bot_id: this.$store.state.bot.bot_id,
            allocations: _.map(this.strategies, (strategy) => {
              return {
                strategy_id: strategy.strategy_id,
                percent: math.evaluate('bignumber(a) / 100', {a: strategy.percent}).toString()
              };
            })
          }
        });
        
        //get allocations
        this.allocations = await this.$store.dispatch('getAllocations');
        
        //success, emit update
        this.$emit('update');
      })
      //error
      .catch((error) => {
        toastr.error('Failed to update bot trading settings.');
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.input-percent {
  width: 70px;
}
input {
  &.is-invalid {
    padding-right: 0.75rem !important;
    background-image: none !important;
  }
}
</style>