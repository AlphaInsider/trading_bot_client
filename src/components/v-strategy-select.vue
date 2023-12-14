<template>
<div>
  <validation-observer v-slot="event">
    <form @submit.prevent="event.handleSubmit(() => updateAllocation(event))">
      <!-- search strategy -->
      <v-strategy-search :strategy-type="'stock'" @input="strategy = $event"></v-strategy-search>
      
      <div v-if="strategy" class="mt-3">
        <!-- strategy view -->
        <div class="card">
          <div class="card-body">
            <v-strategy :strategy="strategy"></v-strategy>
          </div>
        </div>
        
        <!-- multiplier -->
        <h5 class="text-primary mb-0 mt-3">Multiplier</h5>
        <div class="row mt-1">
          <div class="col-12">
            <p class="mb-0">Trading Multiplier</p>
          </div>
          <div class="col-12">
            <validation-provider name="multiplier" :rules="rules.multiplier" v-slot="{ errors }">
              <div :class="{'is-invalid': errors.length}" class="input-group">
                <input v-model="multiplier" :class="{'is-invalid': errors.length}" type="number" step="0.001" class="form-control"/>
              </div>
              <div class="invalid-feedback">{{ errors[0] }}</div>
            </validation-provider>
          </div>
        </div>
        
        <!-- allocation -->
        <h5 class="text-primary mb-0 mt-3">Bot Allocation</h5>
        <!-- current allocation -->
        <div v-if="initialAllocation" class="row mt-1">
          <div class="col-12">
            <p class="m-0">Current allocation</p>
          </div>
          <div class="col-12">
            <input-mask
            v-model="initialAllocation"
            mask="$ num"
            :blocks="{num: {mask: Number, scale: 15, thousandsSeparator: ',', radix: '.'}}"
            :unmask="true"
            :lazy="false"
            class="form-control"
            disabled
            ></input-mask>
          </div>
        </div>
        <!-- new allocation -->
        <div class="row mt-1">
          <div class="col-12">
            <p class="m-0">New allocation</p>
          </div>
          <div class="col-12">
            <validation-provider name="allocation" :rules="rules.allocation" v-slot="{ errors }">
              <div :class="{'is-invalid': errors.length}" class="input-group">
                <input-mask
                v-model="allocation"
                mask="$ num"
                :blocks="{num: {mask: Number, scale: 15, thousandsSeparator: ',', radix: '.'}}"
                :unmask="true"
                :lazy="false"
                :class="{'is-invalid': errors.length}"
                class="form-control"
                ></input-mask>
              </div>
              <div class="invalid-feedback">{{ errors[0] }}</div>
            </validation-provider>
          </div>
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
      strategy: undefined,
      // misc
      multiplier: '1',
      allocation: '0'
    };
  },
  computed: {
    rules() {
      let multiplierRules = {min_value: '1', max_value: '1.67', required: false};
      let allocationRules = {min_value: '100', max_value: this.$store.state.bot.broker.value, required: true};
      return {
        multiplier: multiplierRules,
        allocation: allocationRules
      };
    },
    //TODO: 
    initialAllocation() {
      return (this.$store.state.bot.broker ? math.evaluate('bignumber(a) - (bignumber(a) - bignumber(b)) - round(bignumber(c) / 100, 2))', {a: this.$store.state.bot.broker.buying_power, b: this.$store.state.bot.broker.value, c: this.$store.state.bot.buffer_amount}).toString() : '0');
    },
    // TODO:
    bufferAmount() {
      return (this.$store.state.bot.broker ? math.evaluate('round((bignumber(a) + (bignumber(b) - bignumber(c))) * 100)', {a: this.allocation, b: this.$store.state.bot.broker.buying_power, c: this.$store.state.bot.broker.value}).toString() : '0');
    }
  },
  async mounted() {
    this.strategy = await this.$store.dispatch('getAllocation');
  },
  methods: {
    async updateAllocation() {
      //update allocation and buffer amount
      try {
        //request updateAllocation
        await this.$store.dispatch('request', {
          type: 'post',
          auth: true,
          url: 'updateAllocation',
          query: {
            strategy_id: this.strategy.strategy_id,
            multiplier: this.multiplier
          }
        });
        
        //request updateSettings
        await this.$store.dispatch('request', {
          type: 'post',
          auth: true,
          url: 'updateSettings',
          query: {
            buffer_amount: this.bufferAmount
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